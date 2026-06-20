import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CurrentActor } from "../auth/request-context.decorator";
import { type AuthenticatedRequestContext } from "../auth/request-context.types";
import { SchedulingService } from "./scheduling.service";
import {
  type CreateScheduledAgentRunInput,
  type CreateSchedulingEventInput,
  type CreateSchedulingReminderInput,
  type CreateSchedulingTaskInput
} from "./scheduling.types";

@Controller("scheduling")
export class SchedulingController {
  constructor(private readonly schedulingService: SchedulingService) {}

  @Get("agenda")
  getAgenda(@CurrentActor() actor: AuthenticatedRequestContext) {
    return this.schedulingService.getAgenda(actor);
  }

  @Post("tasks")
  createTask(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Body() input: CreateSchedulingTaskInput
  ) {
    return this.schedulingService.createTask(actor, input);
  }

  @Post("events")
  createEvent(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Body() input: CreateSchedulingEventInput
  ) {
    return this.schedulingService.createEvent(actor, input);
  }

  @Post("reminders")
  createReminder(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Body() input: CreateSchedulingReminderInput
  ) {
    return this.schedulingService.createReminder(actor, input);
  }

  @Post("agent-runs")
  createAgentRun(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Body() input: CreateScheduledAgentRunInput
  ) {
    return this.schedulingService.createAgentRun(actor, input);
  }

  @Post("tasks/:id/approve")
  approveTask(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string
  ) {
    return this.schedulingService.approveTask(actor, id);
  }

  @Post("tasks/:id/reject")
  rejectTask(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string
  ) {
    return this.schedulingService.rejectTask(actor, id);
  }

  @Post("events/:id/approve")
  approveEvent(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string
  ) {
    return this.schedulingService.approveEvent(actor, id);
  }

  @Post("events/:id/reject")
  rejectEvent(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string
  ) {
    return this.schedulingService.rejectEvent(actor, id);
  }
}
