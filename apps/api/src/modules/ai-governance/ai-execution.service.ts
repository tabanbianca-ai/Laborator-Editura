import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException, Inject, Optional } from "@nestjs/common";
import { type AiSpendingService } from "./ai-spending.service";
import { createHash, randomUUID } from "node:crypto";
import { z } from "zod";
import { type AuthenticatedRequestContext } from "../auth/request-context.types";
import { DocumentsService } from "../documents/documents.service";
import { WorkspaceService } from "../workspace/workspace.service";
import { WorkflowService } from "../workflow/workflow.service";
import { DatabaseAiGovernanceRepository } from "./ai-governance.repository";
import { AiGovernanceService } from "./ai-governance.service";
import { resolveAiAgentIdentity } from "./ai-agent-identity";
import { AiHandlerRegistry } from "./ai-handler-registry";
import { AiExecutionRepository } from "./ai-execution.repository";
import { type AgentExecutionTask, type AgentTaskStatus } from "./ai-execution.types";
import { resourceSchema, localReportSchema, type LocalHandlerInput } from "./ai-handler.contract";

const taskSchema = z.object({
  agentId: z.string().min(1).max(120), operationId: z.string().min(1).max(120),
  projectId: z.string().min(1).max(120), documentId: z.string().min(1).max(120).optional(),
  resource: resourceSchema.optional(),
  segmentId: z.string().min(1).max(120).optional(),
  explicitExternalProcessingAuthorization: z.boolean().optional(),
  idempotencyKey: z.string().min(1).max(120)
}).strict();
const terminal = new Set<AgentTaskStatus>(["COMPLETED", "FAILED", "CANCELLED", "BLOCKED"]);
const resultSchema = z.object({
  readiness: z.enum(["READY", "READY_WITH_WARNINGS"]),
  issues: z.array(z.enum(["MISSING_TITLE", "MISSING_ORIGINAL_LANGUAGE"])).max(2),
  humanApprovalRequired: z.literal(true)
}).strict();

@Injectable()
export class AiExecutionService {
  private readonly controllers = new Map<string, AbortController>();
  constructor(
    private readonly repository: AiExecutionRepository,
    private readonly governanceRepository: DatabaseAiGovernanceRepository,
    private readonly governance: AiGovernanceService,
    private readonly handlers: AiHandlerRegistry,
    private readonly documents: DocumentsService,
    private readonly workspace: WorkspaceService,
    private readonly workflow: WorkflowService,
    @Optional() @Inject("AI_SPENDING") private readonly spending?: AiSpendingService
  ) {}

  async reserveSpending(actor: AuthenticatedRequestContext, taskId: string, input: unknown) {
    const parsed = z.object({
      explicitSpendingAuthorization: z.literal(true), tariffId: z.string().uuid(),
      maximum: z.object({ units: z.string().regex(/^(0|[1-9][0-9]*)$/u), currency: z.string().regex(/^[A-Z]{3}$/u),
        scale: z.number().int().min(0).max(9) }).strict(),
      maximumInputTokens: z.string().regex(/^(0|[1-9][0-9]*)$/u), maximumOutputTokens: z.string().regex(/^(0|[1-9][0-9]*)$/u),
      expiresAt: z.string().datetime(), idempotencyKey: z.string().min(1).max(120)
    }).strict().safeParse(input);
    if (!parsed.success) throw new BadRequestException("Explicit validated spending authorization required.");
    if (!this.spending) throw new ForbiddenException("Financial reservation service unavailable.");
    const task = this.get(actor, taskId);
    if (task.userId !== actor.userId || task.status !== "CREATED") throw new ForbiddenException();
    return this.spending.reserve(actor, task, parsed.data, async () => {
      const current = this.get(actor, taskId);
      if (current.status !== "CREATED") throw new ForbiddenException();
      await this.authorize(actor, current);
    });
  }

  create(actor: AuthenticatedRequestContext, input: unknown) {
    this.assertActor(actor);
    const parsed = taskSchema.safeParse(input);
    if (!parsed.success) throw new BadRequestException("Invalid AI task request.");
    const request = parsed.data;
    const identity = resolveAiAgentIdentity(request.agentId);
    if (identity.status !== "RESOLVED") throw new BadRequestException("Unknown or ambiguous agent.");
    const registry = this.governanceRepository.findAgentRegistry(actor.organizationId, identity.identity.agentId);
    const version = registry && this.governanceRepository.listAgentVersions(actor.organizationId, registry.id)
      .find((candidate) => candidate.id === registry.activeVersionId);
    if (!registry?.enabled || version?.status !== "ACTIVE" || !version.approvedBy || !version.activatedBy) {
      throw new ForbiddenException("Agent has no human-activated configuration.");
    }
    const binding = version.bindings.find((candidate) => candidate.operationId === request.operationId);
    if (!binding || !version.validatedHandlerKeys?.includes(binding.handlerKey) ||
      !this.handlers.validate(identity.identity.agentId, binding)) {
      throw new ForbiddenException("Executable handler binding has not been validated.");
    }
    const resource = request.resource ?? (request.documentId ? { type: "DOCUMENT" as const, id: request.documentId } : undefined);
    const descriptor = this.handlers.descriptor(identity.identity.agentId, binding);
    if (!resource || !descriptor?.inputSchema.safeParse({ projectId: request.projectId, resource,
      segmentId: request.segmentId, explicitExternalProcessingAuthorization: request.explicitExternalProcessingAuthorization }).success ||
      request.documentId && (resource.type !== "DOCUMENT" || request.documentId !== resource.id)) {
      throw new BadRequestException("Resource does not match the handler input schema.");
    }
    const now = new Date().toISOString();
    const created = this.repository.create({
      id: randomUUID(), organizationId: actor.organizationId, userId: actor.userId,
      agentId: registry.id, canonicalAgentId: identity.identity.agentId,
      agentVersionId: version.id, configurationSha256: version.configurationSha256,
      binding, projectId: request.projectId, documentId: resource.type === "DOCUMENT" ? resource.id : undefined,
      resource,
      segmentId: request.segmentId,
      explicitExternalProcessingAuthorization: request.explicitExternalProcessingAuthorization,
      idempotencyKey: request.idempotencyKey,
      requestHash: createHash("sha256").update(JSON.stringify({
        agentId: identity.identity.agentId, operationId: request.operationId,
        projectId: request.projectId, documentId: resource.type === "DOCUMENT" ? resource.id : undefined,
        versionId: version.id,
        ...(request.segmentId ? { segmentId: request.segmentId } : {}),
        ...(request.explicitExternalProcessingAuthorization !== undefined
          ? { explicitExternalProcessingAuthorization: request.explicitExternalProcessingAuthorization } : {}),
        ...(resource.type !== "DOCUMENT" ? { resource } : {})
      })).digest("hex"),
      correlationId: randomUUID(), status: "CREATED", createdAt: now, updatedAt: now,
      inputTokens: 0, outputTokens: 0, actualCost: 0, currency: "EUR"
    });
    // Idempotent creation must not expose a previous result without a fresh read authorization.
    return { ...created, result: undefined };
  }

  get(actor: AuthenticatedRequestContext, taskId: string) {
    this.assertActor(actor);
    const task = this.repository.get(actor.organizationId, taskId);
    if (!task || (task.userId !== actor.userId && !actor.roles.includes("ADMIN") &&
      !actor.roles.includes("PLATFORM_CREATOR"))) throw new NotFoundException("AI task not found.");
    return task;
  }

  async read(actor: AuthenticatedRequestContext, taskId: string) {
    const task = this.get(actor, taskId);
    await this.resourceAccess(actor, task);
    if (task.result && task.canonicalAgentId !== "quality-agent") {
      await this.handlers.authorizeResult(task.canonicalAgentId, task.binding, actor, this.resourceInput(task), task.result);
    }
    return task;
  }

  schedule(actor: AuthenticatedRequestContext, taskId: string) {
    const task = this.get(actor, taskId);
    if (task.userId !== actor.userId || task.status !== "CREATED") {
      throw new ConflictException("Only the requesting user can run a created task.");
    }
    setImmediate(() => { void this.execute(actor, taskId).catch(() => undefined); });
    return task;
  }

  cancel(actor: AuthenticatedRequestContext, taskId: string) {
    const task = this.get(actor, taskId);
    if (terminal.has(task.status)) throw new ConflictException("Task is already terminal.");
    const cancelled = this.repository.save({ ...task, status: "CANCELLED", updatedAt: new Date().toISOString() },
      task.status, actor.userId);
    this.controllers.get(taskId)?.abort();
    return cancelled;
  }

  async execute(actor: AuthenticatedRequestContext, taskId: string): Promise<AgentExecutionTask> {
    let task = this.get(actor, taskId);
    if (task.userId !== actor.userId || task.status !== "CREATED") {
      throw new ConflictException("Task is not eligible for execution.");
    }
    const release = this.repository.acquireExecution();
    const controller = new AbortController();
    let timeout: ReturnType<typeof setTimeout> | undefined;
    this.controllers.set(taskId, controller);
    let running = false;
    try {
      timeout = setTimeout(() => controller.abort(), this.handlers.descriptor(task.canonicalAgentId, task.binding)?.timeoutMs ?? 5000);
      const metadata = await this.authorize(actor, task);
      if (this.handlers.descriptor(task.canonicalAgentId, task.binding)?.metadata.externalProcessing) {
        throw new ForbiddenException("PAID_EXECUTION_DISABLED_PENDING_P0_C");
      }
      this.assertConfiguration(actor, task);
      task = this.move(this.get(actor, taskId), "AUTHORIZED");
      if (task.status !== "AUTHORIZED") throw new ConflictException("Task authorization failed.");
      task = this.move(task, "RUNNING");
      running = true;
      const result = task.canonicalAgentId === "quality-agent"
        ? resultSchema.parse(await this.handlers.execute(task.canonicalAgentId, task.binding, metadata, controller.signal))
        : localReportSchema.parse(await this.handlers.executeResource(task.canonicalAgentId, task.binding, actor,
          this.resourceInput(task), controller.signal));
      await this.resourceAccess(actor, task);
      this.assertConfiguration(actor, task);
      if (task.canonicalAgentId !== "quality-agent") {
        await this.handlers.authorizeResult(task.canonicalAgentId, task.binding, actor, this.resourceInput(task), result);
      }
      if (controller.signal.aborted && this.get(actor, taskId).status !== "CANCELLED") throw new Error("HANDLER_TIMEOUT");
      await this.recordUsage(actor, task, "SUCCEEDED");
      const current = this.get(actor, taskId);
      if (current.status === "CANCELLED") return current;
      task = this.move({ ...current, result, usageRecorded: true }, "COMPLETED");
      return task;
    } catch {
      const current = this.get(actor, taskId);
      if (terminal.has(current.status)) return current;
      let accountingFailed = false;
      if (running) {
        try { await this.recordUsage(actor, task, "FAILED"); }
        catch { accountingFailed = true; }
      }
      return this.move({ ...current, failureCode: accountingFailed ? "ACCOUNTING_FAILED" : running ? "HANDLER_FAILED" : "AUTHORIZATION_DENIED" },
        running ? "FAILED" : "BLOCKED");
    } finally {
      this.controllers.delete(taskId);
      if (timeout) clearTimeout(timeout);
      release();
    }
  }

  private assertConfiguration(actor: AuthenticatedRequestContext, task: AgentExecutionTask) {
    const identity = resolveAiAgentIdentity(task.canonicalAgentId);
    const registry = this.governanceRepository.findAgentRegistry(actor.organizationId, task.canonicalAgentId);
    const version = registry && this.governanceRepository.listAgentVersions(actor.organizationId, registry.id)
      .find((candidate) => candidate.id === task.agentVersionId);
    if (!registry?.enabled || registry.activeVersionId !== task.agentVersionId || version?.status !== "ACTIVE" ||
      identity.status !== "RESOLVED" || version.governanceVersion !== identity.identity.governanceVersion ||
      version.configurationSha256 !== task.configurationSha256 ||
      !version.validatedHandlerKeys?.includes(task.binding.handlerKey) ||
      !version.bindings.some((binding) => JSON.stringify(binding) === JSON.stringify(task.binding)) ||
      !this.handlers.validate(task.canonicalAgentId, task.binding)) throw new ForbiddenException();
    const bindings = version.bindings.map((binding) => ({
      capabilityId: binding.capabilityId, operationId: binding.operationId, handlerKey: binding.handlerKey,
      inputSchemaRef: binding.inputSchemaRef, outputSchemaRef: binding.outputSchemaRef,
      requiredPermissions: binding.requiredPermissions
    }));
    if (createHash("sha256").update(JSON.stringify({ bindings, governanceVersion: version.governanceVersion }))
      .digest("hex") !== task.configurationSha256) throw new ForbiddenException();
    if (this.governanceRepository.isAgentExecutionDisabled(actor.organizationId, task.agentId,
      task.canonicalAgentId, task.binding.operationId)) throw new ForbiddenException();
    return identity.identity;
  }

  private async authorize(actor: AuthenticatedRequestContext, task: AgentExecutionTask) {
    const identity = this.assertConfiguration(actor, task);
    const metadata = await this.resourceAccess(actor, task);
    const descriptor = this.handlers.descriptor(task.canonicalAgentId, task.binding)!;
    if (descriptor.workflowRequired) {
      if (!task.documentId) throw new ForbiddenException();
      const state = await this.workflow.getWorkflowStatus(actor, {
        projectId: task.projectId, documentId: task.documentId
      });
      if (!state || !descriptor.allowedWorkflowStates.includes(state.status)) throw new ForbiddenException();
    }
    await this.governance.authorizeAgentExecution(actor, {
      agentName: identity.canonicalName as Parameters<AiGovernanceService["authorizeAgentExecution"]>[1]["agentName"],
      executionType: task.binding.operationId, projectId: task.projectId, documentId: task.documentId,
      estimatedCost: descriptor.estimatedCost, inputTokens: 0, outputTokens: 0
    });
    await this.checkLimits(actor, task, identity.canonicalName);
    return metadata;
  }

  private resourceInput(task: AgentExecutionTask): LocalHandlerInput {
    const resource = task.resource ?? (task.documentId ? { type: "DOCUMENT" as const, id: task.documentId } : undefined);
    if (!resource) throw new ForbiddenException();
    return { projectId: task.projectId, resource, segmentId: task.segmentId,
      explicitExternalProcessingAuthorization: task.explicitExternalProcessingAuthorization };
  }

  private async resourceAccess(actor: AuthenticatedRequestContext, task: AgentExecutionTask) {
    const descriptor = this.handlers.descriptor(task.canonicalAgentId, task.binding);
    if (!descriptor) throw new ForbiddenException();
    const permissions = new Set<string>(actor.canonicalPermissions ?? []);
    if (![...task.binding.requiredPermissions, ...descriptor.requiredPermissions].every((permission) => permissions.has(permission))) throw new ForbiddenException();
    const input = descriptor.inputSchema.parse(this.resourceInput(task));
    const access = await this.workspace.evaluateNeedToKnowAccess(actor, {
      projectId: task.projectId, documentId: task.documentId, resourceId: input.resource.id,
      manuscriptId: input.resource.type === "MANUSCRIPT" ? input.resource.id : undefined,
      resourceType: descriptor.resourceScope, confidentialClassification: descriptor.classification,
      requestedAction: descriptor.operationId
    });
    if (access.decision !== "ALLOW") throw new ForbiddenException();
    if (task.canonicalAgentId !== "quality-agent") {
      await this.handlers.authorizeResource(task.canonicalAgentId, task.binding, actor, input);
      return {};
    }
    const document = await this.documents.getDocument(actor, input.resource.id);
    if (document.projectId !== task.projectId) throw new ForbiddenException();
    return { title: document.title, originalLanguage: document.originalLanguage };
  }

  private async checkLimits(actor: AuthenticatedRequestContext, task: AgentExecutionTask, agentName: string) {
    if (actor.roles.includes("PLATFORM_CREATOR")) return;
    const usage = await this.governanceRepository.listUsageRecords(actor.organizationId);
    const now = new Date();
    const matches = (scope: string, ref?: string, agent?: string) =>
      (scope === "ORGANIZATION" || scope === "MONTHLY" || scope === "PER_RUN" ||
       scope === "PROJECT" && ref === task.projectId || scope === "USER" && ref === actor.userId ||
       scope === "AGENT" && agent === agentName);
    const scoped = (scope: string, ref?: string, agent?: string) => usage.filter((record) =>
      (scope !== "PROJECT" || record.projectId === ref) &&
      (scope !== "USER" || record.userId === ref) && (!agent || record.agentName === agent));
    for (const budget of await this.governanceRepository.listBudgets(actor.organizationId)) {
      if (!matches(budget.budgetScope, budget.scopeRef, budget.agentName)) continue;
      if (budget.startsAt && Date.parse(budget.startsAt) > now.getTime() ||
        budget.endsAt && Date.parse(budget.endsAt) < now.getTime()) continue;
      const limit = budget.monthlyBudget ?? budget.amount;
      if (!Number.isFinite(limit) || limit < 0 || budget.currency !== "EUR" || budget.period === "CUSTOM") {
        throw new ForbiddenException("Budget cannot be safely evaluated.");
      }
      const consumed = scoped(budget.budgetScope, budget.scopeRef, budget.agentName)
        .filter((record) => record.createdAt.slice(0, 7) === now.toISOString().slice(0, 7))
        .reduce((sum, record) => sum + (record.actualCost ?? record.estimatedCost), 0);
      if (consumed >= limit) throw new ForbiddenException("Budget exhausted.");
    }
    for (const quota of await this.governanceRepository.listQuotas(actor.organizationId)) {
      if (!matches(quota.quotaScope, quota.scopeRef, quota.agentName)) continue;
      if ([quota.maxRunsPerDay, quota.maxRunsPerMonth, quota.maxTokensPerRun, quota.maxCostPerRun]
        .some((value) => value !== undefined && (!Number.isFinite(value) || value < 0))) {
        throw new ForbiddenException("Quota cannot be safely evaluated.");
      }
      const records = scoped(quota.quotaScope, quota.scopeRef, quota.agentName);
      const day = records.filter((record) => record.createdAt.slice(0, 10) === now.toISOString().slice(0, 10)).length;
      const month = records.filter((record) => record.createdAt.slice(0, 7) === now.toISOString().slice(0, 7)).length;
      if (quota.maxRunsPerDay !== undefined && day >= quota.maxRunsPerDay ||
        quota.maxRunsPerMonth !== undefined && month >= quota.maxRunsPerMonth ||
        quota.maxTokensPerRun !== undefined && quota.maxTokensPerRun < 0 ||
        quota.maxCostPerRun !== undefined && quota.maxCostPerRun < 0) throw new ForbiddenException("Quota exceeded.");
    }
  }

  private async recordUsage(actor: AuthenticatedRequestContext, task: AgentExecutionTask, status: "SUCCEEDED" | "FAILED") {
    const usage = await this.governanceRepository.listUsageRecords(actor.organizationId);
    if (usage.some((record) => record.metadata?.executionId === task.id)) return;
    const identity = resolveAiAgentIdentity(task.canonicalAgentId);
    if (identity.status !== "RESOLVED") throw new Error("IDENTITY_CHANGED");
    await this.governance.recordAgentExecution(actor, {
      agentName: identity.identity.canonicalName as Parameters<AiGovernanceService["recordAgentExecution"]>[1]["agentName"],
      executionType: task.binding.operationId, projectId: task.projectId, documentId: task.documentId,
      inputTokens: 0, outputTokens: 0, estimatedCost: 0, actualCost: 0, status,
      metadata: { executionId: task.id, correlationId: task.correlationId, deterministicLocalHandler: true }
    });
  }

  private move(task: AgentExecutionTask, status: AgentTaskStatus) {
    if (terminal.has(task.status)) throw new ConflictException("Task is terminal.");
    return this.repository.save({ ...task, status, updatedAt: new Date().toISOString() }, task.status);
  }

  private assertActor(actor: AuthenticatedRequestContext) {
    if (!actor.userId || !actor.organizationId || !actor.roles?.length ||
      actor.roles.some((role) => /(^|_)(AI|AGENT|SYSTEM|AUTOMATION)($|_)/u.test(role.toUpperCase()))) {
      throw new ForbiddenException("Authenticated human task initiator required.");
    }
  }
}
