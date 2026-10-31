import { ForbiddenException, ServiceUnavailableException } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { PostgresAiBudgetProjection, PostgresAiBudgetReservations, PostgresFinancialUnitOfWork,
  type AiReservationRequest, type FinancialPool } from "@laborator/db";
import { type AuthenticatedRequestContext } from "../auth/request-context.types";
import { type DatabaseAiGovernanceRepository } from "./ai-governance.repository";
import { type AgentExecutionTask } from "./ai-execution.types";
import { projectGovernanceBudgets } from "./ai-budget-policy-projection";

export type SpendingQuote = Pick<AiReservationRequest,
  "tariffId" | "maximum" | "maximumInputTokens" | "maximumOutputTokens" | "expiresAt" | "idempotencyKey">;

/** The authenticated human is the spend principal; no service-account/agent impersonation. */
export class AiSpendingService {
  constructor(private readonly repository: DatabaseAiGovernanceRepository, private readonly pool: FinancialPool | null) {}

  async onModuleDestroy() {
    await (this.pool as (FinancialPool & { end?: () => Promise<void> }) | null)?.end?.();
  }

  async reserve(actor: AuthenticatedRequestContext, task: AgentExecutionTask, quote: SpendingQuote,
    authorizeResource: () => Promise<void>) {
    try {
      const receipt = await this.reserveAuthorized(actor, task, quote, authorizeResource);
      await this.repository.appendAuditEvent({ id: randomUUID(), organizationId: actor.organizationId, actorId: actor.userId,
        action: "AI_SPENDING_RESERVED", humanFinalAuthority: true, createdAt: new Date().toISOString(),
        afterState: { ...receipt, executionId: task.id, correlationId: task.correlationId } });
      return receipt;
    } catch (error) {
      if (actor.userId && actor.organizationId) await this.repository.appendAuditEvent({ id: randomUUID(),
        organizationId: actor.organizationId, actorId: actor.userId, action: "AI_SPENDING_DENIED", humanFinalAuthority: true,
        createdAt: new Date().toISOString(), afterState: { correlationId: task.correlationId, reason: "AUTHORIZATION_OR_RESERVATION_DENIED" } });
      throw error;
    }
  }

  private async reserveAuthorized(actor: AuthenticatedRequestContext, task: AgentExecutionTask, quote: SpendingQuote,
    authorizeResource: () => Promise<void>) {
    if (!actor.userId || actor.organizationId !== task.organizationId || actor.userId !== task.userId ||
      !actor.roles.some((role) => role === "ADMIN" || role === "PLATFORM_CREATOR") ||
      actor.roles.some((role) => /(^|_)(AI|AGENT|SYSTEM|AUTOMATION)($|_)/u.test(role.toUpperCase())) ||
      !actor.canonicalPermissions?.includes("platform.admin.manage")) {
      throw new ForbiddenException("Explicit human administrative spending authority required.");
    }
    if (!this.pool) throw new ServiceUnavailableException("Financial PostgreSQL is not configured.");
    const context = { organizationId: actor.organizationId, actorId: actor.userId };
    return this.repository.withFinancialSource(async (source) => {
      await authorizeResource();
      const registry = this.repository.findAgentRegistry(actor.organizationId, task.canonicalAgentId);
      const version = registry && this.repository.listAgentVersions(actor.organizationId, registry.id)
        .find((candidate) => candidate.id === task.agentVersionId);
      if (!registry?.enabled || registry.activeVersionId !== task.agentVersionId || version?.status !== "ACTIVE" ||
        !version.approvedBy || !version.activatedBy || version.configurationSha256 !== task.configurationSha256 ||
        !version.validatedHandlerKeys?.includes(task.binding.handlerKey) ||
        !version.bindings.some((binding) => JSON.stringify(binding) === JSON.stringify(task.binding))) {
        throw new ForbiddenException("Human-approved configuration required.");
      }
      const unit = new PostgresFinancialUnitOfWork(this.pool!);
      const snapshot = projectGovernanceBudgets(actor.organizationId, source);
      const projection = await new PostgresAiBudgetProjection(unit).synchronize(context, snapshot, task.correlationId);
      // Still under the source fence; no policy writer can race this hash or reservation.
      await authorizeResource();
      return new PostgresAiBudgetReservations(unit).reserve({ ...quote, context, projection,
        executionId: task.id, projectId: task.projectId, agentId: task.agentId,
        agentVersionId: task.agentVersionId, configurationSha256: task.configurationSha256, correlationId: task.correlationId });
    }, actor.organizationId);
  }
}
