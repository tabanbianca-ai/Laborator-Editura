import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CurrentActor } from "../auth/request-context.decorator";
import { type AuthenticatedRequestContext } from "../auth/request-context.types";
import { AuthorStudioService } from "./author-studio.service";
import {
  type CreateAuthorManuscriptInput,
  type CreateAuthorNoteInput,
  type CreateAuthorSectionInput,
  type SaveAuthorDraftInput,
  type SubmitAuthorManuscriptInput
} from "./author-studio.types";

@Controller("author-studio")
export class AuthorStudioController {
  constructor(private readonly authorStudioService: AuthorStudioService) {}

  @Post("manuscripts")
  createManuscript(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Body() input: CreateAuthorManuscriptInput
  ) {
    return this.authorStudioService.createManuscript(actor, input);
  }

  @Get("manuscripts")
  listManuscripts(@CurrentActor() actor: AuthenticatedRequestContext) {
    return this.authorStudioService.listManuscripts(actor);
  }

  @Get("manuscripts/:id")
  getManuscript(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string
  ) {
    return this.authorStudioService.getManuscript(actor, id);
  }

  @Get("manuscripts/:id/sections")
  listSections(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string
  ) {
    return this.authorStudioService.listSections(actor, id);
  }

  @Post("manuscripts/:id/sections")
  addSection(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string,
    @Body() input: CreateAuthorSectionInput
  ) {
    return this.authorStudioService.addSection(actor, id, input);
  }

  @Post("sections/:id/drafts")
  saveDraft(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string,
    @Body() input: SaveAuthorDraftInput
  ) {
    return this.authorStudioService.saveDraft(actor, id, input);
  }

  @Get("sections/:id/draft")
  getLatestDraft(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string
  ) {
    return this.authorStudioService.getLatestDraft(actor, id);
  }

  @Post("manuscripts/:id/notes")
  addNote(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string,
    @Body() input: CreateAuthorNoteInput
  ) {
    return this.authorStudioService.addNote(actor, id, input);
  }

  @Post("manuscripts/:id/submit")
  submitManuscript(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string,
    @Body() input: SubmitAuthorManuscriptInput
  ) {
    return this.authorStudioService.submitManuscript(actor, id, input);
  }

  @Post("manuscripts/:id/archive")
  archiveManuscript(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string
  ) {
    return this.authorStudioService.archiveManuscript(actor, id);
  }
}
