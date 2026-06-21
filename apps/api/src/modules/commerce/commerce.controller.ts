import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CurrentActor } from "../auth/request-context.decorator";
import { type AuthenticatedRequestContext } from "../auth/request-context.types";
import { CommerceService } from "./commerce.service";
import {
  type CreateCommerceDistributionInput,
  type CreateCommerceEditionInput
} from "./commerce.types";

@Controller("commerce")
export class CommerceAdminController {
  constructor(private readonly commerceService: CommerceService) {}

  @Post("editions")
  createEdition(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Body() input: CreateCommerceEditionInput
  ) {
    return this.commerceService.createEdition(actor, input);
  }

  @Get("editions/:id")
  getEdition(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string
  ) {
    return this.commerceService.getEdition(actor, id);
  }

  @Post("editions/:id/distribution")
  createDistribution(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string,
    @Body() input: CreateCommerceDistributionInput
  ) {
    return this.commerceService.createDistribution(actor, id, input);
  }

  @Post("editions/:id/approve")
  approveEdition(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string
  ) {
    return this.commerceService.approveEdition(actor, id);
  }

  @Post("editions/:id/reject")
  rejectEdition(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string
  ) {
    return this.commerceService.rejectEdition(actor, id);
  }
}

@Controller("public")
export class PublicStoreController {
  constructor(private readonly commerceService: CommerceService) {}

  @Get("store")
  listPublicStore() {
    return this.commerceService.listPublicStore();
  }
}
