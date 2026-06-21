import { Inject, Injectable } from "@nestjs/common";
import { getDefaultRuntimeDatabase, type FileBackedRuntimeDatabase } from "@laborator/db";
import { RUNTIME_DATABASE } from "../runtime-database.provider";
import {
  type LibraryAccessEvent,
  type LibraryAuditEvent,
  type LibraryBookmark,
  type LibraryHighlight,
  type LibraryItem,
  type LibraryNote,
  type LibraryReadingProgress,
  type LibraryRepository
} from "./library.types";

@Injectable()
export class DatabaseLibraryRepository implements LibraryRepository {
  constructor(
    @Inject(RUNTIME_DATABASE)
    private readonly database: FileBackedRuntimeDatabase = getDefaultRuntimeDatabase()
  ) {}

  async listItemsForUser(organizationId: string, userId: string): Promise<LibraryItem[]> {
    return this.database.selectForTenant<LibraryItem>(
      "library_items",
      organizationId,
      (item) => item.userId === userId
    );
  }

  async createItem(item: LibraryItem): Promise<LibraryItem> {
    return this.database.insert("library_items", item);
  }

  async updateItem(item: LibraryItem): Promise<LibraryItem> {
    return this.database.upsert("library_items", item);
  }

  async findItemByIdForUser(id: string, organizationId: string, userId: string): Promise<LibraryItem | null> {
    const item = this.database.findByIdForTenant<LibraryItem>("library_items", id, organizationId);

    return item?.userId === userId ? item : null;
  }

  async upsertProgress(progress: LibraryReadingProgress): Promise<LibraryReadingProgress> {
    return this.database.upsert("library_reading_progress", progress);
  }

  async findProgressForItem(
    libraryItemId: string,
    organizationId: string,
    userId: string
  ): Promise<LibraryReadingProgress | null> {
    return this.database.selectForTenant<LibraryReadingProgress>(
      "library_reading_progress",
      organizationId,
      (progress) => progress.userId === userId && progress.libraryItemId === libraryItemId
    )[0] ?? null;
  }

  async createBookmark(bookmark: LibraryBookmark): Promise<LibraryBookmark> {
    return this.database.insert("library_bookmarks", bookmark);
  }

  async createHighlight(highlight: LibraryHighlight): Promise<LibraryHighlight> {
    return this.database.insert("library_highlights", highlight);
  }

  async createNote(note: LibraryNote): Promise<LibraryNote> {
    return this.database.insert("library_notes", note);
  }

  async createAccessEvent(event: LibraryAccessEvent): Promise<LibraryAccessEvent> {
    return this.database.insert("library_access_events", event);
  }

  async appendAuditEvent(event: LibraryAuditEvent): Promise<void> {
    this.database.insert("library_audit_events", event);
  }
}
