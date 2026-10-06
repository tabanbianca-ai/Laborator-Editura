import { Inject, Injectable } from "@nestjs/common";
import { getDefaultRuntimeDatabase, type FileBackedRuntimeDatabase } from "@laborator/db";
import { RUNTIME_DATABASE } from "../runtime-database.provider";
import {
  type WorkflowAuditEvent,
  type WorkflowRepository,
  type WorkflowState,
  type WorkflowTargetInput,
  type WorkflowTransition
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
}
