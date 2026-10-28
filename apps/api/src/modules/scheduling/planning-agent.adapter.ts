import { ForbiddenException, Injectable } from "@nestjs/common";
import { SchedulingService } from "./scheduling.service";
import { ProjectsService } from "../projects/projects.service";
import { WorkflowDefinitionService } from "../workflow/workflow-definition.service";
import { localDescriptor, type LocalHandlerAdapter, type LocalHandlerInput } from "../ai-governance/ai-handler.contract";
import { type AuthenticatedRequestContext } from "../auth/request-context.types";

@Injectable()
export class PlanningAgentAdapter implements LocalHandlerAdapter {
  constructor(private readonly scheduling: SchedulingService, private readonly projects: ProjectsService,
    private readonly workflows: WorkflowDefinitionService) {}
  descriptors() {
    return [
      localDescriptor("coordinator-agent", "coordinator.plan.v1", "coordinator.plan", "PROJECT", ["project.read"], false, ["taskCount", "eventCount"], true),
      localDescriptor("planning-coordination-subagent", "planning.dependencies.v1", "planning.dependencies", "PROJECT", ["project.read"], false, ["taskCount", "eventCount"], true)
    ];
  }
  async authorize(actor: AuthenticatedRequestContext, input: LocalHandlerInput) {
    if (input.resource.id !== input.projectId) throw new ForbiddenException();
    await this.projects.getProject(actor, input.projectId);
  }
  async execute(agentId: string, actor: AuthenticatedRequestContext, input: LocalHandlerInput, signal: AbortSignal) {
    if (signal.aborted || input.resource.id !== input.projectId) throw new ForbiddenException();
    const project = await this.projects.getProject(actor, input.projectId);
    const agenda = await this.scheduling.getProjectAgenda(actor, project.id);
    if (agenda.tasks.length > 200 || agenda.events.length > 200) throw new ForbiddenException("Agenda exceeds bounded local analysis.");
    const ids = new Set(agenda.tasks.map((task) => task.id));
    const issues: string[] = [];
    const now = Date.now();
    for (const task of agenda.tasks) {
      if (signal.aborted) throw new ForbiddenException();
      if (task.dependencies.some((id) => !ids.has(id))) issues.push("UNRESOLVED_OR_UNAUTHORIZED_DEPENDENCY");
      if (!Number.isFinite(Date.parse(task.dueAt))) issues.push("INVALID_DEADLINE");
      else if (Date.parse(task.dueAt) < now && task.approvalStatus !== "APPROVED") issues.push("OVERDUE_TASK");
    }
    for (const event of agenda.events) {
      const start = Date.parse(event.startsAt);
      const end = event.endsAt ? Date.parse(event.endsAt) : start;
      if (!Number.isFinite(start) || !Number.isFinite(end) || end < start) issues.push("INVALID_EVENT_WINDOW");
    }
    const visiting = new Set<string>();
    const visited = new Set<string>();
    const cycle = (id: string): boolean => {
      if (visiting.has(id)) return true;
      if (visited.has(id)) return false;
      visiting.add(id);
      if (agenda.tasks.find((task) => task.id === id)?.dependencies.filter((dep) => ids.has(dep)).some(cycle)) return true;
      visiting.delete(id); visited.add(id); return false;
    };
    if (agenda.tasks.some((task) => cycle(task.id))) issues.push("CYCLIC_TASK_DEPENDENCIES");
    const stages = project.editorialProcess ?? [];
    if (!stages.length) issues.push("MISSING_EDITORIAL_PROCESS");
    if (agentId === "coordinator-agent" && !this.workflows.listDefinitions(actor).some((definition) => definition.status === "ACTIVE")) {
      issues.push("NO_ACTIVE_WORKFLOW_DEFINITION");
    }
    return { readiness: issues.length ? "READY_WITH_WARNINGS" as const : "READY" as const,
      issues: [...new Set(issues)], humanApprovalRequired: true as const,
      metrics: { taskCount: agenda.tasks.length, eventCount: agenda.events.length },
      plan: stages.map((stage, index) => ({ stage, dependencies: index ? [stages[index - 1]!] : [], blocked: issues.length > 0 })),
      provenance: [{ resourceType: "PROJECT", resourceId: project.id, version: project.updatedAt },
        ...agenda.tasks.map((task) => ({ resourceType: "SCHEDULING_TASK", resourceId: task.id, version: String(task.version) })),
        ...agenda.events.map((event) => ({ resourceType: "SCHEDULING_EVENT", resourceId: event.id, version: String(event.version) }))]
    };
  }
}
