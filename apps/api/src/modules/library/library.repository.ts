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
  type LibraryPublicationEdition,
  type LibraryPublicationFile,
  type LibraryPublicationRecord,
  type LibraryPublicationVersion,
  type LibraryReadingProgress,
  type LibraryRepository,
  type LibraryViewPreference
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

  async listPublications(organizationId: string): Promise<LibraryPublicationRecord[]> {
    return this.database.selectForTenant<LibraryPublicationRecord>("library_publications", organizationId);
  }

  async createPublication(publication: LibraryPublicationRecord): Promise<LibraryPublicationRecord> {
    return this.database.insert("library_publications", publication);
  }

  async updatePublication(publication: LibraryPublicationRecord): Promise<LibraryPublicationRecord> {
    return this.database.upsert("library_publications", publication);
  }

  async findPublicationById(id: string, organizationId: string): Promise<LibraryPublicationRecord | null> {
    return this.database.findByIdForTenant<LibraryPublicationRecord>("library_publications", id, organizationId);
  }

  async createEdition(edition: LibraryPublicationEdition): Promise<LibraryPublicationEdition> {
    return this.database.insert("library_publication_editions", edition);
  }

  async listEditions(publicationId: string, organizationId: string): Promise<LibraryPublicationEdition[]> {
    return this.database.selectForTenant<LibraryPublicationEdition>(
      "library_publication_editions",
      organizationId,
      (edition) => edition.publicationId === publicationId
    );
  }

  async createVersion(version: LibraryPublicationVersion): Promise<LibraryPublicationVersion> {
    return this.database.insert("library_publication_versions", version);
  }

  async listVersions(publicationId: string, organizationId: string): Promise<LibraryPublicationVersion[]> {
    return this.database.selectForTenant<LibraryPublicationVersion>(
      "library_publication_versions",
      organizationId,
      (version) => version.publicationId === publicationId
    );
  }

  async createPublicationFile(file: LibraryPublicationFile): Promise<LibraryPublicationFile> {
    return this.database.insert("library_publication_files", file);
  }

  async listPublicationFiles(publicationId: string, organizationId: string): Promise<LibraryPublicationFile[]> {
    return this.database.selectForTenant<LibraryPublicationFile>(
      "library_publication_files",
      organizationId,
      (file) => file.publicationId === publicationId
    );
  }

  async upsertViewPreference(preference: LibraryViewPreference): Promise<LibraryViewPreference> {
    return this.database.upsert("library_view_preferences", preference);
  }

  async findViewPreference(organizationId: string, userId: string): Promise<LibraryViewPreference | null> {
    return this.database.selectForTenant<LibraryViewPreference>(
      "library_view_preferences",
      organizationId,
      (preference) => preference.userId === userId
    )[0] ?? null;
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
