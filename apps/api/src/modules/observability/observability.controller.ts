import { Controller, Get } from "@nestjs/common";
import { CurrentActor } from "../auth/request-context.decorator";
import { type AuthenticatedRequestContext } from "../auth/request-context.types";
import { ObservabilityService } from "./observability.service";

@Controller("observability")
export class ObservabilityController {
  constructor(private readonly observabilityService: ObservabilityService) {}

  @Get("health")
  getHealth(@CurrentActor() actor: AuthenticatedRequestContext) {
    return this.observabilityService.getHealth(actor);
  }

  @Get("metrics")
  getMetrics(@CurrentActor() actor: AuthenticatedRequestContext) {
    return this.observabilityService.getMetrics(actor);
  }

  @Get("logs")
  getLogs(@CurrentActor() actor: AuthenticatedRequestContext) {
    return this.observabilityService.getLogs(actor);
  }

  @Get("traces")
  getTraces(@CurrentActor() actor: AuthenticatedRequestContext) {
    return this.observabilityService.getTraces(actor);
  }

  @Get("agent-executions")
  getAgentExecutions(@CurrentActor() actor: AuthenticatedRequestContext) {
    return this.observabilityService.getAgentExecutions(actor);
  }
}
