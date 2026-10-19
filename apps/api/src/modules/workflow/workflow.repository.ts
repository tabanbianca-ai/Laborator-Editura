import { Inject, Injectable } from "@nestjs/common";
import { getDefaultRuntimeDatabase, type FileBackedRuntimeDatabase } from "@laborator/db";
import { RUNTIME_DATABASE } from "../runtime-database.provider";
import {
  type ConfigurableWorkflowInstance,
  type ConfigurableWorkflowTransition,
  type WorkflowApprovalRecord,
  type WorkflowAuditEvent,
  type WorkflowConfigurationAuditEvent,
  type WorkflowDefinition,
  type WorkflowRepository,
  type WorkflowState,
  type WorkflowTargetInput,
  type WorkflowTransition,
  type WorkflowVersion
} from "./workflow.types";

@Injectable()
export class InMemoryWorkflowRepository implements WorkflowRepository {
  constructor(
    @Inject(RUNTIME_DATABASE)
    private readonly database: FileBackedRuntimeDatabase = getDefaultRuntimeDatabase()
  ) {}

  async createState(state: WorkflowState): Promise<WorkflowState> {
    return this.database.insert("workflow_states", state);
  }

  async updateState(state: WorkflowState): Promise<WorkflowState> {
    return this.database.upsert("workflow_states", state);
  }

  async findStateByTarget(
    input: WorkflowTargetInput & { organizationId: string }
  ): Promise<WorkflowState | null> {
    const states = this.database.selectForTenant<WorkflowState>(
      "workflow_states",
      input.organizationId,
      (state) =>
        state.projectId === input.projectId &&
        state.documentId === input.documentId &&
        state.segmentId === input.segmentId
    );

    return states[0] ?? null;
  }

  async appendTransition(transition: WorkflowTransition): Promise<WorkflowTransition> {
    return this.database.insert("workflow_transitions", transition);
  }

  async appendAuditEvent(event: WorkflowAuditEvent): Promise<void> {
    this.database.insert("workflow_audit_events", event);
  }

  getTransitions(): WorkflowTransition[] {
    return this.database.select("workflow_transitions") as WorkflowTransition[];
  }

  getAuditEvents(): WorkflowAuditEvent[] {
    return this.database.select("workflow_audit_events") as WorkflowAuditEvent[];
  }

  createDefinition(definition: WorkflowDefinition): WorkflowDefinition {
    return this.database.insert("workflow_definitions", definition);
  }

  updateDefinition(definition: WorkflowDefinition): WorkflowDefinition {
    return this.database.upsert("workflow_definitions", definition);
  }

  findDefinitionById(organizationId: string, id: string): WorkflowDefinition | null {
    return this.database.selectForTenant<WorkflowDefinition>(
      "workflow_definitions",
      organizationId,
      (definition) => definition.id === id
    )[0] ?? null;
  }

  findDefinitionByKey(organizationId: string, key: string): WorkflowDefinition | null {
    return this.database.selectForTenant<WorkflowDefinition>(
      "workflow_definitions",
      organizationId,
      (definition) => definition.key === key
    )[0] ?? null;
  }

  listDefinitions(organizationId: string): WorkflowDefinition[] {
    return this.database.selectForTenant<WorkflowDefinition>(
      "workflow_definitions",
      organizationId
    );
  }

  createVersion(version: WorkflowVersion): WorkflowVersion {
    return this.database.insert("workflow_versions", version);
  }

  updateVersion(version: WorkflowVersion): WorkflowVersion {
    return this.database.upsert("workflow_versions", version);
  }

  findVersionById(organizationId: string, id: string): WorkflowVersion | null {
    return this.database.selectForTenant<WorkflowVersion>(
      "workflow_versions",
      organizationId,
      (version) => version.id === id
    )[0] ?? null;
  }

  listVersions(organizationId: string, workflowDefinitionId: string): WorkflowVersion[] {
    return this.database.selectForTenant<WorkflowVersion>(
      "workflow_versions",
      organizationId,
      (version) => version.workflowDefinitionId === workflowDefinitionId
    );
  }

  createInstance(instance: ConfigurableWorkflowInstance): ConfigurableWorkflowInstance {
    return this.database.insert("workflow_instances", instance);
  }

  updateInstance(instance: ConfigurableWorkflowInstance): ConfigurableWorkflowInstance {
    return this.database.upsert("workflow_instances", instance);
  }

  findInstanceById(organizationId: string, id: string): ConfigurableWorkflowInstance | null {
    return this.database.selectForTenant<ConfigurableWorkflowInstance>(
      "workflow_instances",
      organizationId,
      (instance) => instance.id === id
    )[0] ?? null;
  }

  appendConfigurableTransition(
    transition: ConfigurableWorkflowTransition
  ): ConfigurableWorkflowTransition {
    return this.database.insert("workflow_instance_transitions", transition);
  }

  appendApproval(approval: WorkflowApprovalRecord): WorkflowApprovalRecord {
    return this.database.insert("workflow_approval_records", approval);
  }

  listApprovals(
    organizationId: string,
    workflowInstanceId: string,
    stageId: string
  ): WorkflowApprovalRecord[] {
    return this.database.selectForTenant<WorkflowApprovalRecord>(
      "workflow_approval_records",
      organizationId,
      (approval) =>
        approval.workflowInstanceId === workflowInstanceId && approval.stageId === stageId
    );
  }

  appendConfigurationAuditEvent(event: WorkflowConfigurationAuditEvent): void {
    this.database.insert("workflow_configuration_audit_events", event);
  }
}
