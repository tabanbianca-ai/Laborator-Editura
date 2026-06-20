export type SchedulingTaskType =
  | "PROJECT_DEADLINE"
  | "DOCUMENT_DEADLINE"
  | "REVIEW_DEADLINE"
  | "PUBLICATION_DEADLINE"
  | "AI_TASK";

export type SchedulingEventType =
  | "PERSONAL_AGENDA"
  | "TEAM_AGENDA"
  | "MEETING"
  | "CONFERENCE"
  | "PUBLICATION_CALENDAR"
  | "AI_TASK_CALENDAR";

export type SchedulingReminderType =
  | "TASK_REMINDER"
  | "MEETING_REMINDER"
  | "PUBLICATION_REMINDER"
  | "OVERDUE_ALERT";

export type SchedulingPriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type SchedulingApprovalStatus =
  | "PENDING_HUMAN_APPROVAL"
  | "APPROVED"
  | "REJECTED";

export type SchedulingAuditAction =
  | "AGENDA_VIEWED"
  | "SCHEDULING_TASK_CREATED"
  | "SCHEDULING_EVENT_CREATED"
  | "SCHEDULING_REMINDER_CREATED"
  | "SCHEDULING_AGENT_RUN_CREATED"
  | "SCHEDULING_TASK_APPROVED"
  | "SCHEDULING_TASK_REJECTED"
  | "SCHEDULING_EVENT_APPROVED"
  | "SCHEDULING_EVENT_REJECTED";

export interface SchedulingActor {
  userId: string;
  organizationId: string;
  roles?: string[];
  permissions?: string[];
}

export interface SchedulingAuditTrailItem {
  id: string;
  action: SchedulingAuditAction;
  actorId: string;
  at: string;
  version: number;
  details?: object;
}

export interface SchedulingTask {
  id: string;
  organizationId: string;
  projectId?: string;
  documentId?: string;
  title: string;
  taskType: SchedulingTaskType;
  dueAt: string;
  priority: SchedulingPriority;
  dependencies: string[];
  conflictDetectionStatus: "PLACEHOLDER_ONLY";
  conflicts: string[];
  approvalStatus: SchedulingApprovalStatus;
  humanApprovalRequired: true;
  externalCalendarIntegration: "NOT_CONFIGURED";
  confirmedBy?: string;
  confirmedAt?: string;
  auditTrail: SchedulingAuditTrailItem[];
  version: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, unknown>;
}

export interface SchedulingEvent {
  id: string;
  organizationId: string;
  projectId?: string;
  documentId?: string;
  title: string;
  eventType: SchedulingEventType;
  startsAt: string;
  endsAt?: string;
  recurrenceRule?: string;
  participants: string[];
  location?: string;
  conflictDetectionStatus: "PLACEHOLDER_ONLY";
  conflicts: string[];
  approvalStatus: SchedulingApprovalStatus;
  humanApprovalRequired: true;
  externalCalendarIntegration: "NOT_CONFIGURED";
  confirmedBy?: string;
  confirmedAt?: string;
  auditTrail: SchedulingAuditTrailItem[];
  version: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, unknown>;
}

export interface SchedulingReminder {
  id: string;
  organizationId: string;
  schedulingTaskId?: string;
  schedulingEventId?: string;
  schedulingAgentRunId?: string;
  reminderType: SchedulingReminderType;
  message: string;
  remindAt: string;
  overdueAlert: boolean;
  delivered: false;
  externalCalendarIntegration: "NOT_CONFIGURED";
  auditTrail: SchedulingAuditTrailItem[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, unknown>;
}

export interface ScheduledAgentRun {
  id: string;
  organizationId: string;
  title: string;
  agentName: string;
  scheduledFor: string;
  dependenciesBetweenAgents: string[];
  executionOrder: string[];
  workloadBalancingNotes: string[];
  taskPriority: SchedulingPriority;
  conflictDetectionStatus: "PLACEHOLDER_ONLY";
  conflicts: string[];
  approvalStatus: SchedulingApprovalStatus;
  humanApprovalRequired: true;
  executionMode: "PLANNING_ONLY";
  externalCalendarIntegration: "NOT_CONFIGURED";
  auditTrail: SchedulingAuditTrailItem[];
  version: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, unknown>;
}

export interface SchedulingAgenda {
  personalAgenda: SchedulingTask[];
  teamAgenda: SchedulingEvent[];
  meetings: SchedulingEvent[];
  conferences: SchedulingEvent[];
  publicationCalendar: Array<SchedulingTask | SchedulingEvent>;
  aiTaskCalendar: ScheduledAgentRun[];
  reminders: SchedulingReminder[];
  conflictDetectionStatus: "PLACEHOLDER_ONLY";
  externalCalendarIntegration: "NOT_CONFIGURED";
  generatedAt: string;
}

export interface SchedulingAuditEvent {
  id: string;
  organizationId: string;
  schedulingTaskId?: string;
  schedulingEventId?: string;
  schedulingReminderId?: string;
  schedulingAgentRunId?: string;
  action: SchedulingAuditAction;
  actorId: string;
  beforeState?: SchedulingTask | SchedulingEvent | SchedulingReminder | ScheduledAgentRun | SchedulingAgenda;
  afterState?: SchedulingTask | SchedulingEvent | SchedulingReminder | ScheduledAgentRun | SchedulingAgenda;
  createdAt: string;
}

export interface CreateSchedulingTaskInput {
  projectId?: string;
  documentId?: string;
  title: string;
  taskType: SchedulingTaskType;
  dueAt: string;
  priority?: SchedulingPriority;
  dependencies?: string[];
  metadata?: Record<string, unknown>;
}

export interface CreateSchedulingEventInput {
  projectId?: string;
  documentId?: string;
  title: string;
  eventType: SchedulingEventType;
  startsAt: string;
  endsAt?: string;
  recurrenceRule?: string;
  participants?: string[];
  location?: string;
  metadata?: Record<string, unknown>;
}

export interface CreateSchedulingReminderInput {
  schedulingTaskId?: string;
  schedulingEventId?: string;
  schedulingAgentRunId?: string;
  reminderType: SchedulingReminderType;
  message: string;
  remindAt: string;
  overdueAlert?: boolean;
  metadata?: Record<string, unknown>;
}

export interface CreateScheduledAgentRunInput {
  title: string;
  agentName: string;
  scheduledFor: string;
  dependenciesBetweenAgents?: string[];
  executionOrder?: string[];
  workloadBalancingNotes?: string[];
  taskPriority?: SchedulingPriority;
  metadata?: Record<string, unknown>;
}

export interface SchedulingRepository {
  createTask(task: SchedulingTask): Promise<SchedulingTask>;
  updateTask(task: SchedulingTask): Promise<SchedulingTask>;
  findTaskById(id: string, organizationId: string): Promise<SchedulingTask | null>;
  listTasks(organizationId: string): Promise<SchedulingTask[]>;
  createEvent(event: SchedulingEvent): Promise<SchedulingEvent>;
  updateEvent(event: SchedulingEvent): Promise<SchedulingEvent>;
  findEventById(id: string, organizationId: string): Promise<SchedulingEvent | null>;
  listEvents(organizationId: string): Promise<SchedulingEvent[]>;
  createReminder(reminder: SchedulingReminder): Promise<SchedulingReminder>;
  listReminders(organizationId: string): Promise<SchedulingReminder[]>;
  createAgentRun(agentRun: ScheduledAgentRun): Promise<ScheduledAgentRun>;
  listAgentRuns(organizationId: string): Promise<ScheduledAgentRun[]>;
  appendAuditEvent(event: SchedulingAuditEvent): Promise<void>;
}
