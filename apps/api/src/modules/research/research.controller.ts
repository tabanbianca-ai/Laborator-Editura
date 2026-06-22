import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { CurrentActor } from "../auth/request-context.decorator";
import { type AuthenticatedRequestContext } from "../auth/request-context.types";
import { ResearchService } from "./research.service";
import {
  type AddResearchCollectionItemInput,
  type CreateResearchCollectionInput,
  type CreateResearchEntityInput,
  type CreateResearchNoteInput,
  type CreateResearchRelationshipInput,
  type CreateResearchSourceInput,
  type ResearchSearchQuery
} from "./research.types";

@Controller("research")
export class ResearchController {
  constructor(private readonly researchService: ResearchService) {}

  @Post("sources")
  createSource(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Body() input: CreateResearchSourceInput
  ) {
    return this.researchService.createSource(actor, input);
  }

  @Get("sources")
  listSources(@CurrentActor() actor: AuthenticatedRequestContext) {
    return this.researchService.listSources(actor);
  }

  @Get("sources/:id")
  getSource(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string
  ) {
    return this.researchService.getSource(actor, id);
  }

  @Post("notes")
  createNote(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Body() input: CreateResearchNoteInput
  ) {
    return this.researchService.createNote(actor, input);
  }

  @Post("entities")
  createEntity(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Body() input: CreateResearchEntityInput
  ) {
    return this.researchService.createEntity(actor, input);
  }

  @Post("relationships")
  createRelationship(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Body() input: CreateResearchRelationshipInput
  ) {
    return this.researchService.createRelationship(actor, input);
  }

  @Post("collections")
  createCollection(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Body() input: CreateResearchCollectionInput
  ) {
    return this.researchService.createCollection(actor, input);
  }

  @Post("collections/:id/items")
  addCollectionItem(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string,
    @Body() input: AddResearchCollectionItemInput
  ) {
    return this.researchService.addCollectionItem(actor, id, input);
  }

  @Get("search")
  search(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Query() query: ResearchSearchQuery
  ) {
    return this.researchService.search(actor, query);
  }
}
