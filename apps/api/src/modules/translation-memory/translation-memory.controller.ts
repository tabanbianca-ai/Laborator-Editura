import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { CurrentActor } from "../auth/request-context.decorator";
import { type AuthenticatedRequestContext } from "../auth/request-context.types";
import { TranslationMemoryService } from "./translation-memory.service";
import {
  type CreateTranslationMemoryEntryInput,
  type ListTranslationMemoryInput,
  type SearchTranslationMemoryInput
} from "./translation-memory.types";

@Controller("translation-memory")
export class TranslationMemoryController {
  constructor(private readonly translationMemoryService: TranslationMemoryService) {}

  @Post()
  createEntry(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Body() input: CreateTranslationMemoryEntryInput
  ) {
    return this.translationMemoryService.createEntry(actor, input);
  }

  @Get("search")
  searchMatches(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Query() query: Record<string, string | undefined>
  ) {
    const input: SearchTranslationMemoryInput = {
      sourceText: query.sourceText ?? "",
      sourceLanguage: query.sourceLanguage ?? "",
      targetLanguage: query.targetLanguage ?? "",
      domain: query.domain,
      limit: query.limit ? Number(query.limit) : undefined,
      similarityThreshold: query.similarityThreshold
        ? Number(query.similarityThreshold)
        : undefined
    };

    return this.translationMemoryService.searchMatches(actor, input);
  }

  @Post(":id/approve")
  approveEntry(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string
  ) {
    return this.translationMemoryService.approveEntry(actor, id);
  }

  @Get()
  listEntries(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Query() query: Record<string, string | undefined>
  ) {
    const input: ListTranslationMemoryInput = {
      sourceLanguage: query.sourceLanguage ?? "",
      targetLanguage: query.targetLanguage ?? "",
      domain: query.domain,
      includePending: query.includePending === "true"
    };

    return this.translationMemoryService.listEntries(actor, input);
  }
}
