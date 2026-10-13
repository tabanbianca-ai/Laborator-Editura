import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { CurrentActor } from "../auth/request-context.decorator";
import { type AuthenticatedRequestContext } from "../auth/request-context.types";
import { TranslationsService } from "./translations.service";
import {
  type GenerateAiTranslationProposalInput,
  type ReviseSegmentSourceForTranslationInput,
  type SubmitTranslationInput
} from "./translations.types";

@Controller("translations")
export class TranslationsController {
  constructor(private readonly translationsService: TranslationsService) {}

  @Post("submit")
  submitTranslation(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Body() input: SubmitTranslationInput
  ) {
    return this.translationsService.submitTranslation(actor, input);
  }

  @Post("ai-proposals")
  generateAiProposal(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Body() input: GenerateAiTranslationProposalInput
  ) {
    return this.translationsService.generateAiProposal(actor, input);
  }

  @Get()
  listTranslationsByDocument(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Query("documentId") documentId: string
  ) {
    return this.translationsService.listTranslationsByDocument(actor, documentId);
  }

  @Post("segments/:id/source-revisions")
  reviseSegmentSource(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string,
    @Body() input: ReviseSegmentSourceForTranslationInput
  ) {
    return this.translationsService.reviseSegmentSource(actor, id, input);
  }
}
