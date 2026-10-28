import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { CurrentActor } from "../auth/request-context.decorator";
import { type AuthenticatedRequestContext } from "../auth/request-context.types";
import { AiAgentRegistryService } from "./ai-agent-registry.service";

@Controller("ai/agents")
export class AiAgentRegistryController {
  constructor(private readonly registry: AiAgentRegistryService) {}

  @Get()
  list(@CurrentActor() actor: AuthenticatedRequestContext) {
    return this.registry.listAgents(actor);
  }

  @Get(":id")
  get(@CurrentActor() actor: AuthenticatedRequestContext, @Param("id") id: string) {
    return this.registry.getAgent(actor, id);
  }

  @Get(":id/versions")
  versions(@CurrentActor() actor: AuthenticatedRequestContext, @Param("id") id: string) {
    return this.registry.listVersions(actor, id);
  }

  @Post(":id/versions")
  create(@CurrentActor() actor: AuthenticatedRequestContext, @Param("id") id: string, @Body() input: unknown) {
    return this.registry.createDraft(actor, id, input);
  }

  @Patch(":id/versions/:versionId")
  update(@CurrentActor() actor: AuthenticatedRequestContext, @Param("id") id: string,
    @Param("versionId") versionId: string, @Body() input: unknown) {
    return this.registry.updateDraft(actor, id, versionId, input);
  }

  @Post(":id/versions/:versionId/approve")
  approve(@CurrentActor() actor: AuthenticatedRequestContext, @Param("id") id: string,
    @Param("versionId") versionId: string, @Body() input: unknown) {
    return this.registry.approveVersion(actor, id, versionId, input);
  }

  @Post(":id/versions/:versionId/activate")
  activate(@CurrentActor() actor: AuthenticatedRequestContext, @Param("id") id: string,
    @Param("versionId") versionId: string, @Body() input: unknown) {
    return this.registry.activateVersion(actor, id, versionId, input);
  }

  @Post(":id/disable")
  disable(@CurrentActor() actor: AuthenticatedRequestContext, @Param("id") id: string, @Body() input: unknown) {
    return this.registry.disableAgent(actor, id, input);
  }
}
