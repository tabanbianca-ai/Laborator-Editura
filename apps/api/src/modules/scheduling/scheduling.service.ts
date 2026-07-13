import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { DatabaseSchedulingRepository } from "./scheduling.repository";
import {
  type CreateScheduledAgentRunInput,
  type CreateSchedulingEventInput,
  type CreateSchedulingReminderInput,
  type CreateSchedulingTaskInput,
  type ScheduledAgentRun,
  type SchedulingActor,
  type SchedulingAgenda,
  type SchedulingAuditAction,
  type SchedulingAuditTrailItem,
  type SchedulingEvent,
  type SchedulingReminder,
  type SchedulingTask
} from "./scheduling.types";

@Injectable()
export class SchedulingService {
  constructor(private readonly repository: DatabaseSchedulingRepository) {}

  async getAgenda(actor: SchedulingActor): Promise<SchedulingAgenda> {
    this.validateActor(actor);

    const [tasks, events, reminders, agentRuns] = await Promise.all([
      this.repository.listTasks(actor.organizationId),
      this.repository.listEvents(actor.organizationId),
      this.repository.listReminders(actor.organizationId),
      this.repository.listAgentRuns(actor.organizationId)
    ]);

    const agenda: SchedulingAgenda = {
      personalAgenda: tasks,
      teamAgenda: events,
      meetings: events.filter((event) => event.eventType === "MEETING"),
      conferences: events.filter((event) => event.eventType === "CONFERENCE"),
      publicationCalendar: [
        ...tasks.filter((task) => task.taskType === "PUBLICATION_DEADLINE"),
        ...events.filter((event) => event.eventType === "PUBLICATION_CALENDAR")
      ],
      aiTaskCalendar: agentRuns,
      reminders,
      conflictDetectionStatus: "PLACEHOLDER_ONLY",
      externalCalendarIntegration: "NOT_CONFIGURED",
      generatedAt: new Date().toISOString()
    };

    await this.audit("AGENDA_VIEWED", actor, undefined, agenda);

    return agenda;
  }

  async createTask(
    actor: SchedulingActor,
    input: CreateSchedulingTaskInput
  ): Promise<SchedulingTask> {
    this.validateActor(actor);
    this.validateTitle(input.title);

    if (!input.taskType || !input.dueAt) {
      throw new BadRequestException("taskType and dueAt are required.");
    }

    const now = new Date().toISOString();
    const task: SchedulingTask = {
      id: randomUUID(),
      organizationId: actor.organizationId,
      projectId: input.projectId,
      documentId: input.documentId,
      title: input.title,
      taskType: input.taskType,
      dueAt: input.dueAt,
      priority: input.priority ?? "MEDIUM",
      dependencies: input.dependencies ?? [],
      conflictDetectionStatus: "PLACEHOLDER_ONLY",
      conflicts: this.detectConflictsPlaceholder(),
      approvalStatus: "PENDING_HUMAN_APPROVAL",
      humanApprovalRequired: true,
      externalCalendarIntegration: "NOT_CONFIGURED",
      auditTrail: [
        this.auditTrailItem("SCHEDULING_TASK_CREATED", actor, now, 1, {
          aiMaySchedule: true,
          aiMaySuggest: true,
          humanFinalAuthority: true
        })
      ],
      version: 1,
      createdBy: actor.userId,
      createdAt: now,
      updatedAt: now,
      metadata: input.metadata
    };

    const created = await this.repository.createTask(task);
    await this.audit("SCHEDULING_TASK_CREATED", actor, undefined, created, created.id);

    return created;
  }

  async createEvent(
    actor: SchedulingActor,
    input: CreateSchedulingEventInput
  ): Promise<SchedulingEvent> {
    this.validateActor(actor);
    this.validateTitle(input.title);

    if (!input.eventType || !input.startsAt) {
      throw new BadRequestException("eventType and startsAt are required.");
    }

    const now = new Date().toISOString();
    const event: SchedulingEvent = {
      id: randomUUID(),
      organizationId: actor.organizationId,
      projectId: input.projectId,
      documentId: input.documentId,
      title: input.title,
      eventType: input.eventType,
      startsAt: input.startsAt,
      endsAt: input.endsAt,
      recurrenceRule: input.recurrenceRule,
      participants: input.participants ?? [],
      location: input.location,
      conflictDetectionStatus: "PLACEHOLDER_ONLY",
      conflicts: this.detectConflictsPlaceholder(),
      approvalStatus: "PENDING_HUMAN_APPROVAL",
      humanApprovalRequired: true,
      externalCalendarIntegration: "NOT_CONFIGURED",
      auditTrail: [
        this.auditTrailItem("SCHEDULING_EVENT_CREATED", actor, now, 1, {
          aiMayCoordinate: true,
          humanFinalAuthority: true,
          externalCalendarIntegration: "NOT_CONFIGURED"
        })
      ],
      version: 1,
      createdBy: actor.userId,
      createdAt: now,
      updatedAt: now,
      metadata: input.metadata
    };

    const created = await this.repository.createEvent(event);
    await this.audit("SCHEDULING_EVENT_CREATED", actor, undefined, created, undefined, created.id);

    return created;
  }

  async createReminder(
    actor: SchedulingActor,
    input: CreateSchedulingReminderInput
  ): Promise<SchedulingReminder> {
    this.validateActor(actor);

    if (!input.reminderType || !input.message || !input.remindAt) {
      throw new BadRequestException("reminderType, message and remindAt are required.");
    }

    const now = new Date().toISOString();
    const reminder: SchedulingReminder = {
      id: randomUUID(),
      organizationId: actor.organizationId,
      schedulingTaskId: input.schedulingTaskId,
      schedulingEventId: input.schedulingEventId,
      schedulingAgentRunId: input.schedulingAgentRunId,
      reminderType: input.reminderType,
      message: input.message,
      remindAt: input.remindAt,
      overdueAlert: input.overdueAlert ?? input.reminderType === "OVERDUE_ALERT",
      delivered: false,
      externalCalendarIntegration: "NOT_CONFIGURED",
      auditTrail: [
        this.auditTrailItem("SCHEDULING_REMINDER_CREATED", actor, now, 1, {
          aiMayRemind: true,
          externalCalendarIntegration: "NOT_CONFIGURED"
        })
      ],
      createdBy: actor.userId,
      createdAt: now,
      updatedAt: now,
      metadata: input.metadata
    };

    const created = await this.repository.createReminder(reminder);
    await this.audit(
      "SCHEDULING_REMINDER_CREATED",
      actor,
      undefined,
      created,
      undefined,
      undefined,
      created.id
    );

    return created;
  }

  async createAgentRun(
    actor: SchedulingActor,
    input: CreateScheduledAgentRunInput
  ): Promise<ScheduledAgentRun> {
    this.validateActor(actor);
    this.validateTitle(input.title);

    if (!input.agentName || !input.scheduledFor) {
      throw new BadRequestException("agentName and scheduledFor are required.");
    }

    const now = new Date().toISOString();
    const agentRun: ScheduledAgentRun = {
      id: randomUUID(),
      organizationId: actor.organizationId,
      title: input.title,
      agentName: input.agentName,
      scheduledFor: input.scheduledFor,
      dependenciesBetweenAgents: input.dependenciesBetweenAgents ?? [],
      executionOrder: input.executionOrder ?? [],
      workloadBalancingNotes: input.workloadBalancingNotes ?? [],
      taskPriority: input.taskPriority ?? "MEDIUM",
      conflictDetectionStatus: "PLACEHOLDER_ONLY",
      conflicts: this.detectConflictsPlaceholder(),
      approvalStatus: "PENDING_HUMAN_APPROVAL",
      humanApprovalRequired: true,
      executionMode: "PLANNING_ONLY",
      externalCalendarIntegration: "NOT_CONFIGURED",
      auditTrail: [
        this.auditTrailItem("SCHEDULING_AGENT_RUN_CREATED", actor, now, 1, {
          aiMayCoordinate: true,
          workloadBalancing: true,
          humanFinalAuthority: true
        })
      ],
      version: 1,
      createdBy: actor.userId,
      createdAt: now,
      updatedAt: now,
      metadata: input.metadata
    };

    const created = await this.repository.createAgentRun(agentRun);
    await this.audit(
      "SCHEDULING_AGENT_RUN_CREATED",
      actor,
      undefined,
      created,
      undefined,
      undefined,
      undefined,
      created.id
    );

    return created;
  }

  async approveTask(actor: SchedulingActor, taskId: string): Promise<SchedulingTask> {
    this.validateActor(actor);
    this.assertAuthorizedHuman(actor);

    const existing = await this.getTask(actor, taskId);
    const now = new Date().toISOString();
    const approved: SchedulingTask = {
      ...existing,
      approvalStatus: "APPROVED",
      confirmedBy: actor.userId,
      confirmedAt: now,
      version: existing.version + 1,
      auditTrail: [
        ...existing.auditTrail,
        this.auditTrailItem("SCHEDULING_TASK_APPROVED", actor, now, existing.version + 1, {
          finalAuthority: "AUTHORIZED_HUMAN"
        })
      ],
      updatedAt: now
    };

    const saved = await this.repository.updateTask(approved);
    await this.audit("SCHEDULING_TASK_APPROVED", actor, existing, saved, saved.id);

    return saved;
  }

  async rejectTask(actor: SchedulingActor, taskId: string): Promise<SchedulingTask> {
    this.validateActor(actor);
    this.assertAuthorizedHuman(actor);

    const existing = await this.getTask(actor, taskId);
    const now = new Date().toISOString();
    const rejected: SchedulingTask = {
      ...existing,
      approvalStatus: "REJECTED",
      version: existing.version + 1,
      auditTrail: [
        ...existing.auditTrail,
        this.auditTrailItem("SCHEDULING_TASK_REJECTED", actor, now, existing.version + 1, {
          finalAuthority: "AUTHORIZED_HUMAN"
        })
      ],
      updatedAt: now
    };

    const saved = await this.repository.updateTask(rejected);
    await this.audit("SCHEDULING_TASK_REJECTED", actor, existing, saved, saved.id);

    return saved;
  }

  async approveEvent(actor: SchedulingActor, eventId: string): Promise<SchedulingEvent> {
    this.validateActor(actor);
    this.assertAuthorizedHuman(actor);

    const existing = await this.getEvent(actor, eventId);
    const now = new Date().toISOString();
    const approved: SchedulingEvent = {
      ...existing,
      approvalStatus: "APPROVED",
      confirmedBy: actor.userId,
      confirmedAt: now,
      version: existing.version + 1,
      auditTrail: [
        ...existing.auditTrail,
        this.auditTrailItem("SCHEDULING_EVENT_APPROVED", actor, now, existing.version + 1, {
          finalAuthority: "AUTHORIZED_HUMAN"
        })
      ],
      updatedAt: now
    };

    const saved = await this.repository.updateEvent(approved);
    await this.audit("SCHEDULING_EVENT_APPROVED", actor, existing, saved, undefined, saved.id);

    return saved;
  }

  async rejectEvent(actor: SchedulingActor, eventId: string): Promise<SchedulingEvent> {
    this.validateActor(actor);
    this.assertAuthorizedHuman(actor);

    const existing = await this.getEvent(actor, eventId);
    const now = new Date().toISOString();
    const rejected: SchedulingEvent = {
      ...existing,
      approvalStatus: "REJECTED",
      version: existing.version + 1,
      auditTrail: [
        ...existing.auditTrail,
        this.auditTrailItem("SCHEDULING_EVENT_REJECTED", actor, now, existing.version + 1, {
          finalAuthority: "AUTHORIZED_HUMAN"
        })
      ],
      updatedAt: now
    };

    const saved = await this.repository.updateEvent(rejected);
    await this.audit("SCHEDULING_EVENT_REJECTED", actor, existing, saved, undefined, saved.id);

    return saved;
  }

  private async getTask(actor: SchedulingActor, taskId: string): Promise<SchedulingTask> {
    const task = await this.repository.findTaskById(taskId, actor.organizationId);

    if (!task) {
      throw new NotFoundException("Scheduling task not found.");
    }

    return task;
  }

  private async getEvent(actor: SchedulingActor, eventId: string): Promise<SchedulingEvent> {
    const event = await this.repository.findEventById(eventId, actor.organizationId);

    if (!event) {
      throw new NotFoundException("Scheduling event not found.");
    }

    return event;
  }

  private detectConflictsPlaceholder(): string[] {
    return [];
  }

  private async audit(
    action: SchedulingAuditAction,
    actor: SchedulingActor,
    beforeState:
      | SchedulingTask
      | SchedulingEvent
      | SchedulingReminder
      | ScheduledAgentRun
      | SchedulingAgenda
      | undefined,
    afterState: SchedulingTask | SchedulingEvent | SchedulingReminder | ScheduledAgentRun | SchedulingAgenda,
    schedulingTaskId?: string,
    schedulingEventId?: string,
    schedulingReminderId?: string,
    schedulingAgentRunId?: string
  ): Promise<void> {
    await this.repository.appendAuditEvent({
      id: randomUUID(),
      organizationId: actor.organizationId,
      schedulingTaskId,
      schedulingEventId,
      schedulingReminderId,
      schedulingAgentRunId,
      action,
      actorId: actor.userId,
      beforeState,
      afterState,
      createdAt: new Date().toISOString()
    });
  }

  private auditTrailItem(
    action: SchedulingAuditAction,
    actor: SchedulingActor,
    at: string,
    version: number,
    details?: object
  ): SchedulingAuditTrailItem {
    return {
      id: randomUUID(),
      action,
      actorId: actor.userId,
      at,
      version,
      details
    };
  }

  private validateActor(actor: SchedulingActor): void {
    if (!actor.userId || !actor.organizationId) {
      throw new BadRequestException("userId and organizationId are required.");
    }
  }

  private validateTitle(title: string): void {
    if (!title) {
      throw new BadRequestException("title is required.");
    }
  }

  private assertAuthorizedHuman(actor: SchedulingActor): void {
    const permissions = new Set(actor.permissions ?? []);
    const roles = new Set((actor.roles ?? []).map((role) => role.toUpperCase()));

    if (
      !permissions.has("review:approve") &&
      !roles.has("PLATFORM_CREATOR") &&
      !roles.has("ADMIN") &&
      !roles.has("REVIEWER")
    ) {
      throw new ForbiddenException("Only authorized humans may confirm schedules.");
    }
  }
}
