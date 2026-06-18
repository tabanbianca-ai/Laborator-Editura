import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { CurrentActor } from "../auth/request-context.decorator";
import { type AuthenticatedRequestContext } from "../auth/request-context.types";
import { LexicographicService } from "./lexicographic.service";
import {
  type CompareLexicalSensesInput,
  type CreateDictionaryEntryInput,
  type CreateDictionarySourceInput,
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
