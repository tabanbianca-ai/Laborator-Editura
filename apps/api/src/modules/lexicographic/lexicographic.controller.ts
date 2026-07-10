import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { CurrentActor } from "../auth/request-context.decorator";
import { type AuthenticatedRequestContext } from "../auth/request-context.types";
import { LexicographicService } from "./lexicographic.service";
import {
  type CompareLexicalSensesInput,
  type CreateDictionaryEntryInput,
  type CreateDictionarySourceInput,
  type LinguisticAuthorityLevel,
  type LinguisticSearchMode,
  type SearchDictionaryEntriesInput,
  type ValidateLexicographicTermInput
} from "./lexicographic.types";

@Controller("lexicographic")
export class LexicographicController {
  constructor(private readonly lexicographicService: LexicographicService) {}

  @Post("sources")
  createSource(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Body() input: CreateDictionarySourceInput
  ) {
    return this.lexicographicService.createSource(actor, input);
  }

  @Get("sources")
  listSources(@CurrentActor() actor: AuthenticatedRequestContext) {
    return this.lexicographicService.listSources(actor);
  }

  @Post("sources/:id")
  updateSource(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") sourceId: string,
    @Body() input: CreateDictionarySourceInput
  ) {
    return this.lexicographicService.updateSource(actor, sourceId, input);
  }

  @Post("sources/:id/disable")
  disableSource(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") sourceId: string
  ) {
    return this.lexicographicService.disableSource(actor, sourceId);
  }

  @Post("entries")
  createEntry(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Body() input: CreateDictionaryEntryInput
  ) {
    return this.lexicographicService.createEntry(actor, input);
  }

  @Get("search")
  searchEntries(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Query() query: Record<string, string | undefined>
  ) {
    const input: SearchDictionaryEntriesInput = {
      term: query.term ?? "",
      sourceLanguage: query.sourceLanguage ?? "",
      targetLanguage: query.targetLanguage,
      projectId: query.projectId,
      phrase: query.phrase,
      idiom: query.idiom,
      languagePair: query.languagePair,
      domain: query.domain,
      grammaticalCategory: query.grammaticalCategory,
      sourceId: query.sourceId,
      edition: query.edition,
      authorityLevel: query.authorityLevel as LinguisticAuthorityLevel | undefined,
      searchMode: query.searchMode as LinguisticSearchMode | undefined,
      limit: query.limit ? Number(query.limit) : undefined
    };

    return this.lexicographicService.searchEntries(actor, input);
  }

  @Post("compare")
  compareSenses(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Body() input: CompareLexicalSensesInput
  ) {
    return this.lexicographicService.compareSenses(actor, input);
  }

  @Post("validate-term")
  validateTerm(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Body() input: ValidateLexicographicTermInput
  ) {
    return this.lexicographicService.validateTerm(actor, input);
  }
}
