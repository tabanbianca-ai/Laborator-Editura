import { Body, Controller, Get, HttpCode, Param, Post } from "@nestjs/common";
import { CurrentActor } from "../auth/request-context.decorator";
import { type AuthenticatedRequestContext } from "../auth/request-context.types";
import { AiExecutionService } from "./ai-execution.service";

@Controller("ai/tasks")
export class AiExecutionController {
  constructor(private readonly runtime: AiExecutionService) {}
  @Post()
  create(@CurrentActor() actor: AuthenticatedRequestContext, @Body() input: unknown) {
    return this.runtime.create(actor, input);
  }
  @Get(":id")
  get(@CurrentActor() actor: AuthenticatedRequestContext, @Param("id") id: string) {
    return this.runtime.read(actor, id);
  }
  @Post(":id/run")
  @HttpCode(202)
  run(@CurrentActor() actor: AuthenticatedRequestContext, @Param("id") id: string) {
    return this.runtime.schedule(actor, id);
  }
  @Post(":id/cancel")
  cancel(@CurrentActor() actor: AuthenticatedRequestContext, @Param("id") id: string) {
    return this.runtime.cancel(actor, id);
  }
}
