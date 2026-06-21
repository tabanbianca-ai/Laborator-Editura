import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { CurrentActor } from "../auth/request-context.decorator";
import { type AuthenticatedRequestContext } from "../auth/request-context.types";
import { LibraryService } from "./library.service";
import {
  type AddBookmarkInput,
  type AddHighlightInput,
  type AddLibraryItemInput,
  type AddNoteInput,
  type UpdateReadingProgressInput
} from "./library.types";

@Controller("library")
export class LibraryController {
  constructor(private readonly libraryService: LibraryService) {}

  @Get()
  listLibrary(@CurrentActor() actor: AuthenticatedRequestContext) {
    return this.libraryService.listLibrary(actor);
  }

  @Post("items")
  addItem(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Body() input: AddLibraryItemInput
  ) {
    return this.libraryService.addItem(actor, input);
  }

  @Post("items/:id/progress")
  updateProgress(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string,
    @Body() input: UpdateReadingProgressInput
  ) {
    return this.libraryService.updateProgress(actor, id, input);
  }

  @Post("items/:id/bookmarks")
  addBookmark(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string,
    @Body() input: AddBookmarkInput
  ) {
    return this.libraryService.addBookmark(actor, id, input);
  }

  @Post("items/:id/highlights")
  addHighlight(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string,
    @Body() input: AddHighlightInput
  ) {
    return this.libraryService.addHighlight(actor, id, input);
  }

  @Post("items/:id/notes")
  addNote(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string,
    @Body() input: AddNoteInput
  ) {
    return this.libraryService.addNote(actor, id, input);
  }

  @Post("items/:id/favorite")
  favoriteItem(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string
  ) {
    return this.libraryService.favoriteItem(actor, id);
  }

  @Delete("items/:id/favorite")
  unfavoriteItem(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string
  ) {
    return this.libraryService.unfavoriteItem(actor, id);
  }
}
