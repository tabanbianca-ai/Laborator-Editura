import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { QaService } from "../qa/qa.service";
import { SemanticFidelityService } from "../semantic-fidelity/semantic-fidelity.service";
import { InMemoryWorkflowRepository } from "./workflow.repository";
import {
  type AdvanceWorkflowInput,
  type BlockWorkflowInput,
  type StartWorkflowInput,
  type UnblockWorkflowInput,
  type WorkflowActor,
  type WorkflowAuditAction,
  type WorkflowScope,
  type WorkflowState,
  type WorkflowStatus,
  type WorkflowTargetInput,
  type WorkflowTransition
} from "./workflow.types";

const NEXT_STATUS: Partial<Record<WorkflowStatus, WorkflowStatus>> = {
  DRAFT: "IN_TRANSLATION",
  IN_TRANSLATION: "IN_QA",
  IN_QA: "IN_SEMANTIC_REVIEW",
  IN_SEMANTIC_REVIEW: "IN_REVIEW",
  IN_REVIEW: "APPROVED",
  APPROVED: "READY_FOR_EXPORT",
  READY_FOR_EXPORT: "EXPORTED"
};

const HUMAN_APPROVAL_ROLES = new Set(["ADMIN", "REVIEWER"]);

const HUMAN_FINAL_AUTHORITY_RULE =
  "AI may suggest and validation engines may check, but only authorized human roles can approve.";

@Injectable()
export class WorkflowService {
  constructor(
    private readonly repository: InMemoryWorkflowRepository,
    private readonly qaService: QaService,
    private readonly semanticFidelityService: SemanticFidelityService
  ) {}

  async startWorkflow(actor: WorkflowActor, input: StartWorkflowInput): Promise<WorkflowState> {
    this.validateActor(actor);
    this.validateTarget(input);
    const scope = input.scope ?? this.scopeForTarget(input);
    this.validateScope(scope, input.segmentId);

    const existing = await this.repository.findStateByTarget({
      ...input,
      organizationId: actor.organizationId
    });

    if (existing) {
      return existing;
    }

    const now = new Date().toISOString();
    const state: WorkflowState = {
      id: randomUUID(),
      organizationId: actor.organizationId,
      projectId: input.projectId,
      documentId: input.documentId,
      segmentId: input.segmentId,
      scope,
      status: "DRAFT",
      createdBy: actor.userId,
      updatedBy: actor.userId,
      createdAt: now,
      updatedAt: now,
      metadata: {
        humanFinalAuthority: HUMAN_FINAL_AUTHORITY_RULE,
        ...input.metadata
      }
    };

    const saved = await this.repository.createState(state);
    await this.recordTransition(actor, undefined, saved, "WORKFLOW_STARTED");

    return saved;
  }

  async getWorkflowStatus(
    actor: WorkflowActor,
    input: WorkflowTargetInput
  ): Promise<WorkflowState> {
    this.validateActor(actor);
    const state = await this.getExistingState(actor, input);

    return state;
  }

  async advanceWorkflow(
    actor: WorkflowActor,
    input: AdvanceWorkflowInput
  ): Promise<WorkflowState> {
    this.validateActor(actor);
    const existing = await this.getExistingState(actor, input);

    if (existing.status === "BLOCKED") {
      throw new BadRequestException("Blocked workflows must be unblocked before advancing.");
    }

    const toStatus = input.toStatus ?? NEXT_STATUS[existing.status];

    if (!toStatus || NEXT_STATUS[existing.status] !== toStatus) {
      throw new BadRequestException(`Invalid workflow transition from ${existing.status} to ${toStatus}.`);
    }

    await this.assertTransitionAllowed(actor, existing, toStatus);

    const updated = this.applyStatus(actor, existing, toStatus);
    const saved = await this.repository.updateState(updated);
    await this.recordTransition(
      actor,
      existing,
      saved,
      this.actionForStatus(toStatus),
      input.reason
    );

    return saved;
  }

  async blockWorkflow(actor: WorkflowActor, input: BlockWorkflowInput): Promise<WorkflowState> {
    this.validateActor(actor);

    if (!input.reason || input.reason.trim().length === 0) {
      throw new BadRequestException("reason is required to block workflow.");
    }

    const existing = await this.getExistingState(actor, input);
    const updated: WorkflowState = {
      ...existing,
      status: "BLOCKED",
      previousStatus: existing.status,
      blockedReason: input.reason,
      updatedBy: actor.userId,
      updatedAt: new Date().toISOString()
    };

    const saved = await this.repository.updateState(updated);
    await this.recordTransition(actor, existing, saved, "WORKFLOW_BLOCKED", input.reason);

    return saved;
  }

  async unblockWorkflow(
    actor: WorkflowActor,
    input: UnblockWorkflowInput
  ): Promise<WorkflowState> {
    this.validateActor(actor);
    const existing = await this.getExistingState(actor, input);

    if (existing.status !== "BLOCKED") {
      throw new BadRequestException("Only blocked workflows can be unblocked.");
    }

    const restoredStatus = existing.previousStatus ?? "DRAFT";
    const updated: WorkflowState = {
      ...existing,
      status: restoredStatus,
      previousStatus: undefined,
      blockedReason: undefined,
      updatedBy: actor.userId,
      updatedAt: new Date().toISOString()
    };

    const saved = await this.repository.updateState(updated);
    await this.recordTransition(actor, existing, saved, "WORKFLOW_UNBLOCKED", input.reason);

    return saved;
  }

  async approveDocument(actor: WorkflowActor, input: WorkflowTargetInput): Promise<WorkflowState> {
    this.validateActor(actor);
    this.assertAuthorizedHuman(actor);

    const existing = await this.getExistingState(actor, input);

    if (existing.scope !== "DOCUMENT") {
      throw new BadRequestException("Only document-level workflows can be approved.");
    }

    if (existing.status !== "IN_REVIEW") {
      throw new BadRequestException("Document must be in review before approval.");
    }

    await this.assertNoBlockingSemanticIssues(actor, existing);

    const updated = this.applyStatus(actor, existing, "APPROVED");
    const saved = await this.repository.updateState(updated);
    await this.recordTransition(actor, existing, saved, "DOCUMENT_APPROVED");

    return saved;
  }

  async markReadyForExport(
    actor: WorkflowActor,
    input: WorkflowTargetInput
  ): Promise<WorkflowState> {
    this.validateActor(actor);
    this.assertAuthorizedHuman(actor);

    const existing = await this.getExistingState(actor, input);

    this.assertDocumentWorkflow(existing);

    if (existing.status !== "APPROVED") {
      throw new BadRequestException("Cannot move to READY_FOR_EXPORT unless document is APPROVED.");
    }

    const updated = this.applyStatus(actor, existing, "READY_FOR_EXPORT");
    const saved = await this.repository.updateState(updated);
    await this.recordTransition(actor, existing, saved, "READY_FOR_EXPORT");

    return saved;
  }

  async markExported(actor: WorkflowActor, input: WorkflowTargetInput): Promise<WorkflowState> {
    this.validateActor(actor);
    this.assertAuthorizedHuman(actor);

    const existing = await this.getExistingState(actor, input);

    this.assertDocumentWorkflow(existing);

    if (existing.status !== "READY_FOR_EXPORT") {
      throw new BadRequestException("Cannot export unless status is READY_FOR_EXPORT.");
    }

    const updated = this.applyStatus(actor, existing, "EXPORTED");
    const saved = await this.repository.updateState(updated);
    await this.recordTransition(actor, existing, saved, "DOCUMENT_EXPORTED");

    return saved;
  }

  private async assertTransitionAllowed(
    actor: WorkflowActor,
    state: WorkflowState,
    toStatus: WorkflowStatus
  ): Promise<void> {
    if (toStatus === "IN_REVIEW") {
      await this.assertNoBlockingQaIssues(actor, state);
    }

    if (toStatus === "APPROVED") {
      this.assertAuthorizedHuman(actor);
      await this.assertNoBlockingSemanticIssues(actor, state);
    }

    if (toStatus === "READY_FOR_EXPORT" && state.status !== "APPROVED") {
      throw new BadRequestException("Cannot move to READY_FOR_EXPORT unless document is APPROVED.");
    }

    if (toStatus === "READY_FOR_EXPORT") {
      this.assertDocumentWorkflow(state);
      this.assertAuthorizedHuman(actor);
    }

    if (toStatus === "EXPORTED" && state.status !== "READY_FOR_EXPORT") {
      throw new BadRequestException("Cannot export unless status is READY_FOR_EXPORT.");
    }

    if (toStatus === "EXPORTED") {
      this.assertDocumentWorkflow(state);
      this.assertAuthorizedHuman(actor);
    }
  }

  private async assertNoBlockingQaIssues(
    actor: WorkflowActor,
    state: WorkflowState
  ): Promise<void> {
    const issues = await this.qaService.listIssues(actor, {
      documentId: state.documentId,
      segmentId: state.segmentId,
      status: "OPEN"
    });
    const blocker = issues.find((issue) => ["HIGH", "CRITICAL"].includes(issue.severity));

    if (blocker) {
      throw new BadRequestException(
        "Cannot move to IN_REVIEW if QA has unresolved HIGH or CRITICAL issues."
      );
    }
  }

  private async assertNoBlockingSemanticIssues(
    actor: WorkflowActor,
    state: WorkflowState
  ): Promise<void> {
    const issues = await this.semanticFidelityService.listIssues(actor, {
      documentId: state.documentId,
      segmentId: state.segmentId,
      status: "OPEN"
    });
    const blocker = issues.find((issue) => ["HIGH", "CRITICAL"].includes(issue.riskLevel));

    if (blocker) {
      throw new BadRequestException(
        "Cannot move to APPROVED if Semantic Fidelity has unresolved HIGH or CRITICAL issues."
      );
    }
  }

  private applyStatus(
    actor: WorkflowActor,
    existing: WorkflowState,
    status: WorkflowStatus
  ): WorkflowState {
    const now = new Date().toISOString();
    const next: WorkflowState = {
      ...existing,
      status,
      previousStatus: existing.status,
      blockedReason: undefined,
      updatedBy: actor.userId,
      updatedAt: now
    };

    if (status === "APPROVED") {
      next.approvedBy = actor.userId;
      next.approvedAt = now;
    }

    if (status === "EXPORTED") {
      next.exportedBy = actor.userId;
      next.exportedAt = now;
    }

    return next;
  }

  private actionForStatus(status: WorkflowStatus): WorkflowAuditAction {
    if (status === "APPROVED") {
      return "DOCUMENT_APPROVED";
    }

    if (status === "READY_FOR_EXPORT") {
      return "READY_FOR_EXPORT";
    }

    if (status === "EXPORTED") {
      return "DOCUMENT_EXPORTED";
    }

    return "WORKFLOW_ADVANCED";
  }

  private async getExistingState(
    actor: WorkflowActor,
    input: WorkflowTargetInput
  ): Promise<WorkflowState> {
    this.validateTarget(input);

    const state = await this.repository.findStateByTarget({
      ...input,
      organizationId: actor.organizationId
    });

    if (!state) {
      throw new NotFoundException("Workflow state not found.");
    }

    return state;
  }

  private async recordTransition(
    actor: WorkflowActor,
    beforeState: WorkflowState | undefined,
    afterState: WorkflowState,
    action: WorkflowAuditAction,
    reason?: string
  ): Promise<void> {
    const transition: WorkflowTransition = {
      id: randomUUID(),
      organizationId: actor.organizationId,
      workflowStateId: afterState.id,
      projectId: afterState.projectId,
      documentId: afterState.documentId,
      segmentId: afterState.segmentId,
      scope: afterState.scope,
      fromStatus: beforeState?.status,
      toStatus: afterState.status,
      action,
      reason,
      actorId: actor.userId,
      createdAt: new Date().toISOString(),
      metadata: {
        humanFinalAuthority: HUMAN_FINAL_AUTHORITY_RULE
      }
    };

    const savedTransition = await this.repository.appendTransition(transition);

    await this.repository.appendAuditEvent({
      id: randomUUID(),
      organizationId: actor.organizationId,
      workflowStateId: afterState.id,
      workflowTransitionId: savedTransition.id,
      action,
      actorId: actor.userId,
      beforeState,
      afterState,
      createdAt: new Date().toISOString()
    });
  }

  private assertAuthorizedHuman(actor: WorkflowActor): void {
    const roles = new Set((actor.roles ?? []).map((role) => role.toUpperCase()));

    if (![...HUMAN_APPROVAL_ROLES].some((role) => roles.has(role))) {
      throw new ForbiddenException(HUMAN_FINAL_AUTHORITY_RULE);
    }
  }

  private assertDocumentWorkflow(state: WorkflowState): void {
    if (state.scope !== "DOCUMENT") {
      throw new BadRequestException("This transition is only allowed for document-level workflows.");
    }
  }

  private validateActor(actor: WorkflowActor): void {
    if (!actor.userId || !actor.organizationId) {
      throw new BadRequestException("userId and organizationId are required.");
    }
  }

  private validateTarget(input: WorkflowTargetInput): void {
    if (!input.documentId) {
      throw new BadRequestException("documentId is required.");
    }
  }

  private validateScope(scope: WorkflowScope, segmentId: string | undefined): void {
    if (scope === "DOCUMENT" && segmentId) {
      throw new BadRequestException("Document workflow cannot include segmentId.");
    }

    if (scope === "SEGMENT" && !segmentId) {
      throw new BadRequestException("Segment workflow requires segmentId.");
    }
  }

  private scopeForTarget(input: WorkflowTargetInput): WorkflowScope {
    return input.segmentId ? "SEGMENT" : "DOCUMENT";
  }
}
