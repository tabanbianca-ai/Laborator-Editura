import { Injectable } from "@nestjs/common";
import {
  type WorkflowAuditEvent,
  type WorkflowRepository,
  type WorkflowState,
  type WorkflowTargetInput,
  type WorkflowTransition
} from "./workflow.types";

@Injectable()
export class InMemoryWorkflowRepository implements WorkflowRepository {
  private readonly states = new Map<string, WorkflowState>();
  private readonly transitions: WorkflowTransition[] = [];
  private readonly auditEvents: WorkflowAuditEvent[] = [];

  async createState(state: WorkflowState): Promise<WorkflowState> {
    this.states.set(this.keyForState(state), state);
    return state;
  }

  async updateState(state: WorkflowState): Promise<WorkflowState> {
    this.states.set(this.keyForState(state), state);
    return state;
  }

  async findStateByTarget(
    input: WorkflowTargetInput & { organizationId: string }
  ): Promise<WorkflowState | null> {
    return this.states.get(this.keyForTarget(input)) ?? null;
  }

  async appendTransition(transition: WorkflowTransition): Promise<WorkflowTransition> {
    this.transitions.push(transition);
    return transition;
  }

  async appendAuditEvent(event: WorkflowAuditEvent): Promise<void> {
    this.auditEvents.push(event);
  }

  getTransitions(): WorkflowTransition[] {
    return [...this.transitions];
  }

  getAuditEvents(): WorkflowAuditEvent[] {
    return [...this.auditEvents];
  }

  private keyForState(state: WorkflowState): string {
    return this.keyForTarget(state);
  }

  private keyForTarget(input: WorkflowTargetInput & { organizationId: string }): string {
    return [
      input.organizationId,
      input.documentId,
      input.segmentId ?? "DOCUMENT"
    ].join(":");
  }
}
