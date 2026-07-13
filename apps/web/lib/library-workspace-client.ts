import { apiDelete, apiGet, apiPost, type ApiResult } from "./api-client";

export type LibraryItemType =
  | "BOOK"
  | "MAGAZINE"
  | "ARTICLE"
  | "AUDIOBOOK"
  | "VIDEO"
  | "LOCALIZED_MEDIA";

export type LibraryPublicationLifecycleStatus = "STOC_REAL" | "IN_LUCRU" | "PUBLICAT";

export type LibraryPublicationVisibility = "PUBLIC" | "PRIVATE" | "INTERNAL_WORKING_PUBLICATION";

export type LibraryPublicationType =
  | "BOOK"
  | "CHILDRENS_BOOK"
  | "MAGAZINE"
  | "POETRY"
  | "DICTIONARY"
  | "COURSE"
  | "AUDIOBOOK"
  | "VIDEO"
  | "OTHER_CONFIGURED";

export type LibraryPublicationFormat =
  | "PDF"
  | "EPUB"
  | "MOBI"
  | "PRINT_READY_PDF"
  | "AUDIO"
  | "VIDEO"
  | "ACCESSIBLE"
  | "SOURCE"
  | "WORKING_FILE"
  | "FINAL_FILE";

export interface ReaderAccessMetadata {
  downloadableFormats?: string[];
  onlineReadingAvailable?: boolean;
  readerUrl?: string;
  sourceLabel?: string;
}

export interface LibraryItemMetadata {
  currentChapter?: string;
  currentSection?: string;
  progressPercent?: number;
  readerAccess?: ReaderAccessMetadata;
}

export interface LibraryItemRecord {
  commerceEditionId?: string;
  createdAt: string;
  favorite: boolean;
  id: string;
  itemType: LibraryItemType;
  language?: string;
  locale?: string;
  originalLanguage?: string;
  originalLocale?: string;
  authoringLanguage?: string;
  authoringLocale?: string;
  targetLanguage?: string;
  targetLocale?: string;
  lastAccessedAt?: string;
  metadata?: LibraryItemMetadata;
  publicCatalogItemId?: string;
  savedAt: string;
  sourceReference?: string;
  title: string;
  updatedAt: string;
}

export interface LibraryPublicationRecord {
  id: string;
  title: string;
  subtitle?: string;
  author: string;
  contributors: Array<{ name: string; role: string; userId?: string }>;
  description?: string;
  publicationType: LibraryPublicationType;
  editorialDomain?: string;
  language?: string;
  locale?: string;
  series?: string;
  collection?: string;
  volume?: string;
  lifecycleStatus: LibraryPublicationLifecycleStatus;
  visibility: LibraryPublicationVisibility;
  publicationYear?: number;
  originalTitle?: string;
  originalLanguage?: string;
  originalAuthor?: string;
  firstPublicationYear?: number;
  originalPublisher?: string;
  sourceReference?: string;
  manuscriptId?: string;
  projectId?: string;
  activeWorkflowId?: string;
  rightsStatus?: string;
  license?: string;
  availableFormats: LibraryPublicationFormat[];
  publishedChannels: string[];
  distributionStatus?: string;
  associatedIdentifiers: string[];
  tags: string[];
  isbn?: string;
  updatedAt: string;
  metadata?: {
    coverRef?: string;
    completeLifecycleManagedByLibrary?: boolean;
    noSeparateArchiveModule?: boolean;
    [key: string]: unknown;
  };
}

export interface LibraryViewPreferenceRecord {
  viewMode: "GRID" | "LIST";
  sortBy: "title" | "author" | "year" | "status" | "lastUpdate";
  sortDirection: "ASC" | "DESC";
  persistentFilters: Record<string, unknown>;
  recentSearches: string[];
  savedSearches: Array<{ name: string; query: string; filters: Record<string, unknown> }>;
}

export interface LibraryReadingProgressRecord {
  currentChapter?: string;
  currentSection?: string;
  id: string;
  libraryItemId: string;
  position?: string;
  progressPercent: number;
  updatedAt: string;
}

export interface LibraryBookmarkRecord {
  chapter?: string;
  createdAt: string;
  id: string;
  label?: string;
  libraryItemId: string;
  position?: string;
  section?: string;
}

export interface LibraryHighlightRecord {
  chapter?: string;
  color?: string;
  createdAt: string;
  id: string;
  libraryItemId: string;
  note?: string;
  position?: string;
  section?: string;
  text: string;
}

export interface LibraryNoteRecord {
  chapter?: string;
  content: string;
  createdAt: string;
  id: string;
  libraryItemId: string;
  position?: string;
  section?: string;
  updatedAt: string;
}

export interface LibraryWorkspaceData {
  items: LibraryItemRecord[];
  itemsError: string | null;
  publications: LibraryPublicationRecord[];
  publicationsError: string | null;
  selectedPublication: LibraryPublicationRecord | null;
  selectedItem: LibraryItemRecord | null;
  viewPreference: LibraryViewPreferenceRecord;
}

export interface LibraryWorkspaceInput {
  itemId?: string;
  publicationId?: string;
}

export async function getLibraryWorkspaceData({
  itemId,
  publicationId
}: LibraryWorkspaceInput): Promise<LibraryWorkspaceData> {
  const itemsResult = await listLibraryItems();
  const publicationsResult = await listLibraryPublications();
  const items = itemsResult.data ?? [];
  const publications = publicationsResult.data ?? [];
  const selectedItem = itemId
    ? items.find((item) => item.id === itemId) ?? null
    : items[0] ?? null;
  const selectedPublication = publicationId
    ? publications.find((publication) => publication.id === publicationId) ?? null
    : publications[0] ?? null;

  return {
    items,
    itemsError: itemsResult.error,
    publications,
    publicationsError: publicationsResult.error,
    selectedPublication,
    selectedItem,
    viewPreference: {
      viewMode: "GRID",
      sortBy: "title",
      sortDirection: "ASC",
      persistentFilters: {},
      recentSearches: [],
      savedSearches: []
    }
  };
}

export function updateReadingProgress(input: {
  currentChapter?: string;
  currentSection?: string;
  itemId: string;
  position?: string;
  progressPercent?: number;
}): Promise<ApiResult<LibraryReadingProgressRecord>> {
  return apiPost<LibraryReadingProgressRecord, Omit<typeof input, "itemId">>(
    `/library/items/${encodeURIComponent(input.itemId)}/progress`,
    {
      currentChapter: input.currentChapter,
      currentSection: input.currentSection,
      position: input.position,
      progressPercent: input.progressPercent
    }
  );
}

export function addLibraryBookmark(input: {
  chapter?: string;
  itemId: string;
  label?: string;
  position?: string;
  section?: string;
}): Promise<ApiResult<LibraryBookmarkRecord>> {
  return apiPost<LibraryBookmarkRecord, Omit<typeof input, "itemId">>(
    `/library/items/${encodeURIComponent(input.itemId)}/bookmarks`,
    {
      chapter: input.chapter,
      label: input.label,
      position: input.position,
      section: input.section
    }
  );
}

export function addLibraryHighlight(input: {
  chapter?: string;
  color?: string;
  itemId: string;
  note?: string;
  position?: string;
  section?: string;
  text: string;
}): Promise<ApiResult<LibraryHighlightRecord>> {
  return apiPost<LibraryHighlightRecord, Omit<typeof input, "itemId">>(
    `/library/items/${encodeURIComponent(input.itemId)}/highlights`,
    {
      chapter: input.chapter,
      color: input.color,
      note: input.note,
      position: input.position,
      section: input.section,
      text: input.text
    }
  );
}

export function addLibraryNote(input: {
  chapter?: string;
  content: string;
  itemId: string;
  position?: string;
  section?: string;
}): Promise<ApiResult<LibraryNoteRecord>> {
  return apiPost<LibraryNoteRecord, Omit<typeof input, "itemId">>(
    `/library/items/${encodeURIComponent(input.itemId)}/notes`,
    {
      chapter: input.chapter,
      content: input.content,
      position: input.position,
      section: input.section
    }
  );
}

export function favoriteLibraryItem(itemId: string): Promise<ApiResult<LibraryItemRecord>> {
  return apiPost<LibraryItemRecord, Record<string, never>>(
    `/library/items/${encodeURIComponent(itemId)}/favorite`,
    {}
  );
}

export function unfavoriteLibraryItem(itemId: string): Promise<ApiResult<LibraryItemRecord>> {
  return apiDelete<LibraryItemRecord>(`/library/items/${encodeURIComponent(itemId)}/favorite`);
}

function listLibraryItems(): Promise<ApiResult<LibraryItemRecord[]>> {
  return apiGet<LibraryItemRecord[]>("/library");
}

function listLibraryPublications(): Promise<ApiResult<LibraryPublicationRecord[]>> {
  return apiPost<LibraryPublicationRecord[], Record<string, never>>("/library/publications/search", {});
}
