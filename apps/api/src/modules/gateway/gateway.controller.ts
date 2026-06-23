import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CurrentActor } from "../auth/request-context.decorator";
import { type AuthenticatedRequestContext } from "../auth/request-context.types";
import { GatewayService } from "./gateway.service";
import {
  type CreateGatewayApiKeyInput,
  type CreateIntegrationProviderInput,
  type CreateWebhookInput,
  type IntegrationStateChangeInput,
  type WebhookStateChangeInput
} from "./gateway.types";

@Controller("gateway")
export class GatewayController {
  constructor(private readonly gatewayService: GatewayService) {}

  @Get("health")
  getHealth(@CurrentActor() actor: AuthenticatedRequestContext) {
    return this.gatewayService.getHealth(actor);
  }

  @Get("routes")
  getRoutes(@CurrentActor() actor: AuthenticatedRequestContext) {
    return this.gatewayService.getRoutes(actor);
  }

  @Get("modules")
  getModules(@CurrentActor() actor: AuthenticatedRequestContext) {
    return this.gatewayService.getModules(actor);
  }

  @Post("api-keys")
  createApiKey(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Body() input: CreateGatewayApiKeyInput
  ) {
    return this.gatewayService.createApiKey(actor, input);
  }

  @Post("api-keys/:id/revoke")
  revokeApiKey(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string
  ) {
    return this.gatewayService.revokeApiKey(actor, id);
  }

  @Get("api-keys")
  listApiKeys(@CurrentActor() actor: AuthenticatedRequestContext) {
    return this.gatewayService.listApiKeys(actor);
  }
}

@Controller("integrations")
export class IntegrationsController {
  constructor(private readonly gatewayService: GatewayService) {}

  @Post()
  createIntegration(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Body() input: CreateIntegrationProviderInput
  ) {
    return this.gatewayService.createIntegration(actor, input);
  }

  @Get()
  listIntegrations(@CurrentActor() actor: AuthenticatedRequestContext) {
    return this.gatewayService.listIntegrations(actor);
  }

  @Get(":id")
  getIntegration(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string
  ) {
    return this.gatewayService.getIntegration(actor, id);
  }

  @Post(":id/enable")
  enableIntegration(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string,
    @Body() input: IntegrationStateChangeInput
  ) {
    return this.gatewayService.enableIntegration(actor, id, input);
  }

  @Post(":id/disable")
  disableIntegration(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string,
    @Body() input: IntegrationStateChangeInput
  ) {
    return this.gatewayService.disableIntegration(actor, id, input);
  }
}

@Controller("webhooks")
export class WebhooksController {
  constructor(private readonly gatewayService: GatewayService) {}

  @Post()
  createWebhook(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Body() input: CreateWebhookInput
  ) {
    return this.gatewayService.createWebhook(actor, input);
  }

  @Get()
  listWebhooks(@CurrentActor() actor: AuthenticatedRequestContext) {
    return this.gatewayService.listWebhooks(actor);
  }

  @Post(":id/enable")
  enableWebhook(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string,
    @Body() input: WebhookStateChangeInput
  ) {
    return this.gatewayService.enableWebhook(actor, id, input);
  }

  @Post(":id/disable")
  disableWebhook(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string,
    @Body() input: WebhookStateChangeInput
  ) {
    return this.gatewayService.disableWebhook(actor, id, input);
  }
}
