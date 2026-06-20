import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CurrentActor } from "../auth/request-context.decorator";
import { type AuthenticatedRequestContext } from "../auth/request-context.types";
import { PublicPortalService } from "./public-portal.service";
import {
  type CreatePublicCatalogItemInput,
  type CreatePublicDistributionRecordInput
} from "./public-portal.types";

@Controller("public-portal")
export class PublicPortalAdminController {
  constructor(private readonly publicPortalService: PublicPortalService) {}

  @Post("catalog-items")
  createCatalogItem(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Body() input: CreatePublicCatalogItemInput
  ) {
    return this.publicPortalService.createCatalogItem(actor, input);
  }

  @Get("catalog-items/:id")
  getCatalogItem(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string
  ) {
    return this.publicPortalService.getCatalogItem(actor, id);
  }

  @Post("catalog-items/:id/distribution-records")
  createDistributionRecord(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string,
    @Body() input: CreatePublicDistributionRecordInput
  ) {
    return this.publicPortalService.createDistributionRecord(actor, id, input);
  }

  @Post("catalog-items/:id/approve-release")
  approveRelease(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string
  ) {
    return this.publicPortalService.approveRelease(actor, id);
  }

  @Post("catalog-items/:id/reject-release")
  rejectRelease(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string
  ) {
    return this.publicPortalService.rejectRelease(actor, id);
  }
}

@Controller("public")
export class PublicCatalogController {
  constructor(private readonly publicPortalService: PublicPortalService) {}

  @Get("catalog")
  listPublicCatalog() {
    return this.publicPortalService.listPublicCatalog();
  }

  @Get("catalog/:id")
  getPublicCatalogItem(@Param("id") id: string) {
    return this.publicPortalService.getPublicCatalogItem(id);
  }
}
