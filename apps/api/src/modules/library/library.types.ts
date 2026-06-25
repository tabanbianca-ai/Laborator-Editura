export type LibraryItemType =
  | "BOOK"
  | "MAGAZINE"
  | "ARTICLE"
  | "AUDIOBOOK"
  | "VIDEO"
  | "LOCALIZED_MEDIA";

export type LibraryAccessEventType =
  | "OPENED"
  | "DOWNLOADED"
  | "READING_SESSION_STARTED"
  | "READING_SESSION_ENDED";

export type LibraryAuditAction =
  | "LIBRARY_ITEM_ADDED"
  | "READING_PROGRESS_UPDATED"
  | "BOOKMARK_ADDED"
  | "HIGHLIGHT_ADDED"
  | "NOTE_ADDED"
  | "FAVORITE_ADDED"
  | "FAVORITE_REMOVED"
  | "ACCESS_EVENT_RECORDED";

export interface LibraryActor {
  userId: string;
  organizationId: string;
  roles?: string[];
  permissions?: string[];
}

export interface LibraryItem {
  id: string;
  organizationId: string;
  userId: string;
  publicCatalogItemId?: string;
  commerceEditionId?: string;
  itemType: LibraryItemType;
  title: string;
  language?: string;
  locale?: string;
  originalLanguage?: string;
  originalLocale?: string;
  authoringLanguage?: string;
  authoringLocale?: string;
  targetLanguage?: string;
  targetLocale?: string;
  sourceReference?: string;
  favorite: boolean;
  savedAt: string;
  lastAccessedAt?: string;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, unknown>;
}

export interface LibraryReadingProgress {
  id: string;
  organizationId: string;
  userId: string;
  libraryItemId: string;
  progressPercent: number;
  currentChapter?: string;
  currentSection?: string;
  position?: string;
  readingSessionId?: string;
  updatedAt: string;
}

export interface LibraryBookmark {
  id: string;
  organizationId: string;
  userId: string;
  libraryItemId: string;
  chapter?: string;
  section?: string;
  position?: string;
  label?: string;
  createdAt: string;
}

export interface LibraryHighlight {
  id: string;
  organizationId: string;
  userId: string;
  libraryItemId: string;
  text: string;
  color?: string;
  chapter?: string;
  section?: string;
  position?: string;
  note?: string;
  createdAt: string;
}

export interface LibraryNote {
  id: string;
  organizationId: string;
  userId: string;
  libraryItemId: string;
  content: string;
  chapter?: string;
  section?: string;
  position?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LibraryAccessEvent {
  id: string;
  organizationId: string;
  userId: string;
  libraryItemId: string;
  eventType: LibraryAccessEventType;
  readingSessionId?: string;
  artifactRef?: string;
  occurredAt: string;
  metadata?: Record<string, unknown>;
}

export interface LibraryAuditEvent {
  id: string;
  organizationId: string;
  userId: string;
  libraryItemId?: string;
  entityType: "library_item" | "reading_progress" | "bookmark" | "highlight" | "note" | "access_event";
  entityId?: string;
  action: LibraryAuditAction;
  actorId: string;
  beforeState?: LibraryItem | LibraryReadingProgress;
  afterState?: LibraryItem | LibraryReadingProgress | LibraryBookmark | LibraryHighlight | LibraryNote | LibraryAccessEvent;
  createdAt: string;
}

export interface AddLibraryItemInput {
  publicCatalogItemId?: string;
  commerceEditionId?: string;
  itemType: LibraryItemType;
  title: string;
  language?: string;
  locale?: string;
  originalLanguage?: string;
  originalLocale?: string;
  authoringLanguage?: string;
  authoringLocale?: string;
  targetLanguage?: string;
  targetLocale?: string;
  sourceReference?: string;
  metadata?: Record<string, unknown>;
}

export interface UpdateReadingProgressInput {
  progressPercent?: number;
  currentChapter?: string;
  currentSection?: string;
  position?: string;
  readingSessionId?: string;
}

export interface AddBookmarkInput {
  chapter?: string;
  section?: string;
  position?: string;
  label?: string;
}

export interface AddHighlightInput {
  text: string;
  color?: string;
  chapter?: string;
  section?: string;
  position?: string;
  note?: string;
}

export interface AddNoteInput {
  content: string;
  chapter?: string;
  section?: string;
  position?: string;
}

export interface LibraryRepository {
  listItemsForUser(organizationId: string, userId: string): Promise<LibraryItem[]>;
  createItem(item: LibraryItem): Promise<LibraryItem>;
  updateItem(item: LibraryItem): Promise<LibraryItem>;
  findItemByIdForUser(id: string, organizationId: string, userId: string): Promise<LibraryItem | null>;
  upsertProgress(progress: LibraryReadingProgress): Promise<LibraryReadingProgress>;
  findProgressForItem(
    libraryItemId: string,
    organizationId: string,
    userId: string
  ): Promise<LibraryReadingProgress | null>;
  createBookmark(bookmark: LibraryBookmark): Promise<LibraryBookmark>;
  createHighlight(highlight: LibraryHighlight): Promise<LibraryHighlight>;
  createNote(note: LibraryNote): Promise<LibraryNote>;
  createAccessEvent(event: LibraryAccessEvent): Promise<LibraryAccessEvent>;
  appendAuditEvent(event: LibraryAuditEvent): Promise<void>;
}
