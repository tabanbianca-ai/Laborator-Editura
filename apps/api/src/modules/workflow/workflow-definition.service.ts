import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { DocumentsService } from "../documents/documents.service";
import { ProjectsService } from "../projects/projects.service";
import { InMemoryWorkflowRepository } from "./workflow.repository";
import { WorkflowRuleEvaluator } from "./workflow-rule-evaluator";
import {
  type ConfigurableWorkflowInstance,
  type CreateWorkflowDefinitionInput,
  type CreateWorkflowVersionInput,
  type RecordWorkflowApprovalInput,
  type StartConfigurableWorkflowInput,
  type TransitionConfigurableWorkflowInput,
  type WorkflowActor,
  type WorkflowApprovalRecord,
  type WorkflowDefinition,
  type WorkflowRuleEffect,
  type WorkflowStageDefinition,
  type WorkflowTransitionDefinition,
  type WorkflowVersion
} from "./workflow.types";

const CONFIGURATION_ROLES = new Set(["PLATFORM_CREATOR", "ADMIN"]);
const MACHINE_ROLE_PATTERN = /(^|_)(AI|AGENT|SYSTEM|AUTOMATION)($|_)/u;
const HUMAN_FINAL_AUTHORITY =
  "Workflow rules may coordinate and block, but only authenticated authorized humans may grant approvals.";

@Injectable()
export class WorkflowDefinitionService {
  constructor(
    private readonly repository: InMemoryWorkflowRepository,
    private readonly ruleEvaluator: WorkflowRuleEvaluator,
    private readonly projectsService: ProjectsService,
    private readonly documentsService: DocumentsService
  ) {}

  createDefinition(
    actor: WorkflowActor,
    input: CreateWorkflowDefinitionInput
  ): WorkflowDefinition {
    this.assertCanConfigure(actor);
    const key = input.key?.trim().toLowerCase();
    const name = input.name?.trim();
    const category = input.category?.trim();
    if (!key || !/^[a-z][a-z0-9._-]{2,79}$/u.test(key)) {
      throw new BadRequestException("Workflow definition key must be a stable lowercase identifier.");
    }
    if (!name || !category) {
      throw new BadRequestException("Workflow definition name and category are required.");
    }
    if (this.repository.findDefinitionByKey(actor.organizationId, key)) {
      throw new ConflictException("Workflow definition key already exists in this organization.");
    }

    const now = new Date().toISOString();
    const definition = this.repository.createDefinition({
      id: randomUUID(),
      organizationId: actor.organizationId,
      key,
      name,
      description: input.description?.trim() || undefined,
      category,
      status: "DRAFT",
      createdBy: actor.userId,
      createdAt: now,
      updatedBy: actor.userId,
      updatedAt: now
    });
    this.audit(actor, "WORKFLOW_DEFINITION_CREATED", "DEFINITION", definition.id, {
      definitionKey: definition.key
    });
    return definition;
  }

  listDefinitions(actor: WorkflowActor): WorkflowDefinition[] {
    this.validateActor(actor);
    return this.repository.listDefinitions(actor.organizationId);
  }

  listVersions(actor: WorkflowActor, definitionId: string): WorkflowVersion[] {
    this.validateActor(actor);
    this.getDefinition(actor, definitionId);
    return this.repository
      .listVersions(actor.organizationId, definitionId)
      .sort((left, right) => left.version - right.version);
  }

  createVersion(
    actor: WorkflowActor,
    definitionId: string,
    input: CreateWorkflowVersionInput
  ): WorkflowVersion {
    this.assertCanConfigure(actor);
    const definition = this.getDefinition(actor, definitionId);
    if (definition.status === "ARCHIVED") {
      throw new BadRequestException("Archived workflow definitions cannot receive new versions.");
    }
    this.validateVersionInput(input);
    const versions = this.repository.listVersions(actor.organizationId, definitionId);
    const version = this.repository.createVersion({
      id: randomUUID(),
      organizationId: actor.organizationId,
      workflowDefinitionId: definitionId,
      version: Math.max(0, ...versions.map((item) => item.version)) + 1,
      status: "DRAFT",
      stages: structuredClone(input.stages),
      transitions: structuredClone(input.transitions),
      createdBy: actor.userId,
      createdAt: new Date().toISOString()
    });
    this.audit(actor, "WORKFLOW_VERSION_CREATED", "VERSION", version.id, {
      version: version.version,
      workflowDefinitionId: definitionId
    });
    return version;
  }

  activateVersion(
    actor: WorkflowActor,
    definitionId: string,
    versionId: string
  ): WorkflowVersion {
    this.assertCanConfigure(actor);
    const definition = this.getDefinition(actor, definitionId);
    const version = this.getVersion(actor, versionId);
    if (version.workflowDefinitionId !== definition.id) {
      throw new BadRequestException("Workflow version does not belong to the requested definition.");
    }
    if (version.status !== "DRAFT") {
      throw new BadRequestException("Only draft workflow versions can be activated.");
    }
    this.validateVersionInput(version);

    const now = new Date().toISOString();
    const activeVersion = this.repository.updateVersion({
      ...version,
      status: "ACTIVE",
      approvedBy: actor.userId,
      approvedAt: now
    });
    this.repository.updateDefinition({
      ...definition,
      status: "ACTIVE",
      currentVersionId: activeVersion.id,
      updatedBy: actor.userId,
      updatedAt: now
    });
    this.audit(actor, "WORKFLOW_VERSION_ACTIVATED", "VERSION", activeVersion.id, {
      humanFinalAuthority: HUMAN_FINAL_AUTHORITY,
      version: activeVersion.version,
      workflowDefinitionId: definitionId
    });
    return activeVersion;
  }

  async startInstance(
    actor: WorkflowActor,
    input: StartConfigurableWorkflowInput
  ): Promise<ConfigurableWorkflowInstance> {
    this.validateActor(actor);
    if (!input.scopeId || !input.scopeType) {
      throw new BadRequestException("Workflow scope type and scope ID are required.");
    }
    await this.assertScopeAccess(actor, input);
    const definition = this.getDefinition(actor, input.workflowDefinitionId);
    if (definition.status !== "ACTIVE") {
      throw new BadRequestException("Workflow definition must be active before an instance starts.");
    }
    const versionId = input.workflowVersionId ?? definition.currentVersionId;
    if (!versionId) {
      throw new BadRequestException("Workflow definition has no active version.");
    }
    const version = this.getVersion(actor, versionId);
    if (version.workflowDefinitionId !== definition.id || version.status !== "ACTIVE") {
      throw new BadRequestException("Workflow instance must use an active version of its definition.");
    }
    const initialStage = version.stages.find((stage) => stage.initial);
    if (!initialStage) {
      throw new BadRequestException("Active workflow version has no initial stage.");
    }
    this.assertActorRole(actor, initialStage.responsibleRoles, "start this workflow");

    const now = new Date().toISOString();
    const instance = this.repository.createInstance({
      id: randomUUID(),
      organizationId: actor.organizationId,
      workflowDefinitionId: definition.id,
      workflowVersionId: version.id,
      projectId: input.projectId,
      documentId: input.documentId,
      scopeType: input.scopeType,
      scopeId: input.scopeId,
      currentStageId: initialStage.id,
      status: initialStage.final ? "COMPLETED" : "RUNNING",
      startedBy: actor.userId,
      startedAt: now,
      updatedBy: actor.userId,
      updatedAt: now,
      completedAt: initialStage.final ? now : undefined,
      metadata: {
        humanFinalAuthority: HUMAN_FINAL_AUTHORITY,
        ...(input.metadata ?? {})
      }
    });
    this.audit(actor, "CONFIGURABLE_WORKFLOW_STARTED", "INSTANCE", instance.id, {
      workflowDefinitionId: definition.id,
      workflowVersionId: version.id
    });
    return instance;
  }

  getInstance(actor: WorkflowActor, instanceId: string): ConfigurableWorkflowInstance {
    this.validateActor(actor);
    const instance = this.repository.findInstanceById(actor.organizationId, instanceId);
    if (!instance) {
      throw new NotFoundException("Workflow instance not found.");
    }
    return instance;
  }

  transitionInstance(
    actor: WorkflowActor,
    instanceId: string,
    input: TransitionConfigurableWorkflowInput
  ): ConfigurableWorkflowInstance {
    this.validateActor(actor);
    const instance = this.getInstance(actor, instanceId);
    if (instance.status !== "RUNNING") {
      throw new BadRequestException("Only running workflow instances can transition.");
    }
    const version = this.getVersion(actor, instance.workflowVersionId);
    const transition = version.transitions.find((candidate) => candidate.id === input.transitionId);
    if (!transition || transition.fromStageId !== instance.currentStageId) {
      throw new BadRequestException("Transition is not valid for the current workflow stage.");
    }
    this.assertActorRole(actor, transition.allowedRoles, "execute this workflow transition");
    const currentStage = this.requireStage(version, instance.currentStageId);
    const targetStage = this.requireStage(version, transition.toStageId);
    this.assertApprovals(actor, instance, currentStage, transition, input.context ?? {});

    const evaluatedRules: Array<{ ruleId: string; outcome: WorkflowRuleEffect["outcome"] }> = [];
    for (const rule of transition.rules) {
      const matched = this.ruleEvaluator.evaluate(rule.if, this.ruleFacts(actor, instance, input.context));
      const effect = matched ? rule.then : rule.else ?? { outcome: "ALLOW" as const };
      evaluatedRules.push({ ruleId: rule.id, outcome: effect.outcome });
      if (effect.outcome === "BLOCK") {
        throw new BadRequestException(effect.reason ?? `Workflow rule ${rule.id} blocked the transition.`);
      }
    }

    const now = new Date().toISOString();
    const updated = this.repository.updateInstance({
      ...instance,
      currentStageId: targetStage.id,
      status: targetStage.final ? "COMPLETED" : "RUNNING",
      updatedBy: actor.userId,
      updatedAt: now,
      completedAt: targetStage.final ? now : undefined
    });
    this.repository.appendConfigurableTransition({
      id: randomUUID(),
      organizationId: actor.organizationId,
      workflowInstanceId: instance.id,
      workflowVersionId: version.id,
      transitionDefinitionId: transition.id,
      action: transition.action,
      fromStageId: transition.fromStageId,
      toStageId: transition.toStageId,
      actorId: actor.userId,
      createdAt: now,
      evaluatedRules
    });
    this.audit(actor, "CONFIGURABLE_TRANSITION_EXECUTED", "INSTANCE", instance.id, {
      fromStageId: transition.fromStageId,
      toStageId: transition.toStageId,
      transitionId: transition.id,
      workflowVersionId: version.id
    });
    return updated;
  }

  recordApproval(
    actor: WorkflowActor,
    instanceId: string,
    input: RecordWorkflowApprovalInput
  ): WorkflowApprovalRecord {
    this.validateActor(actor);
    this.assertHumanActor(actor, "record workflow approvals");
    const instance = this.getInstance(actor, instanceId);
    if (instance.status !== "RUNNING") {
      throw new BadRequestException("Approvals can be recorded only for running workflow instances.");
    }
    const version = this.getVersion(actor, instance.workflowVersionId);
    const stage = this.requireStage(version, instance.currentStageId);
    const allowedRoles = new Set(stage.approval?.roles ?? []);
    for (const transition of version.transitions.filter((item) => item.fromStageId === stage.id)) {
      for (const rule of transition.rules) {
        if (rule.then.outcome === "REQUIRE_APPROVAL") {
          (rule.then.requiredRoles ?? []).forEach((role) => allowedRoles.add(role));
        }
        if (rule.else?.outcome === "REQUIRE_APPROVAL") {
          (rule.else.requiredRoles ?? []).forEach((role) => allowedRoles.add(role));
        }
      }
    }
    this.assertActorRole(actor, [...allowedRoles], "record this workflow approval");
    const prior = this.repository.listApprovals(actor.organizationId, instance.id, stage.id);
    if (prior.some((approval) => approval.actorId === actor.userId)) {
      throw new ConflictException("This user has already recorded a decision for the current stage.");
    }

    const approval = this.repository.appendApproval({
      id: randomUUID(),
      organizationId: actor.organizationId,
      workflowInstanceId: instance.id,
      workflowVersionId: version.id,
      stageId: stage.id,
      status: input.decision,
      actorId: actor.userId,
      actorRoles: [...(actor.roles ?? [])],
      reason: input.reason?.trim() || undefined,
      createdAt: new Date().toISOString()
    });
    if (input.decision === "REJECTED") {
      this.repository.updateInstance({
        ...instance,
        status: "BLOCKED",
        blockedReason: input.reason?.trim() || "Workflow approval was rejected.",
        updatedBy: actor.userId,
        updatedAt: new Date().toISOString()
      });
    }
    this.audit(
      actor,
      input.decision === "GRANTED" ? "WORKFLOW_APPROVAL_GRANTED" : "WORKFLOW_APPROVAL_REJECTED",
      "APPROVAL",
      approval.id,
      { stageId: stage.id, workflowInstanceId: instance.id }
    );
    return approval;
  }

  private assertApprovals(
    actor: WorkflowActor,
    instance: ConfigurableWorkflowInstance,
    stage: WorkflowStageDefinition,
    transition: WorkflowTransitionDefinition,
    context: Record<string, unknown>
  ): void {
    const approvals = this.repository
      .listApprovals(actor.organizationId, instance.id, stage.id)
      .filter((approval) => approval.status === "GRANTED");
    if (stage.approval?.required) {
      const eligible = approvals.filter((approval) =>
        approval.actorRoles.some((role) =>
          stage.approval?.roles.some((requiredRole) => requiredRole.toUpperCase() === role.toUpperCase())
        )
      );
      if (eligible.length < stage.approval.minimumApprovals) {
        throw new ForbiddenException("Required human workflow approvals have not been granted.");
      }
    }
    for (const rule of transition.rules) {
      const matched = this.ruleEvaluator.evaluate(rule.if, this.ruleFacts(actor, instance, context));
      const effect = matched ? rule.then : rule.else;
      if (effect?.outcome !== "REQUIRE_APPROVAL") {
        continue;
      }
      const roles = effect.requiredRoles ?? [];
      const granted = approvals.some((approval) =>
        approval.actorRoles.some((role) =>
          roles.some((requiredRole) => requiredRole.toUpperCase() === role.toUpperCase())
        )
      );
      if (!granted) {
        throw new ForbiddenException(effect.reason ?? "Workflow rule requires human approval.");
      }
    }
  }

  private validateVersionInput(input: CreateWorkflowVersionInput): void {
    if (!Array.isArray(input.stages) || input.stages.length === 0) {
      throw new BadRequestException("Workflow version requires at least one stage.");
    }
    if (!Array.isArray(input.transitions)) {
      throw new BadRequestException("Workflow version transitions must be an array.");
    }
    const stageIds = new Set<string>();
    const stageOrders = new Set<number>();
    for (const stage of input.stages) {
      if (!stage.id?.trim() || !stage.name?.trim() || !Number.isInteger(stage.order)) {
        throw new BadRequestException("Workflow stages require stable IDs, names and integer order values.");
      }
      if (stageIds.has(stage.id) || stageOrders.has(stage.order)) {
        throw new BadRequestException("Workflow stage IDs and order values must be unique.");
      }
      stageIds.add(stage.id);
      stageOrders.add(stage.order);
      this.validateHumanRoles(stage.responsibleRoles, "stage responsible roles");
      if (stage.approval?.required) {
        this.validateHumanRoles(stage.approval.roles, "stage approval roles");
        if (!Number.isInteger(stage.approval.minimumApprovals) || stage.approval.minimumApprovals < 1) {
          throw new BadRequestException("Required approvals need a positive minimum approval count.");
        }
      }
    }
    if (input.stages.filter((stage) => stage.initial).length !== 1) {
      throw new BadRequestException("Workflow version requires exactly one initial stage.");
    }
    if (input.stages.some((stage) => stage.initial && stage.final)) {
      throw new BadRequestException("The initial workflow stage cannot also be final.");
    }
    if (!input.stages.some((stage) => stage.final)) {
      throw new BadRequestException("Workflow version requires at least one final stage.");
    }

    const transitionIds = new Set<string>();
    for (const transition of input.transitions) {
      if (!transition.id?.trim() || !transition.action?.trim() || transitionIds.has(transition.id)) {
        throw new BadRequestException("Workflow transitions require unique IDs and actions.");
      }
      transitionIds.add(transition.id);
      if (
        !stageIds.has(transition.fromStageId) ||
        !stageIds.has(transition.toStageId) ||
        transition.fromStageId === transition.toStageId
      ) {
        throw new BadRequestException("Workflow transitions must connect two distinct declared stages.");
      }
      const sourceStage = input.stages.find((stage) => stage.id === transition.fromStageId)!;
      if (sourceStage.final) {
        throw new BadRequestException("Final workflow stages cannot have outgoing transitions.");
      }
      this.validateHumanRoles(transition.allowedRoles, "transition roles");
      if (!Array.isArray(transition.rules)) {
        throw new BadRequestException("Workflow transition rules must be an array.");
      }
      const ruleIds = new Set<string>();
      for (const rule of transition.rules) {
        if (!rule.id?.trim() || !rule.name?.trim() || ruleIds.has(rule.id)) {
          throw new BadRequestException("Workflow rules require unique IDs and names per transition.");
        }
        ruleIds.add(rule.id);
        this.ruleEvaluator.validate(rule.if);
        this.validateRuleEffect(rule.then);
        if (rule.else) {
          this.validateRuleEffect(rule.else);
        }
      }
    }
    for (const finalStage of input.stages.filter((stage) => stage.final)) {
      const incoming = input.transitions.filter((transition) => transition.toStageId === finalStage.id);
      if (incoming.some((transition) => !input.stages.find((stage) => stage.id === transition.fromStageId)?.approval?.required)) {
        throw new BadRequestException(
          "Transitions into a final stage require an explicit human approval gate on the source stage."
        );
      }
    }
  }

  private validateRuleEffect(effect: WorkflowRuleEffect): void {
    if (effect.outcome === "REQUIRE_APPROVAL") {
      this.validateHumanRoles(effect.requiredRoles ?? [], "rule approval roles");
    }
  }

  private validateHumanRoles(roles: string[], label: string): void {
    if (!Array.isArray(roles) || roles.length === 0) {
      throw new BadRequestException(`Workflow ${label} must contain at least one role.`);
    }
    if (roles.some((role) => !role?.trim() || MACHINE_ROLE_PATTERN.test(role.toUpperCase()))) {
      throw new BadRequestException(`Workflow ${label} may contain only human roles.`);
    }
  }

  private assertCanConfigure(actor: WorkflowActor): void {
    this.validateActor(actor);
    this.assertHumanActor(actor, "configure workflows");
    const roles = new Set((actor.roles ?? []).map((role) => role.toUpperCase()));
    const permissions = new Set([...(actor.permissions ?? []), ...(actor.canonicalPermissions ?? [])]);
    if (
      ![...CONFIGURATION_ROLES].some((role) => roles.has(role)) &&
      !permissions.has("admin:manage") &&
      !permissions.has("platform.admin.manage")
    ) {
      throw new ForbiddenException("Workflow configuration requires administrative authority.");
    }
  }

  private assertActorRole(actor: WorkflowActor, allowedRoles: string[], action: string): void {
    const roles = new Set((actor.roles ?? []).map((role) => role.toUpperCase()));
    if (
      roles.has("PLATFORM_CREATOR") ||
      roles.has("ADMIN") ||
      allowedRoles.some((role) => roles.has(role.toUpperCase()))
    ) {
      return;
    }
    throw new ForbiddenException(`The authenticated role is not allowed to ${action}.`);
  }

  private assertHumanActor(actor: WorkflowActor, action: string): void {
    if ((actor.roles ?? []).some((role) => MACHINE_ROLE_PATTERN.test(role.toUpperCase()))) {
      throw new ForbiddenException(`AI, system and automation identities cannot ${action}.`);
    }
  }

  private validateActor(actor: WorkflowActor): void {
    if (!actor.userId || !actor.organizationId) {
      throw new BadRequestException("Authenticated workflow context is required.");
    }
  }

  private getDefinition(actor: WorkflowActor, id: string): WorkflowDefinition {
    const definition = this.repository.findDefinitionById(actor.organizationId, id);
    if (!definition) {
      throw new NotFoundException("Workflow definition not found.");
    }
    return definition;
  }

  private getVersion(actor: WorkflowActor, id: string): WorkflowVersion {
    const version = this.repository.findVersionById(actor.organizationId, id);
    if (!version) {
      throw new NotFoundException("Workflow version not found.");
    }
    return version;
  }

  private requireStage(version: WorkflowVersion, stageId: string): WorkflowStageDefinition {
    const stage = version.stages.find((candidate) => candidate.id === stageId);
    if (!stage) {
      throw new BadRequestException("Workflow instance references an unknown version stage.");
    }
    return stage;
  }

  private async assertScopeAccess(
    actor: WorkflowActor,
    input: StartConfigurableWorkflowInput
  ): Promise<void> {
    if (input.scopeType === "PROJECT") {
      if (!input.projectId || input.scopeId !== input.projectId || input.documentId) {
        throw new BadRequestException("Project workflows require a matching project scope only.");
      }
      await this.projectsService.getProject(actor, input.projectId);
      return;
    }

    if (!input.documentId) {
      throw new BadRequestException("Document and segment workflows require a document ID.");
    }
    const document = await this.documentsService.getDocument(actor, input.documentId);
    if (input.projectId && document.projectId !== input.projectId) {
      throw new BadRequestException("Workflow project and document references do not match.");
    }
    if (input.scopeType === "DOCUMENT" && input.scopeId !== input.documentId) {
      throw new BadRequestException("Document workflows require a matching document scope.");
    }
  }

  private ruleFacts(
    actor: WorkflowActor,
    instance: ConfigurableWorkflowInstance,
    context: Record<string, unknown> = {}
  ): Record<string, unknown> {
    return {
      actor: { roles: (actor.roles ?? []).map((role) => role.toUpperCase()), userId: actor.userId },
      context,
      instance: {
        currentStageId: instance.currentStageId,
        metadata: instance.metadata ?? {},
        scopeType: instance.scopeType,
        status: instance.status
      }
    };
  }

  private audit(
    actor: WorkflowActor,
    action: Parameters<InMemoryWorkflowRepository["appendConfigurationAuditEvent"]>[0]["action"],
    entityType: Parameters<InMemoryWorkflowRepository["appendConfigurationAuditEvent"]>[0]["entityType"],
    entityId: string,
    metadata?: Record<string, unknown>
  ): void {
    this.repository.appendConfigurationAuditEvent({
      id: randomUUID(),
      organizationId: actor.organizationId,
      action,
      actorId: actor.userId,
      entityId,
      entityType,
      createdAt: new Date().toISOString(),
      metadata
    });
  }
}
