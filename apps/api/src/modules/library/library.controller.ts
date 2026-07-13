import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { CurrentActor } from "../auth/request-context.decorator";
import { type AuthenticatedRequestContext } from "../auth/request-context.types";
import { LibraryService } from "./library.service";
import {
  type AddBookmarkInput,
  type AddHighlightInput,
  type AddLibraryItemInput,
  type AddLibraryPublicationFileInput,
  type AddNoteInput,
  type CreateLibraryPublicationEditionInput,
  type CreateLibraryPublicationInput,
  type CreateLibraryPublicationVersionInput,
  type LibraryBulkActionInput,
  type LibraryPublicationSearchInput,
  type SaveLibraryViewPreferenceInput,
  type UpdateLibraryPublicationStatusInput,
  type UpdateLibraryPublicationVisibilityInput,
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

  @Post("publications/search")
  listPublications(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Body() input: LibraryPublicationSearchInput
  ) {
    return this.libraryService.listPublications(actor, input);
  }

  @Post("publications")
  createPublication(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Body() input: CreateLibraryPublicationInput
  ) {
    return this.libraryService.createPublication(actor, input);
  }

  @Post("publications/:id/status")
  updatePublicationStatus(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string,
    @Body() input: UpdateLibraryPublicationStatusInput
  ) {
    return this.libraryService.updatePublicationStatus(actor, id, input);
  }

  @Post("publications/:id/visibility")
  updatePublicationVisibility(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string,
    @Body() input: UpdateLibraryPublicationVisibilityInput
  ) {
    return this.libraryService.updatePublicationVisibility(actor, id, input);
  }

  @Post("publications/:id/editions")
  createPublicationEdition(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string,
    @Body() input: CreateLibraryPublicationEditionInput
  ) {
    return this.libraryService.createEdition(actor, id, input);
  }

  @Post("publications/:id/versions")
  createPublicationVersion(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string,
    @Body() input: CreateLibraryPublicationVersionInput
  ) {
    return this.libraryService.createVersion(actor, id, input);
  }

  @Post("publications/:id/files")
  addPublicationFile(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string,
    @Body() input: AddLibraryPublicationFileInput
  ) {
    return this.libraryService.addPublicationFile(actor, id, input);
  }

  @Post("publications/:id/preview")
  previewPublication(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string
  ) {
    return this.libraryService.previewPublication(actor, id);
  }

  @Post("publications/bulk-actions")
  runPublicationBulkAction(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Body() input: LibraryBulkActionInput
  ) {
    return this.libraryService.runBulkAction(actor, input);
  }

  @Post("publications/duplicates")
  detectPublicationDuplicates(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Body() input: CreateLibraryPublicationInput
  ) {
    return this.libraryService.detectDuplicates(actor, input);
  }

  @Post("preferences")
  saveViewPreference(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Body() input: SaveLibraryViewPreferenceInput
  ) {
    return this.libraryService.saveViewPreference(actor, input);
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
