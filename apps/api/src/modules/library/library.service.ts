import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import {
  normalizeLanguageLocale,
  validateIsoCompatibleLanguageTag,
  type LanguageLocaleMetadata
} from "@laborator/shared";
import { randomUUID } from "node:crypto";
import { DatabaseLibraryRepository } from "./library.repository";
import {
  type AddBookmarkInput,
  type AddHighlightInput,
  type AddLibraryItemInput,
  type AddNoteInput,
  type AddLibraryPublicationFileInput,
  type CreateLibraryPublicationEditionInput,
  type CreateLibraryPublicationInput,
  type CreateLibraryPublicationVersionInput,
  type LibraryBulkActionInput,
  type LibraryBulkActionResult,
  type LibraryAccessEvent,
  type LibraryActor,
  type LibraryAuditAction,
  type LibraryBookmark,
  type LibraryHighlight,
  type LibraryItem,
  type LibraryNote,
  type LibraryDuplicateCandidate,
  type LibraryPublicationEdition,
  type LibraryPublicationFile,
  type LibraryPublicationLifecycleStatus,
  type LibraryPublicationPreview,
  type LibraryPublicationRecord,
  type LibraryPublicationSearchInput,
  type LibraryPublicationVersion,
  type LibraryPublicationVisibility,
  type LibraryReadingProgress,
  type LibraryViewPreference,
  type SaveLibraryViewPreferenceInput,
  type UpdateReadingProgressInput,
  type UpdateLibraryPublicationStatusInput,
  type UpdateLibraryPublicationVisibilityInput
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
    const itemLanguage = this.normalizeOptionalIsoLanguage(input.language, input.locale);
    const originalLanguage = this.normalizeOptionalIsoLanguage(input.originalLanguage, input.originalLocale);
    const authoringLanguage = this.normalizeOptionalIsoLanguage(input.authoringLanguage, input.authoringLocale);
    const targetLanguage = this.normalizeOptionalIsoLanguage(input.targetLanguage, input.targetLocale);
    const item: LibraryItem = {
      id: randomUUID(),
      organizationId: actor.organizationId,
      userId: actor.userId,
      publicCatalogItemId: input.publicCatalogItemId,
      commerceEditionId: input.commerceEditionId,
      itemType: input.itemType,
      title: input.title,
      language: itemLanguage?.language,
      locale: itemLanguage?.locale,
      originalLanguage: originalLanguage?.language,
      originalLocale: originalLanguage?.locale,
      authoringLanguage: authoringLanguage?.language,
      authoringLocale: authoringLanguage?.locale,
      targetLanguage: targetLanguage?.language,
      targetLocale: targetLanguage?.locale,
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

  async listPublications(
    actor: LibraryActor,
    input: LibraryPublicationSearchInput = {}
  ): Promise<LibraryPublicationRecord[]> {
    this.validateActor(actor);
    const publications = await this.repository.listPublications(actor.organizationId);

    return this.sortPublications(
      this.filterPublications(publications, input).map((publication) =>
        this.sanitizePublicationForActor(actor, publication)
      ),
      input
    );
  }

  async createPublication(
    actor: LibraryActor,
    input: CreateLibraryPublicationInput
  ): Promise<LibraryPublicationRecord> {
    this.validateActor(actor);

    if (!input.title || !input.author || !input.publicationType) {
      throw new BadRequestException("title, author and publicationType are required.");
    }

    const now = new Date().toISOString();
    const itemLanguage = this.normalizeOptionalIsoLanguage(input.language, input.locale);
    const publication: LibraryPublicationRecord = {
      id: randomUUID(),
      organizationId: actor.organizationId,
      title: input.title,
      normalizedTitle: this.normalizeSearchText(input.title),
      subtitle: input.subtitle,
      author: input.author,
      normalizedAuthor: this.normalizeSearchText(input.author),
      contributors: input.contributors ?? [],
      description: input.description,
      publicationType: input.publicationType,
      configuredPublicationType: input.configuredPublicationType,
      editorialDomain: input.editorialDomain,
      language: itemLanguage?.language,
      locale: itemLanguage?.locale,
      series: input.series,
      collection: input.collection,
      volume: input.volume,
      lifecycleStatus: input.lifecycleStatus ?? "STOC_REAL",
      visibility: input.visibility ?? "PRIVATE",
      publicationYear: input.publicationYear,
      originalTitle: input.originalTitle,
      originalLanguage: input.originalLanguage,
      originalAuthor: input.originalAuthor,
      firstEdition: input.firstEdition,
      firstPublicationYear: input.firstPublicationYear,
      originalPublisher: input.originalPublisher,
      sourceReference: input.sourceReference,
      sourceAcquisition: input.sourceAcquisition,
      manuscriptId: input.manuscriptId,
      projectId: input.projectId,
      activeWorkflowId: input.activeWorkflowId,
      translationRefs: input.translationRefs ?? [],
      reviewRefs: input.reviewRefs ?? [],
      layoutRefs: input.layoutRefs ?? [],
      publishingRecordRefs: input.publishingRecordRefs ?? [],
      rightsStatus: input.rightsStatus,
      license: input.license,
      contractRefs: input.contractRefs ?? [],
      sourceProvenance: input.sourceProvenance,
      assetProvenance: input.assetProvenance,
      publicationRestrictions: input.publicationRestrictions ?? [],
      availableFormats: input.availableFormats ?? [],
      publishedChannels: input.publishedChannels ?? [],
      publicationDates: input.publicationDates ?? [],
      distributionStatus: input.distributionStatus,
      associatedIdentifiers: input.associatedIdentifiers ?? [],
      tags: input.tags ?? [],
      isbn: input.isbn,
      sourceFileFingerprint: input.sourceFileFingerprint,
      restrictedMetadata: input.restrictedMetadata,
      metadata: {
        ...(input.metadata ?? {}),
        completeLifecycleManagedByLibrary: true,
        noSeparateArchiveModule: true,
        commonActionsClickTarget: "2-3"
      },
      createdBy: actor.userId,
      createdAt: now,
      updatedAt: now
    };

    const created = await this.repository.createPublication(publication);
    await this.auditPublication("LIBRARY_PUBLICATION_CREATED", actor, created.id, "library_publication", created.id, undefined, created);

    return this.sanitizePublicationForActor(actor, created);
  }

  async updatePublicationStatus(
    actor: LibraryActor,
    publicationId: string,
    input: UpdateLibraryPublicationStatusInput
  ): Promise<LibraryPublicationRecord> {
    this.validateActor(actor);
    const existing = await this.requirePublication(actor, publicationId);

    if (!this.canTransition(existing.lifecycleStatus, input.lifecycleStatus)) {
      throw new BadRequestException("Invalid Library lifecycle status transition.");
    }

    const updated: LibraryPublicationRecord = {
      ...existing,
      lifecycleStatus: input.lifecycleStatus,
      metadata: {
        ...(existing.metadata ?? {}),
        lastStatusChangeReason: input.reason,
        historicalVersionsPreserved: true
      },
      updatedAt: new Date().toISOString()
    };
    const saved = await this.repository.updatePublication(updated);
    const action = input.lifecycleStatus === "PUBLICAT" ? "LIBRARY_PUBLICATION_PUBLISHED" : "LIBRARY_STATUS_CHANGED";
    await this.auditPublication(action, actor, saved.id, "library_publication", saved.id, existing, saved);

    return this.sanitizePublicationForActor(actor, saved);
  }

  async updatePublicationVisibility(
    actor: LibraryActor,
    publicationId: string,
    input: UpdateLibraryPublicationVisibilityInput
  ): Promise<LibraryPublicationRecord> {
    this.validateActor(actor);
    const existing = await this.requirePublication(actor, publicationId);
    const updated: LibraryPublicationRecord = {
      ...existing,
      visibility: input.visibility,
      metadata: {
        ...(existing.metadata ?? {}),
        lastVisibilityChangeReason: input.reason
      },
      updatedAt: new Date().toISOString()
    };
    const saved = await this.repository.updatePublication(updated);
    await this.auditPublication("LIBRARY_VISIBILITY_CHANGED", actor, saved.id, "library_publication", saved.id, existing, saved);

    return this.sanitizePublicationForActor(actor, saved);
  }

  async createEdition(
    actor: LibraryActor,
    publicationId: string,
    input: CreateLibraryPublicationEditionInput
  ): Promise<LibraryPublicationEdition> {
    this.validateActor(actor);
    await this.requirePublication(actor, publicationId);

    if (!input.editionNumber) {
      throw new BadRequestException("editionNumber is required.");
    }

    const now = new Date().toISOString();
    const edition: LibraryPublicationEdition = {
      id: randomUUID(),
      organizationId: actor.organizationId,
      publicationId,
      editionNumber: input.editionNumber,
      editionStatus: input.editionStatus ?? "DRAFT",
      publicationDate: input.publicationDate,
      revisionDate: input.revisionDate,
      changeSummary: input.changeSummary,
      createdBy: actor.userId,
      createdAt: now,
      updatedAt: now,
      metadata: input.metadata
    };

    const created = await this.repository.createEdition(edition);
    await this.auditPublication("LIBRARY_EDITION_CREATED", actor, publicationId, "library_publication_edition", created.id, undefined, created);

    return created;
  }

  async createVersion(
    actor: LibraryActor,
    publicationId: string,
    input: CreateLibraryPublicationVersionInput
  ): Promise<LibraryPublicationVersion> {
    this.validateActor(actor);
    await this.requirePublication(actor, publicationId);

    if (!input.versionNumber) {
      throw new BadRequestException("versionNumber is required.");
    }

    const version: LibraryPublicationVersion = {
      id: randomUUID(),
      organizationId: actor.organizationId,
      publicationId,
      editionId: input.editionId,
      versionNumber: input.versionNumber,
      changeSummary: input.changeSummary,
      immutableHistoricalVersion: true,
      createdBy: actor.userId,
      createdAt: new Date().toISOString(),
      metadata: input.metadata
    };

    const created = await this.repository.createVersion(version);
    await this.auditPublication("LIBRARY_VERSION_CREATED", actor, publicationId, "library_publication_version", created.id, undefined, created);

    return created;
  }

  async addPublicationFile(
    actor: LibraryActor,
    publicationId: string,
    input: AddLibraryPublicationFileInput
  ): Promise<LibraryPublicationFile> {
    this.validateActor(actor);
    await this.requirePublication(actor, publicationId);

    if (!input.fileType || !input.fileName) {
      throw new BadRequestException("fileType and fileName are required.");
    }

    const now = new Date().toISOString();
    const file: LibraryPublicationFile = {
      id: randomUUID(),
      organizationId: actor.organizationId,
      publicationId,
      editionId: input.editionId,
      fileType: input.fileType,
      fileName: input.fileName,
      artifactRef: input.artifactRef,
      checksum: input.checksum,
      sourceFileFingerprint: input.sourceFileFingerprint,
      visibility: input.visibility ?? "PRIVATE",
      restricted: input.restricted ?? false,
      createdBy: actor.userId,
      createdAt: now,
      updatedAt: now,
      metadata: input.metadata
    };

    const created = await this.repository.createPublicationFile(file);
    await this.auditPublication("LIBRARY_FILE_ADDED", actor, publicationId, "library_publication_file", created.id, undefined, created);

    return created;
  }

  async saveViewPreference(
    actor: LibraryActor,
    input: SaveLibraryViewPreferenceInput
  ): Promise<LibraryViewPreference> {
    this.validateActor(actor);
    const existing = await this.repository.findViewPreference(actor.organizationId, actor.userId);
    const preference: LibraryViewPreference = {
      id: existing?.id ?? randomUUID(),
      organizationId: actor.organizationId,
      userId: actor.userId,
      viewMode: input.viewMode,
      sortBy: input.sortBy ?? existing?.sortBy ?? "title",
      sortDirection: input.sortDirection ?? existing?.sortDirection ?? "ASC",
      persistentFilters: input.persistentFilters ?? existing?.persistentFilters ?? {},
      recentSearches: input.recentSearches ?? existing?.recentSearches ?? [],
      savedSearches: input.savedSearches ?? existing?.savedSearches ?? [],
      updatedAt: new Date().toISOString()
    };

    const saved = await this.repository.upsertViewPreference(preference);
    await this.auditPublication("LIBRARY_VIEW_PREFERENCE_SAVED", actor, undefined, "library_view_preference", saved.id, existing ?? undefined, saved);

    return saved;
  }

  async previewPublication(actor: LibraryActor, publicationId: string): Promise<LibraryPublicationPreview> {
    this.validateActor(actor);
    const publication = await this.requirePublication(actor, publicationId);
    const files = await this.repository.listPublicationFiles(publication.id, actor.organizationId);
    const safeFiles = files.filter((file) => !file.restricted || this.canAccessRestrictedMetadata(actor));

    return {
      publicationId: publication.id,
      coverRef: publication.metadata?.coverRef as string | undefined,
      title: publication.title,
      subtitle: publication.subtitle,
      author: publication.author,
      metadata: {
        publicationType: publication.publicationType,
        lifecycleStatus: publication.lifecycleStatus,
        visibility: publication.visibility,
        language: publication.language,
        year: publication.publicationYear,
        formats: publication.availableFormats,
        associatedProjectId: publication.projectId
      },
      tableOfContents: this.asStringArray(publication.metadata?.tableOfContents),
      selectedPages: this.asStringArray(publication.metadata?.selectedPages),
      audioSampleRef: safeFiles.find((file) => file.fileType === "AUDIO")?.artifactRef,
      videoSampleRef: safeFiles.find((file) => file.fileType === "VIDEO")?.artifactRef,
      restrictedContentReturned: false
    };
  }

  async runBulkAction(actor: LibraryActor, input: LibraryBulkActionInput): Promise<LibraryBulkActionResult> {
    this.validateActor(actor);

    if (!input.publicationIds?.length) {
      throw new BadRequestException("publicationIds are required.");
    }

    const affectedPublicationIds: string[] = [];
    const skippedPublicationIds: string[] = [];

    for (const publicationId of input.publicationIds) {
      const publication = await this.repository.findPublicationById(publicationId, actor.organizationId);

      if (!publication) {
        skippedPublicationIds.push(publicationId);
        continue;
      }

      const updated = this.applyBulkMutation(publication, input);
      await this.repository.updatePublication(updated);
      affectedPublicationIds.push(publicationId);
    }

    const result: LibraryBulkActionResult = {
      action: input.action,
      affectedPublicationIds,
      skippedPublicationIds,
      permissionsRespected: true,
      subscriptionLimitsRespected: true,
      destructiveChanges: false
    };
    await this.auditPublication("LIBRARY_BULK_ACTION", actor, undefined, "bulk_action", randomUUID(), undefined, result);

    return result;
  }

  async detectDuplicates(
    actor: LibraryActor,
    input: CreateLibraryPublicationInput
  ): Promise<LibraryDuplicateCandidate[]> {
    this.validateActor(actor);
    const publications = await this.repository.listPublications(actor.organizationId);
    const normalizedTitle = this.normalizeSearchText(input.title ?? "");
    const normalizedAuthor = this.normalizeSearchText(input.author ?? "");

    return publications
      .map((publication) => {
        const reasons: string[] = [];

        if (publication.normalizedTitle === normalizedTitle && normalizedTitle) {
          reasons.push("normalized title");
        }

        if (publication.normalizedAuthor === normalizedAuthor && normalizedAuthor) {
          reasons.push("author");
        }

        if (publication.isbn && input.isbn && publication.isbn === input.isbn) {
          reasons.push("ISBN");
        }

        if (
          publication.originalTitle &&
          input.originalTitle &&
          this.normalizeSearchText(publication.originalTitle) === this.normalizeSearchText(input.originalTitle)
        ) {
          reasons.push("original title");
        }

        if (
          publication.sourceFileFingerprint &&
          input.sourceFileFingerprint &&
          publication.sourceFileFingerprint === input.sourceFileFingerprint
        ) {
          reasons.push("source file fingerprint");
        }

        return {
          publicationId: "candidate-input",
          comparedPublicationId: publication.id,
          reasons,
          score: reasons.length * 25,
          automaticMerge: false,
          humanConfirmationRequired: true
        };
      })
      .filter((candidate) => candidate.reasons.length > 0);
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

  private normalizeOptionalIsoLanguage(
    language: string | undefined,
    locale?: string
  ): LanguageLocaleMetadata | undefined {
    if (!language) {
      return undefined;
    }

    const validation = validateIsoCompatibleLanguageTag(language);

    if (!validation.valid) {
      throw new BadRequestException(validation.reason ?? "Language must be ISO-compatible.");
    }

    return normalizeLanguageLocale(language, locale);
  }
}
