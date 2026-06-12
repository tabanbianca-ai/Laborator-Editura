import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { CurrentActor } from "../auth/request-context.decorator";
import { type AuthenticatedRequestContext } from "../auth/request-context.types";
import { TranslationsService } from "./translations.service";
import { type SubmitTranslationInput } from "./translations.types";

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

  @Get()
  listTranslationsByDocument(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Query("documentId") documentId: string
  ) {
    return this.translationsService.listTranslationsByDocument(actor, documentId);
  }
}
