import { Inject, Injectable } from "@nestjs/common";
import { getDefaultRuntimeDatabase, type FileBackedRuntimeDatabase } from "@laborator/db";
import { RUNTIME_DATABASE } from "../runtime-database.provider";
import {
  type ScheduledAgentRun,
  type SchedulingAuditEvent,
  type SchedulingEvent,
  type SchedulingReminder,
  type SchedulingRepository,
  type SchedulingTask
} from "./scheduling.types";

@Injectable()
export class DatabaseSchedulingRepository implements SchedulingRepository {
  constructor(
    @Inject(RUNTIME_DATABASE)
    private readonly database: FileBackedRuntimeDatabase = getDefaultRuntimeDatabase()
  ) {}

  async createTask(task: SchedulingTask): Promise<SchedulingTask> {
    return this.database.insert("scheduling_tasks", task);
  }

  async updateTask(task: SchedulingTask): Promise<SchedulingTask> {
    return this.database.upsert("scheduling_tasks", task);
  }

  async findTaskById(id: string, organizationId: string): Promise<SchedulingTask | null> {
    return this.database.findByIdForTenant<SchedulingTask>("scheduling_tasks", id, organizationId);
  }

  async listTasks(organizationId: string): Promise<SchedulingTask[]> {
    return this.database.selectForTenant<SchedulingTask>("scheduling_tasks", organizationId);
  }

  async createEvent(event: SchedulingEvent): Promise<SchedulingEvent> {
    return this.database.insert("scheduling_events", event);
  }

  async updateEvent(event: SchedulingEvent): Promise<SchedulingEvent> {
    return this.database.upsert("scheduling_events", event);
  }

  async findEventById(id: string, organizationId: string): Promise<SchedulingEvent | null> {
    return this.database.findByIdForTenant<SchedulingEvent>("scheduling_events", id, organizationId);
  }

  async listEvents(organizationId: string): Promise<SchedulingEvent[]> {
    return this.database.selectForTenant<SchedulingEvent>("scheduling_events", organizationId);
  }

  async createReminder(reminder: SchedulingReminder): Promise<SchedulingReminder> {
    return this.database.insert("scheduling_reminders", reminder);
  }

  async listReminders(organizationId: string): Promise<SchedulingReminder[]> {
    return this.database.selectForTenant<SchedulingReminder>("scheduling_reminders", organizationId);
  }

  async createAgentRun(agentRun: ScheduledAgentRun): Promise<ScheduledAgentRun> {
    return this.database.insert("scheduling_agent_runs", agentRun);
  }

  async listAgentRuns(organizationId: string): Promise<ScheduledAgentRun[]> {
    return this.database.selectForTenant<ScheduledAgentRun>("scheduling_agent_runs", organizationId);
  }

  async appendAuditEvent(event: SchedulingAuditEvent): Promise<void> {
    this.database.insert("scheduling_audit_events", event);
  }
}
