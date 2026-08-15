import { Body, Controller, Get, Post } from "@nestjs/common";
import { CurrentActor } from "../auth/request-context.decorator";
import { type AuthenticatedRequestContext } from "../auth/request-context.types";
import { VpsOperationsService } from "./vps-operations.service";

@Controller("vps-operations")
export class VpsOperationsController {
  constructor(
    private readonly vpsOperationsService: VpsOperationsService
  ) {}

  @Get("capabilities")
  capabilities(
    @CurrentActor() actor: AuthenticatedRequestContext
  ) {
    return this.vpsOperationsService.capabilities(actor);
  }

  @Post("execute")
  execute(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Body() input: { action?: string }
  ) {
    return this.vpsOperationsService.execute(
      actor,
      input.action ?? ""
    );
  }
}
