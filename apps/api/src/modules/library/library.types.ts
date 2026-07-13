export type LibraryItemType =
  | "BOOK"
  | "MAGAZINE"
  | "ARTICLE"
  | "AUDIOBOOK"
  | "VIDEO"
  | "LOCALIZED_MEDIA";

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

export type LibraryPublicationLifecycleStatus =
  | "STOC_REAL"
  | "IN_LUCRU"
  | "PUBLICAT";

export type LibraryPublicationVisibility =
  | "PUBLIC"
  | "PRIVATE"
  | "INTERNAL_WORKING_PUBLICATION";

export type LibraryPublicationFormat =
  | "SOURCE"
  | "WORKING_FILE"
  | "FINAL_FILE"
  | "PDF"
  | "EPUB"
  | "MOBI"
  | "PRINT_READY_PDF"
  | "AUDIO"
  | "VIDEO"
  | "ACCESSIBLE";

export type LibraryViewMode = "GRID" | "LIST";

export type LibrarySortDirection = "ASC" | "DESC";

export type LibraryBulkActionType =
  | "CHANGE_STATUS"
  | "ASSIGN_COLLECTION"
  | "ASSIGN_SERIES"
  | "ADD_TAGS"
  | "EXPORT_METADATA"
  | "UPDATE_SELECTED_METADATA"
  | "ASSIGN_PROJECT"
  | "MARK_PUBLIC"
  | "MARK_PRIVATE"
  | "VALIDATE_RIGHTS_STATUS"
  | "GENERATE_REPORT";

export type LibraryAccessEventType =
  | "OPENED"
  | "DOWNLOADED"
  | "READING_SESSION_STARTED"
  | "READING_SESSION_ENDED";

export type LibraryAuditAction =
  | "LIBRARY_ITEM_ADDED"
  | "LIBRARY_PUBLICATION_CREATED"
  | "LIBRARY_METADATA_CHANGED"
  | "LIBRARY_STATUS_CHANGED"
  | "LIBRARY_VISIBILITY_CHANGED"
  | "LIBRARY_MANUSCRIPT_LINKED"
  | "LIBRARY_PROJECT_LINKED"
  | "LIBRARY_EDITION_CREATED"
  | "LIBRARY_VERSION_CREATED"
  | "LIBRARY_FILE_ADDED"
  | "LIBRARY_FILE_REPLACED"
  | "LIBRARY_BULK_ACTION"
  | "LIBRARY_PUBLICATION_PUBLISHED"
  | "LIBRARY_PUBLICATION_WITHDRAWN"
  | "LIBRARY_DUPLICATE_REVIEWED"
  | "LIBRARY_RIGHTS_STATUS_CHANGED"
  | "LIBRARY_VIEW_PREFERENCE_SAVED"
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

export interface LibraryPublicationContributor {
  name: string;
  role: string;
  userId?: string;
}

export interface LibraryPublicationRecord {
  id: string;
  organizationId: string;
  title: string;
  normalizedTitle: string;
  subtitle?: string;
  author: string;
  normalizedAuthor: string;
  contributors: LibraryPublicationContributor[];
  description?: string;
  publicationType: LibraryPublicationType;
  configuredPublicationType?: string;
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
  firstEdition?: string;
  firstPublicationYear?: number;
  originalPublisher?: string;
  sourceReference?: string;
  sourceAcquisition?: string;
  manuscriptId?: string;
  projectId?: string;
  activeWorkflowId?: string;
  translationRefs: string[];
  reviewRefs: string[];
  layoutRefs: string[];
  publishingRecordRefs: string[];
  rightsStatus?: string;
  license?: string;
  contractRefs: string[];
  sourceProvenance?: string;
  assetProvenance?: string;
  publicationRestrictions?: string[];
  availableFormats: LibraryPublicationFormat[];
  publishedChannels: string[];
  publicationDates: string[];
  distributionStatus?: string;
  associatedIdentifiers: string[];
  tags: string[];
  isbn?: string;
  sourceFileFingerprint?: string;
  restrictedMetadata?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface LibraryPublicationEdition {
  id: string;
  organizationId: string;
  publicationId: string;
  editionNumber: string;
  editionStatus: string;
  publicationDate?: string;
  revisionDate?: string;
  changeSummary?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, unknown>;
}

export interface LibraryPublicationVersion {
  id: string;
  organizationId: string;
  publicationId: string;
  editionId?: string;
  versionNumber: string;
  changeSummary?: string;
  immutableHistoricalVersion: true;
  createdBy: string;
  createdAt: string;
  metadata?: Record<string, unknown>;
}

export interface LibraryPublicationFile {
  id: string;
  organizationId: string;
  publicationId: string;
  editionId?: string;
  fileType: LibraryPublicationFormat;
  fileName: string;
  artifactRef?: string;
  checksum?: string;
  sourceFileFingerprint?: string;
  visibility: LibraryPublicationVisibility;
  restricted: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, unknown>;
}

export interface LibraryViewPreference {
  id: string;
  organizationId: string;
  userId: string;
  viewMode: LibraryViewMode;
  sortBy: "title" | "author" | "year" | "status" | "lastUpdate";
  sortDirection: LibrarySortDirection;
  persistentFilters: LibraryPublicationSearchInput;
  recentSearches: string[];
  savedSearches: Array<{ name: string; query: string; filters: LibraryPublicationSearchInput }>;
  updatedAt: string;
}

export interface LibraryPublicationPreview {
  publicationId: string;
  coverRef?: string;
  title: string;
  subtitle?: string;
  author: string;
  metadata: {
    publicationType: LibraryPublicationType;
    lifecycleStatus: LibraryPublicationLifecycleStatus;
    visibility: LibraryPublicationVisibility;
    language?: string;
    year?: number;
    formats: LibraryPublicationFormat[];
    associatedProjectId?: string;
  };
  tableOfContents: string[];
  selectedPages: string[];
  audioSampleRef?: string;
  videoSampleRef?: string;
  restrictedContentReturned: false;
}

export interface LibraryDuplicateCandidate {
  publicationId: string;
  comparedPublicationId: string;
  reasons: string[];
  score: number;
  automaticMerge: false;
  humanConfirmationRequired: true;
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
  publicationId?: string;
  entityType:
    | "library_item"
    | "library_publication"
    | "library_publication_edition"
    | "library_publication_version"
    | "library_publication_file"
    | "library_view_preference"
    | "reading_progress"
    | "bookmark"
    | "highlight"
    | "note"
    | "access_event"
    | "bulk_action"
    | "duplicate_review";
  entityId?: string;
  action: LibraryAuditAction;
  actorId: string;
  beforeState?: object;
  afterState?: object;
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

export interface CreateLibraryPublicationInput {
  title: string;
  subtitle?: string;
  author: string;
  contributors?: LibraryPublicationContributor[];
  description?: string;
  publicationType: LibraryPublicationType;
  configuredPublicationType?: string;
  editorialDomain?: string;
  language?: string;
  locale?: string;
  series?: string;
  collection?: string;
  volume?: string;
  lifecycleStatus?: LibraryPublicationLifecycleStatus;
  visibility?: LibraryPublicationVisibility;
  publicationYear?: number;
  originalTitle?: string;
  originalLanguage?: string;
  originalAuthor?: string;
  firstEdition?: string;
  firstPublicationYear?: number;
  originalPublisher?: string;
  sourceReference?: string;
  sourceAcquisition?: string;
  manuscriptId?: string;
  projectId?: string;
  activeWorkflowId?: string;
  translationRefs?: string[];
  reviewRefs?: string[];
  layoutRefs?: string[];
  publishingRecordRefs?: string[];
  rightsStatus?: string;
  license?: string;
  contractRefs?: string[];
  sourceProvenance?: string;
  assetProvenance?: string;
  publicationRestrictions?: string[];
  availableFormats?: LibraryPublicationFormat[];
  publishedChannels?: string[];
  publicationDates?: string[];
  distributionStatus?: string;
  associatedIdentifiers?: string[];
  tags?: string[];
  isbn?: string;
  sourceFileFingerprint?: string;
  restrictedMetadata?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

export interface LibraryPublicationSearchInput {
  query?: string;
  author?: string;
  language?: string;
  editorialDomain?: string;
  publicationType?: LibraryPublicationType;
  lifecycleStatus?: LibraryPublicationLifecycleStatus;
  publicationYear?: number;
  originalPublicationYear?: number;
  rightsStatus?: string;
  format?: LibraryPublicationFormat;
  series?: string;
  collection?: string;
  sortBy?: "title" | "author" | "year" | "status" | "lastUpdate";
  sortDirection?: LibrarySortDirection;
  viewMode?: LibraryViewMode;
}

export interface UpdateLibraryPublicationStatusInput {
  lifecycleStatus: LibraryPublicationLifecycleStatus;
  reason?: string;
}

export interface UpdateLibraryPublicationVisibilityInput {
  visibility: LibraryPublicationVisibility;
  reason?: string;
}

export interface CreateLibraryPublicationEditionInput {
  editionNumber: string;
  editionStatus?: string;
  publicationDate?: string;
  revisionDate?: string;
  changeSummary?: string;
  metadata?: Record<string, unknown>;
}

export interface CreateLibraryPublicationVersionInput {
  editionId?: string;
  versionNumber: string;
  changeSummary?: string;
  metadata?: Record<string, unknown>;
}

export interface AddLibraryPublicationFileInput {
  editionId?: string;
  fileType: LibraryPublicationFormat;
  fileName: string;
  artifactRef?: string;
  checksum?: string;
  sourceFileFingerprint?: string;
  visibility?: LibraryPublicationVisibility;
  restricted?: boolean;
  metadata?: Record<string, unknown>;
}

export interface LibraryBulkActionInput {
  publicationIds: string[];
  action: LibraryBulkActionType;
  lifecycleStatus?: LibraryPublicationLifecycleStatus;
  collection?: string;
  series?: string;
  tags?: string[];
  projectId?: string;
  visibility?: LibraryPublicationVisibility;
  metadata?: Record<string, unknown>;
}

export interface LibraryBulkActionResult {
  action: LibraryBulkActionType;
  affectedPublicationIds: string[];
  skippedPublicationIds: string[];
  permissionsRespected: true;
  subscriptionLimitsRespected: true;
  destructiveChanges: false;
}

export interface SaveLibraryViewPreferenceInput {
  viewMode: LibraryViewMode;
  sortBy?: "title" | "author" | "year" | "status" | "lastUpdate";
  sortDirection?: LibrarySortDirection;
  persistentFilters?: LibraryPublicationSearchInput;
  recentSearches?: string[];
  savedSearches?: Array<{ name: string; query: string; filters: LibraryPublicationSearchInput }>;
}

export interface LibraryRepository {
  listItemsForUser(organizationId: string, userId: string): Promise<LibraryItem[]>;
  createItem(item: LibraryItem): Promise<LibraryItem>;
  updateItem(item: LibraryItem): Promise<LibraryItem>;
  findItemByIdForUser(id: string, organizationId: string, userId: string): Promise<LibraryItem | null>;
  listPublications(organizationId: string): Promise<LibraryPublicationRecord[]>;
  createPublication(publication: LibraryPublicationRecord): Promise<LibraryPublicationRecord>;
  updatePublication(publication: LibraryPublicationRecord): Promise<LibraryPublicationRecord>;
  findPublicationById(id: string, organizationId: string): Promise<LibraryPublicationRecord | null>;
  createEdition(edition: LibraryPublicationEdition): Promise<LibraryPublicationEdition>;
  listEditions(publicationId: string, organizationId: string): Promise<LibraryPublicationEdition[]>;
  createVersion(version: LibraryPublicationVersion): Promise<LibraryPublicationVersion>;
  listVersions(publicationId: string, organizationId: string): Promise<LibraryPublicationVersion[]>;
  createPublicationFile(file: LibraryPublicationFile): Promise<LibraryPublicationFile>;
  listPublicationFiles(publicationId: string, organizationId: string): Promise<LibraryPublicationFile[]>;
  upsertViewPreference(preference: LibraryViewPreference): Promise<LibraryViewPreference>;
  findViewPreference(organizationId: string, userId: string): Promise<LibraryViewPreference | null>;
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
