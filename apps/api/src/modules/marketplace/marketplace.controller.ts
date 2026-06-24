import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CurrentActor } from "../auth/request-context.decorator";
import { type AuthenticatedRequestContext } from "../auth/request-context.types";
import { MarketplaceService } from "./marketplace.service";
import {
  type CreateMarketplaceAgentInput,
  type CreateMarketplaceExtensionInput,
  type MarketplaceStateChangeInput
} from "./marketplace.types";

@Controller("marketplace")
export class MarketplaceController {
  constructor(private readonly marketplaceService: MarketplaceService) {}

  @Get("agents")
  listAgents(@CurrentActor() actor: AuthenticatedRequestContext) {
    return this.marketplaceService.listAgents(actor);
  }

  @Post("agents")
  createAgent(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Body() input: CreateMarketplaceAgentInput
  ) {
    return this.marketplaceService.createAgent(actor, input);
  }

  @Post("agents/:id/enable")
  enableAgent(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string,
    @Body() input: MarketplaceStateChangeInput
  ) {
    return this.marketplaceService.enableAgent(actor, id, input);
  }

  @Post("agents/:id/disable")
  disableAgent(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string,
    @Body() input: MarketplaceStateChangeInput
  ) {
    return this.marketplaceService.disableAgent(actor, id, input);
  }

  @Get("extensions")
  listExtensions(@CurrentActor() actor: AuthenticatedRequestContext) {
    return this.marketplaceService.listExtensions(actor);
  }

  @Post("extensions")
  createExtension(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Body() input: CreateMarketplaceExtensionInput
  ) {
    return this.marketplaceService.createExtension(actor, input);
  }

  @Post("extensions/:id/enable")
  enableExtension(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string,
    @Body() input: MarketplaceStateChangeInput
  ) {
    return this.marketplaceService.enableExtension(actor, id, input);
  }

  @Post("extensions/:id/disable")
  disableExtension(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string,
    @Body() input: MarketplaceStateChangeInput
  ) {
    return this.marketplaceService.disableExtension(actor, id, input);
  }

  @Get("catalog")
  listCatalog(@CurrentActor() actor: AuthenticatedRequestContext) {
    return this.marketplaceService.listCatalog(actor);
  }

  @Get("audit")
  listAudit(@CurrentActor() actor: AuthenticatedRequestContext) {
    return this.marketplaceService.listAudit(actor);
  }
}
