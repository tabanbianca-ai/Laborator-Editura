import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const moduleDir = join(__dirname, "..", "src", "modules", "scheduling");
const appModule = readFileSync(join(__dirname, "..", "src", "modules", "app.module.ts"), "utf8");
const runtimeDatabase = readFileSync(
  join(__dirname, "..", "..", "..", "packages", "db", "src", "runtime-database.ts"),
  "utf8"
);
const runtimeBackup = readFileSync(
  join(__dirname, "..", "..", "..", "packages", "db", "scripts", "runtime-backup-lib.mjs"),
  "utf8"
);

function readSource(name) {
  return readFileSync(join(moduleDir, name), "utf8");
}

test("scheduling agent is registered with authenticated endpoints", () => {
  const controller = readSource("scheduling.controller.ts");
  const moduleSource = readSource("scheduling.module.ts");

  assert.match(appModule, /SchedulingModule/);
  assert.match(moduleSource, /DatabaseSchedulingRepository/);
  assert.match(moduleSource, /SchedulingService/);
  assert.match(controller, /@Controller\("scheduling"\)/);
  assert.match(controller, /@Get\("agenda"\)/);
  assert.match(controller, /@Post\("tasks"\)/);
  assert.match(controller, /@Post\("events"\)/);
  assert.match(controller, /@Post\("reminders"\)/);
  assert.match(controller, /@Post\("agent-runs"\)/);
  assert.match(controller, /@Post\("tasks\/:id\/approve"\)/);
  assert.match(controller, /@Post\("tasks\/:id\/reject"\)/);
  assert.match(controller, /@Post\("events\/:id\/approve"\)/);
  assert.match(controller, /@Post\("events\/:id\/reject"\)/);
  assert.match(controller, /CurrentActor/);
  assert.doesNotMatch(controller, /x-user-id/);
  assert.doesNotMatch(controller, /x-organization-id/);
});

test("agenda endpoint aggregates personal team publication and AI calendars", () => {
  const service = readSource("scheduling.service.ts");
  const types = readSource("scheduling.types.ts");

  for (const field of [
    "personalAgenda",
    "teamAgenda",
    "meetings",
    "conferences",
    "publicationCalendar",
    "aiTaskCalendar",
    "reminders"
  ]) {
    assert.match(types, new RegExp(`${field}:`));
  }

  assert.match(service, /personalAgenda: tasks/);
  assert.match(service, /teamAgenda: events/);
  assert.match(service, /meetings: events\.filter/);
  assert.match(service, /conferences: events\.filter/);
  assert.match(service, /publicationCalendar:/);
  assert.match(service, /aiTaskCalendar: agentRuns/);
  assert.match(service, /reminders/);
  assert.match(service, /AGENDA_VIEWED/);
});

test("task creation supports editorial deadlines and publication planning", () => {
  const repository = readSource("scheduling.repository.ts");
  const service = readSource("scheduling.service.ts");
  const types = readSource("scheduling.types.ts");

  for (const taskType of [
    "PROJECT_DEADLINE",
    "DOCUMENT_DEADLINE",
    "REVIEW_DEADLINE",
    "PUBLICATION_DEADLINE",
    "AI_TASK"
  ]) {
    assert.match(types, new RegExp(`"${taskType}"`));
  }

  assert.match(repository, /scheduling_tasks/);
  assert.match(service, /createTask/);
  assert.match(service, /SCHEDULING_TASK_CREATED/);
  assert.match(service, /dueAt/);
});

test("event creation supports meetings conferences recurring events and publication calendar", () => {
  const repository = readSource("scheduling.repository.ts");
  const service = readSource("scheduling.service.ts");
  const types = readSource("scheduling.types.ts");

  for (const field of [
    "startsAt",
    "endsAt",
    "recurrenceRule",
    "participants",
    "location"
  ]) {
    assert.match(types, new RegExp(`${field}\\??:`));
  }

  assert.match(types, /"MEETING"/);
  assert.match(types, /"CONFERENCE"/);
  assert.match(types, /"PUBLICATION_CALENDAR"/);
  assert.match(repository, /scheduling_events/);
  assert.match(service, /SCHEDULING_EVENT_CREATED/);
});

test("reminder creation supports task meeting publication and overdue reminders", () => {
  const repository = readSource("scheduling.repository.ts");
  const service = readSource("scheduling.service.ts");
  const types = readSource("scheduling.types.ts");

  for (const reminderType of [
    "TASK_REMINDER",
    "MEETING_REMINDER",
    "PUBLICATION_REMINDER",
    "OVERDUE_ALERT"
  ]) {
    assert.match(types, new RegExp(`"${reminderType}"`));
  }

  assert.match(types, /overdueAlert: boolean/);
  assert.match(types, /delivered: false/);
  assert.match(repository, /scheduling_reminders/);
  assert.match(service, /SCHEDULING_REMINDER_CREATED/);
});

test("agent run scheduling tracks dependencies execution order workload balancing and priority", () => {
  const repository = readSource("scheduling.repository.ts");
  const service = readSource("scheduling.service.ts");
  const types = readSource("scheduling.types.ts");

  for (const field of [
    "agentName",
    "scheduledFor",
    "dependenciesBetweenAgents",
    "executionOrder",
    "workloadBalancingNotes",
    "taskPriority"
  ]) {
    assert.match(types, new RegExp(`${field}:`));
    assert.match(service, new RegExp(`${field}:`));
  }

  assert.match(repository, /scheduling_agent_runs/);
  assert.match(service, /SCHEDULING_AGENT_RUN_CREATED/);
});

test("conflict detection and external calendar integration remain placeholders", () => {
  const service = readSource("scheduling.service.ts");
  const types = readSource("scheduling.types.ts");

  assert.match(types, /conflictDetectionStatus: "PLACEHOLDER_ONLY"/);
  assert.match(types, /externalCalendarIntegration: "NOT_CONFIGURED"/);
  assert.match(service, /detectConflictsPlaceholder/);
  assert.match(service, /conflictDetectionStatus: "PLACEHOLDER_ONLY"/);
  assert.match(service, /externalCalendarIntegration: "NOT_CONFIGURED"/);
});

test("scheduling preserves human final authority and blocks AI auto confirmation", () => {
  const service = readSource("scheduling.service.ts");
  const types = readSource("scheduling.types.ts");

  assert.match(types, /humanApprovalRequired: true/);
  assert.match(types, /approvalStatus: SchedulingApprovalStatus/);
  assert.match(service, /humanApprovalRequired: true/);
  assert.match(service, /approvalStatus: "PENDING_HUMAN_APPROVAL"/);
  assert.match(service, /assertAuthorizedHuman/);
  assert.match(service, /Only authorized humans may confirm schedules/);
  assert.match(service, /finalAuthority: "AUTHORIZED_HUMAN"/);
  assert.doesNotMatch(service, /approvalStatus: "APPROVED"[\s\S]*createTask/);
});

test("scheduling audit trail is preserved for agenda tasks events reminders agent runs and approvals", () => {
  const repository = readSource("scheduling.repository.ts");
  const service = readSource("scheduling.service.ts");
  const types = readSource("scheduling.types.ts");

  assert.match(repository, /scheduling_audit_events/);
  assert.match(types, /SchedulingAuditTrailItem/);
  assert.match(types, /AGENDA_VIEWED/);
  assert.match(types, /SCHEDULING_TASK_APPROVED/);
  assert.match(types, /SCHEDULING_EVENT_REJECTED/);
  assert.match(service, /auditTrail/);
  assert.match(service, /repository\.appendAuditEvent/);
});

test("scheduling is planning and audit only without external calendar providers", () => {
  const service = readSource("scheduling.service.ts");

  assert.match(service, /PLANNING_ONLY/);
  assert.match(service, /NOT_CONFIGURED/);
  assert.doesNotMatch(service, /googleapis/);
  assert.doesNotMatch(service, /Microsoft Graph/);
  assert.doesNotMatch(service, /caldav/);
  assert.doesNotMatch(service, /child_process/);
});

test("runtime persistence and backup include scheduling data", () => {
  for (const tableName of [
    "scheduling_tasks",
    "scheduling_events",
    "scheduling_reminders",
    "scheduling_agent_runs",
    "scheduling_audit_events"
  ]) {
    assert.match(runtimeDatabase, new RegExp(`"${tableName}"`));
    assert.match(runtimeBackup, new RegExp(`"${tableName}"`));
  }

  assert.match(runtimeDatabase, /"schedulingTaskId"/);
  assert.match(runtimeBackup, /"schedulingAgentRunId"/);
});
