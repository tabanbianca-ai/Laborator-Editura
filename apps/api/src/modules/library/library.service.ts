import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { DatabaseLibraryRepository } from "./library.repository";
import {
  type AddBookmarkInput,
  type AddHighlightInput,
  type AddLibraryItemInput,
  type AddNoteInput,
  type LibraryAccessEvent,
  type LibraryActor,
  type LibraryAuditAction,
  type LibraryBookmark,
  type LibraryHighlight,
  type LibraryItem,
  type LibraryNote,
  type LibraryReadingProgress,
  type UpdateReadingProgressInput
} from "./library.types";

@Injectable()
export class LibraryService {
  constructor(private readonly repository: DatabaseLibraryRepository) {}

  async listLibrary(actor: LibraryActor): Promise<LibraryItem[]> {
    this.validateActor(actor);

    return this.repository.listItemsForUser(actor.organizationId, actor.userId);
  }

  async addItem(actor: LibraryActor, input: AddLibraryItemInput): Promise<LibraryItem> {
    this.validateActor(actor);

    if (!input.itemType || !input.title) {
      throw new BadRequestException("itemType and title are required.");
    }

    const now = new Date().toISOString();
    const item: LibraryItem = {
      id: randomUUID(),
      organizationId: actor.organizationId,
      userId: actor.userId,
      publicCatalogItemId: input.publicCatalogItemId,
      commerceEditionId: input.commerceEditionId,
      itemType: input.itemType,
      title: input.title,
      language: input.language,
      sourceReference: input.sourceReference,
      favorite: false,
      savedAt: now,
      createdAt: now,
      updatedAt: now,
      metadata: input.metadata
    };

    const created = await this.repository.createItem(item);
    await this.recordAccess(actor, created, "OPENED", { reason: "item_added" });
    await this.audit("LIBRARY_ITEM_ADDED", actor, created.id, "library_item", created.id, undefined, created);

    return created;
  }

  async updateProgress(
    actor: LibraryActor,
    itemId: string,
    input: UpdateReadingProgressInput
  ): Promise<LibraryReadingProgress> {
    this.validateActor(actor);
    const item = await this.requireItem(actor, itemId);
    const existing = await this.repository.findProgressForItem(item.id, actor.organizationId, actor.userId);
    const now = new Date().toISOString();
    const progress: LibraryReadingProgress = {
      id: existing?.id ?? randomUUID(),
      organizationId: actor.organizationId,
      userId: actor.userId,
      libraryItemId: item.id,
      progressPercent: this.clampProgress(input.progressPercent ?? existing?.progressPercent ?? 0),
      currentChapter: input.currentChapter ?? existing?.currentChapter,
      currentSection: input.currentSection ?? existing?.currentSection,
      position: input.position ?? existing?.position,
      readingSessionId: input.readingSessionId ?? existing?.readingSessionId,
      updatedAt: now
    };

    const saved = await this.repository.upsertProgress(progress);
    await this.touchItemAccess(item, now);
    await this.recordAccess(actor, item, "READING_SESSION_STARTED", {
      readingSessionId: saved.readingSessionId,
      progressPercent: saved.progressPercent
    });
    await this.audit("READING_PROGRESS_UPDATED", actor, item.id, "reading_progress", saved.id, existing ?? undefined, saved);

    return saved;
  }

  async addBookmark(actor: LibraryActor, itemId: string, input: AddBookmarkInput): Promise<LibraryBookmark> {
    this.validateActor(actor);
    const item = await this.requireItem(actor, itemId);
    const now = new Date().toISOString();
    const bookmark: LibraryBookmark = {
      id: randomUUID(),
      organizationId: actor.organizationId,
      userId: actor.userId,
      libraryItemId: item.id,
      chapter: input.chapter,
      section: input.section,
      position: input.position,
      label: input.label,
      createdAt: now
    };

    const created = await this.repository.createBookmark(bookmark);
    await this.audit("BOOKMARK_ADDED", actor, item.id, "bookmark", created.id, undefined, created);

    return created;
  }

  async addHighlight(actor: LibraryActor, itemId: string, input: AddHighlightInput): Promise<LibraryHighlight> {
    this.validateActor(actor);

    if (!input.text) {
      throw new BadRequestException("highlight text is required.");
    }

    const item = await this.requireItem(actor, itemId);
    const now = new Date().toISOString();
    const highlight: LibraryHighlight = {
      id: randomUUID(),
      organizationId: actor.organizationId,
      userId: actor.userId,
      libraryItemId: item.id,
      text: input.text,
      color: input.color,
      chapter: input.chapter,
      section: input.section,
      position: input.position,
      note: input.note,
      createdAt: now
    };

    const created = await this.repository.createHighlight(highlight);
    await this.audit("HIGHLIGHT_ADDED", actor, item.id, "highlight", created.id, undefined, created);

    return created;
  }

  async addNote(actor: LibraryActor, itemId: string, input: AddNoteInput): Promise<LibraryNote> {
    this.validateActor(actor);

    if (!input.content) {
      throw new BadRequestException("note content is required.");
    }

    const item = await this.requireItem(actor, itemId);
    const now = new Date().toISOString();
    const note: LibraryNote = {
      id: randomUUID(),
      organizationId: actor.organizationId,
      userId: actor.userId,
      libraryItemId: item.id,
      content: input.content,
      chapter: input.chapter,
      section: input.section,
      position: input.position,
      createdAt: now,
      updatedAt: now
    };

    const created = await this.repository.createNote(note);
    await this.audit("NOTE_ADDED", actor, item.id, "note", created.id, undefined, created);

    return created;
  }

  async favoriteItem(actor: LibraryActor, itemId: string): Promise<LibraryItem> {
    return this.setFavorite(actor, itemId, true);
  }

  async unfavoriteItem(actor: LibraryActor, itemId: string): Promise<LibraryItem> {
    return this.setFavorite(actor, itemId, false);
  }

  private async setFavorite(actor: LibraryActor, itemId: string, favorite: boolean): Promise<LibraryItem> {
    this.validateActor(actor);
    const existing = await this.requireItem(actor, itemId);
    const now = new Date().toISOString();
    const updated: LibraryItem = {
      ...existing,
      favorite,
      updatedAt: now
    };

    const saved = await this.repository.updateItem(updated);
    await this.audit(
      favorite ? "FAVORITE_ADDED" : "FAVORITE_REMOVED",
      actor,
      saved.id,
      "library_item",
      saved.id,
      existing,
      saved
    );

    return saved;
  }

  private async requireItem(actor: LibraryActor, itemId: string): Promise<LibraryItem> {
    const item = await this.repository.findItemByIdForUser(itemId, actor.organizationId, actor.userId);

    if (!item) {
      throw new NotFoundException("Library item not found.");
    }

    return item;
  }

  private async touchItemAccess(item: LibraryItem, accessedAt: string): Promise<LibraryItem> {
    return this.repository.updateItem({
      ...item,
      lastAccessedAt: accessedAt,
      updatedAt: accessedAt
    });
  }

  private async recordAccess(
    actor: LibraryActor,
    item: LibraryItem,
    eventType: LibraryAccessEvent["eventType"],
    metadata?: Record<string, unknown>
  ): Promise<LibraryAccessEvent> {
    const now = new Date().toISOString();
    const accessEvent: LibraryAccessEvent = {
      id: randomUUID(),
      organizationId: actor.organizationId,
      userId: actor.userId,
      libraryItemId: item.id,
      eventType,
      occurredAt: now,
      metadata
    };

    const created = await this.repository.createAccessEvent(accessEvent);
    await this.audit("ACCESS_EVENT_RECORDED", actor, item.id, "access_event", created.id, undefined, created);

    return created;
  }

  private async audit(
    action: LibraryAuditAction,
    actor: LibraryActor,
    libraryItemId: string,
    entityType: "library_item" | "reading_progress" | "bookmark" | "highlight" | "note" | "access_event",
    entityId: string,
    beforeState: LibraryItem | LibraryReadingProgress | undefined,
    afterState: LibraryItem | LibraryReadingProgress | LibraryBookmark | LibraryHighlight | LibraryNote | LibraryAccessEvent
  ): Promise<void> {
    await this.repository.appendAuditEvent({
      id: randomUUID(),
      organizationId: actor.organizationId,
      userId: actor.userId,
      libraryItemId,
      entityType,
      entityId,
      action,
      actorId: actor.userId,
      beforeState,
      afterState,
      createdAt: new Date().toISOString()
    });
  }

  private clampProgress(progressPercent: number): number {
    return Math.min(100, Math.max(0, progressPercent));
  }

  private validateActor(actor: LibraryActor): void {
    if (!actor.userId || !actor.organizationId) {
      throw new BadRequestException("userId and organizationId are required.");
    }
  }
}
