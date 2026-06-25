import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import {
  normalizeLanguageLocale,
  validateIsoCompatibleLanguageTag,
  type LanguageLocaleMetadata
} from "@laborator/shared";
import { randomUUID } from "node:crypto";
import { DatabaseResearchRepository } from "./research.repository";
import {
  type AddResearchCollectionItemInput,
  type CreateResearchCollectionInput,
  type CreateResearchEntityInput,
  type CreateResearchNoteInput,
  type CreateResearchRelationshipInput,
  type CreateResearchSourceInput,
  type ResearchActor,
  type ResearchAuditAction,
  type ResearchCollection,
  type ResearchCollectionItem,
  type ResearchEntity,
  type ResearchNote,
  type ResearchRelationship,
  type ResearchSearchQuery,
  type ResearchSearchResult,
  type ResearchSource,
  type ResearchVisibility
} from "./research.types";

@Injectable()
export class ResearchService {
  constructor(private readonly repository: DatabaseResearchRepository) {}

  async createSource(actor: ResearchActor, input: CreateResearchSourceInput): Promise<ResearchSource> {
    this.validateActor(actor);

    if (!input.title || !input.language || !input.sourceType) {
      throw new BadRequestException("title, language, and sourceType are required.");
    }

    const sourceLanguage = this.normalizeIsoLanguage(input.language, input.locale);
    const originalLanguage = this.normalizeOptionalIsoLanguage(
      input.originalLanguage,
      input.originalLocale
    );
    const authoringLanguage = this.normalizeOptionalIsoLanguage(
      input.authoringLanguage,
      input.authoringLocale
    );
    const targetLanguage = this.normalizeOptionalIsoLanguage(
      input.targetLanguage,
      input.targetLocale
    );
    const now = new Date().toISOString();
    const source: ResearchSource = {
      id: randomUUID(),
      organizationId: actor.organizationId,
      title: input.title,
      subtitle: input.subtitle,
      author: input.author,
      originalAuthor: input.originalAuthor,
      language: sourceLanguage.language,
      locale: sourceLanguage.locale,
      originalLanguage: originalLanguage?.language,
      originalLocale: originalLanguage?.locale,
      authoringLanguage: authoringLanguage?.language,
      authoringLocale: authoringLanguage?.locale,
      targetLanguage: targetLanguage?.language,
      targetLocale: targetLanguage?.locale,
      firstPublicationYear: input.firstPublicationYear,
      sourceType: input.sourceType,
      publisher: input.publisher,
      isbn: input.isbn,
      url: input.url,
      citation: input.citation,
      tags: input.tags ?? [],
      notes: input.notes,
      visibility: input.visibility ?? "PRIVATE",
      ecosystemReferences: input.ecosystemReferences ?? [],
      aiPolicy: this.advisoryAiPolicy(),
      humanFinalAuthority: true,
      createdBy: actor.userId,
      createdAt: now,
      updatedAt: now
    };

    const created = await this.repository.createSource(source);
    await this.audit("RESEARCH_SOURCE_CREATED", actor, { sourceId: created.id }, undefined, created, false);

    return created;
  }

  async listSources(actor: ResearchActor): Promise<ResearchSource[]> {
    this.validateActor(actor);
    const sources = await this.repository.listSources(actor.organizationId);

    return sources.filter((source) => this.canReadVisibility(actor, source.visibility, source.createdBy));
  }

  async getSource(actor: ResearchActor, sourceId: string): Promise<ResearchSource> {
    const source = await this.requireSource(actor, sourceId);

    return source;
  }

  async createNote(actor: ResearchActor, input: CreateResearchNoteInput): Promise<ResearchNote> {
    this.validateActor(actor);

    if (!input.noteType || !input.content) {
      throw new BadRequestException("noteType and content are required.");
    }

    if (input.sourceId) {
      await this.requireSource(actor, input.sourceId);
    }

    const now = new Date().toISOString();
    const visibility = input.visibility ?? (input.noteType === "PRIVATE_NOTE" ? "PRIVATE" : "TEAM");
    const note: ResearchNote = {
      id: randomUUID(),
      organizationId: actor.organizationId,
      sourceId: input.sourceId,
      projectId: input.projectId,
      manuscriptId: input.manuscriptId,
      entityId: input.entityId,
      noteType: input.noteType,
      title: input.title,
      content: input.content,
      visibility,
      privateToCreator: visibility === "PRIVATE" || input.noteType === "PRIVATE_NOTE",
      ecosystemReferences: input.ecosystemReferences ?? [],
      createdBy: actor.userId,
      createdAt: now,
      updatedAt: now
    };

    const created = await this.repository.createNote(note);
    await this.audit("RESEARCH_NOTE_CREATED", actor, { noteId: created.id }, undefined, created, false);

    return created;
  }

  async createEntity(actor: ResearchActor, input: CreateResearchEntityInput): Promise<ResearchEntity> {
    this.validateActor(actor);

    if (!input.entityType || !input.name) {
      throw new BadRequestException("entityType and name are required.");
    }

    await this.ensureSourcesAccessible(actor, input.sourceIds ?? []);

    const now = new Date().toISOString();
    const entity: ResearchEntity = {
      id: randomUUID(),
      organizationId: actor.organizationId,
      entityType: input.entityType,
      name: input.name,
      description: input.description,
      language: input.language,
      aliases: input.aliases ?? [],
      tags: input.tags ?? [],
      sourceIds: input.sourceIds ?? [],
      ecosystemReferences: input.ecosystemReferences ?? [],
      aiSuggested: input.aiSuggested ?? false,
      humanFinalAuthority: true,
      createdBy: actor.userId,
      createdAt: now,
      updatedAt: now
    };

    const created = await this.repository.createEntity(entity);
    await this.audit("RESEARCH_ENTITY_CREATED", actor, { entityId: created.id }, undefined, created, created.aiSuggested);

    if (created.aiSuggested) {
      await this.audit("RESEARCH_AI_SUGGESTION_RECORDED", actor, { entityId: created.id }, undefined, created, true);
    }

    return created;
  }

  async createRelationship(
    actor: ResearchActor,
    input: CreateResearchRelationshipInput
  ): Promise<ResearchRelationship> {
    this.validateActor(actor);

    if (!input.fromEntityId || !input.toEntityId || !input.relationshipType) {
      throw new BadRequestException("fromEntityId, toEntityId, and relationshipType are required.");
    }

    await this.requireEntity(actor, input.fromEntityId);
    await this.requireEntity(actor, input.toEntityId);
    await this.ensureSourcesAccessible(actor, input.sourceIds ?? []);

    const relationship: ResearchRelationship = {
      id: randomUUID(),
      organizationId: actor.organizationId,
      fromEntityId: input.fromEntityId,
      toEntityId: input.toEntityId,
      relationshipType: input.relationshipType,
      description: input.description,
      sourceIds: input.sourceIds ?? [],
      aiSuggested: input.aiSuggested ?? false,
      humanFinalAuthority: true,
      createdBy: actor.userId,
      createdAt: new Date().toISOString()
    };

    const created = await this.repository.createRelationship(relationship);
    await this.audit(
      "RESEARCH_RELATIONSHIP_CREATED",
      actor,
      { relationshipId: created.id },
      undefined,
      created,
      created.aiSuggested
    );

    if (created.aiSuggested) {
      await this.audit(
        "RESEARCH_AI_SUGGESTION_RECORDED",
        actor,
        { relationshipId: created.id },
        undefined,
        created,
        true
      );
    }

    return created;
  }

  async createCollection(
    actor: ResearchActor,
    input: CreateResearchCollectionInput
  ): Promise<ResearchCollection> {
    this.validateActor(actor);

    if (!input.name) {
      throw new BadRequestException("collection name is required.");
    }

    const now = new Date().toISOString();
    const collection: ResearchCollection = {
      id: randomUUID(),
      organizationId: actor.organizationId,
      name: input.name,
      description: input.description,
      visibility: input.visibility ?? "PRIVATE",
      projectId: input.projectId,
      thematicTags: input.thematicTags ?? [],
      sharedEditorialCollection: input.sharedEditorialCollection ?? input.visibility === "TEAM",
      createdBy: actor.userId,
      createdAt: now,
      updatedAt: now
    };

    const created = await this.repository.createCollection(collection);
    await this.audit(
      "RESEARCH_COLLECTION_CREATED",
      actor,
      { collectionId: created.id },
      undefined,
      created,
      false
    );

    return created;
  }

  async addCollectionItem(
    actor: ResearchActor,
    collectionId: string,
    input: AddResearchCollectionItemInput
  ): Promise<ResearchCollectionItem> {
    this.validateActor(actor);
    const collection = await this.requireCollection(actor, collectionId);
    const now = new Date().toISOString();
    const item = await this.buildCollectionItem(actor, collection.id, input, now);
    const created = await this.repository.createCollectionItem(item);

    await this.audit(
      "RESEARCH_COLLECTION_ITEM_ADDED",
      actor,
      { collectionId: collection.id, collectionItemId: created.id },
      undefined,
      created,
      false
    );

    return created;
  }

  async search(actor: ResearchActor, query: ResearchSearchQuery): Promise<ResearchSearchResult> {
    this.validateActor(actor);

    const [sources, notes, entities, relationships, collections] = await Promise.all([
      this.repository.listSources(actor.organizationId),
      this.repository.listNotes(actor.organizationId),
      this.repository.listEntities(actor.organizationId),
      this.repository.listRelationships(actor.organizationId),
      this.repository.listCollections(actor.organizationId)
    ]);
    const normalizedQuery = this.normalizeText(query.query ?? "");
    const tags = this.normalizeTags(query.tags);

    const visibleSources = sources.filter((source) =>
      this.canReadVisibility(actor, source.visibility, source.createdBy) &&
      this.matchesSource(source, query, normalizedQuery, tags)
    );
    const visibleNotes = notes.filter((note) =>
      this.canReadVisibility(actor, note.visibility, note.createdBy) &&
      this.matchesNote(note, query, normalizedQuery, tags)
    );
    const visibleEntities = entities.filter((entity) =>
      this.matchesEntity(entity, query, normalizedQuery, tags)
    );
    const visibleRelationships = relationships.filter((relationship) =>
      this.matchesRelationship(relationship, query, normalizedQuery)
    );
    const visibleCollections = collections.filter((collection) =>
      this.canReadVisibility(actor, collection.visibility, collection.createdBy) &&
      this.matchesCollection(collection, query, normalizedQuery, tags)
    );

    return {
      sources: visibleSources,
      notes: visibleNotes,
      entities: visibleEntities,
      relationships: visibleRelationships,
      collections: visibleCollections
    };
  }

  private async buildCollectionItem(
    actor: ResearchActor,
    collectionId: string,
    input: AddResearchCollectionItemInput,
    createdAt: string
  ): Promise<ResearchCollectionItem> {
    if (!input.itemType) {
      throw new BadRequestException("collection itemType is required.");
    }

    if (input.itemType === "SOURCE") {
      if (!input.sourceId) {
        throw new BadRequestException("sourceId is required for SOURCE collection items.");
      }

      await this.requireSource(actor, input.sourceId);
    }

    if (input.itemType === "ENTITY") {
      if (!input.entityId) {
        throw new BadRequestException("entityId is required for ENTITY collection items.");
      }

      await this.requireEntity(actor, input.entityId);
    }

    return {
      id: randomUUID(),
      organizationId: actor.organizationId,
      collectionId,
      itemType: input.itemType,
      sourceId: input.sourceId,
      noteId: input.noteId,
      entityId: input.entityId,
      relationshipId: input.relationshipId,
      addedBy: actor.userId,
      createdAt
    };
  }

  private async requireSource(actor: ResearchActor, sourceId: string): Promise<ResearchSource> {
    this.validateActor(actor);
    const source = await this.repository.findSourceById(sourceId, actor.organizationId);

    if (!source || !this.canReadVisibility(actor, source.visibility, source.createdBy)) {
      throw new NotFoundException("Research source not found.");
    }

    return source;
  }

  private async requireEntity(actor: ResearchActor, entityId: string): Promise<ResearchEntity> {
    const entity = await this.repository.findEntityById(entityId, actor.organizationId);

    if (!entity) {
      throw new NotFoundException("Research entity not found.");
    }

    return entity;
  }

  private async requireCollection(actor: ResearchActor, collectionId: string): Promise<ResearchCollection> {
    const collection = await this.repository.findCollectionById(collectionId, actor.organizationId);

    if (!collection || !this.canReadVisibility(actor, collection.visibility, collection.createdBy)) {
      throw new NotFoundException("Research collection not found.");
    }

    return collection;
  }

  private async ensureSourcesAccessible(actor: ResearchActor, sourceIds: string[]): Promise<void> {
    for (const sourceId of sourceIds) {
      await this.requireSource(actor, sourceId);
    }
  }

  private canReadVisibility(actor: ResearchActor, visibility: ResearchVisibility, createdBy: string): boolean {
    if (visibility !== "PRIVATE") {
      return true;
    }

    return createdBy === actor.userId || this.hasRole(actor, "ADMIN") || this.hasRole(actor, "REVIEWER");
  }

  private matchesSource(
    source: ResearchSource,
    query: ResearchSearchQuery,
    normalizedQuery: string,
    tags: string[]
  ): boolean {
    return this.matchesQuery(
      normalizedQuery,
      source.title,
      source.subtitle,
      source.author,
      source.originalAuthor,
      source.citation,
      source.notes
    ) &&
      this.matchesOptional(query.author, source.author, source.originalAuthor) &&
      this.matchesOptional(
        query.language,
        source.language,
        source.locale,
        source.originalLanguage,
        source.originalLocale,
        source.authoringLanguage,
        source.authoringLocale,
        source.targetLanguage,
        source.targetLocale
      ) &&
      this.matchesOptional(query.sourceType, source.sourceType) &&
      this.matchesTags(tags, source.tags) &&
      this.matchesProject(query.projectId, source.ecosystemReferences);
  }

  private matchesNote(
    note: ResearchNote,
    query: ResearchSearchQuery,
    normalizedQuery: string,
    tags: string[]
  ): boolean {
    return this.matchesQuery(normalizedQuery, note.title, note.content, note.noteType) &&
      this.matchesOptional(query.projectId, note.projectId) &&
      this.matchesTags(tags, note.ecosystemReferences.map((reference) => reference.label ?? reference.entityId));
  }

  private matchesEntity(
    entity: ResearchEntity,
    query: ResearchSearchQuery,
    normalizedQuery: string,
    tags: string[]
  ): boolean {
    return this.matchesQuery(normalizedQuery, entity.name, entity.description, entity.entityType, ...entity.aliases) &&
      this.matchesOptional(query.language, entity.language) &&
      this.matchesOptional(query.entity, entity.name, entity.entityType, ...entity.aliases) &&
      this.matchesTags(tags, entity.tags) &&
      this.matchesProject(query.projectId, entity.ecosystemReferences);
  }

  private matchesRelationship(
    relationship: ResearchRelationship,
    query: ResearchSearchQuery,
    normalizedQuery: string
  ): boolean {
    return this.matchesQuery(normalizedQuery, relationship.relationshipType, relationship.description) &&
      this.matchesOptional(query.entity, relationship.fromEntityId, relationship.toEntityId);
  }

  private matchesCollection(
    collection: ResearchCollection,
    query: ResearchSearchQuery,
    normalizedQuery: string,
    tags: string[]
  ): boolean {
    return this.matchesQuery(normalizedQuery, collection.name, collection.description) &&
      this.matchesOptional(query.projectId, collection.projectId) &&
      this.matchesTags(tags, collection.thematicTags);
  }

  private matchesProject(projectId: string | undefined, references: { entityId: string; label?: string }[]): boolean {
    if (!projectId) {
      return true;
    }

    const normalizedProject = this.normalizeText(projectId);

    return references.some((reference) =>
      this.normalizeText(reference.entityId) === normalizedProject ||
      this.normalizeText(reference.label ?? "") === normalizedProject
    );
  }

  private matchesQuery(normalizedQuery: string, ...values: Array<string | undefined>): boolean {
    if (!normalizedQuery) {
      return true;
    }

    return values.some((value) => this.normalizeText(value ?? "").includes(normalizedQuery));
  }

  private matchesOptional(expected: string | undefined, ...values: Array<string | undefined>): boolean {
    if (!expected) {
      return true;
    }

    const normalizedExpected = this.normalizeText(expected);

    return values.some((value) => this.normalizeText(value ?? "").includes(normalizedExpected));
  }

  private matchesTags(expectedTags: string[], actualTags: string[]): boolean {
    if (expectedTags.length === 0) {
      return true;
    }

    const normalizedActual = new Set(actualTags.map((tag) => this.normalizeText(tag)));

    return expectedTags.every((tag) => normalizedActual.has(tag));
  }

  private normalizeTags(tags: string | string[] | undefined): string[] {
    if (!tags) {
      return [];
    }

    const values = Array.isArray(tags) ? tags : tags.split(",");

    return values.map((tag) => this.normalizeText(tag)).filter(Boolean);
  }

  private normalizeText(value: string): string {
    return value.trim().toLowerCase();
  }

  private advisoryAiPolicy() {
    return {
      summarizeSources: true,
      extractConcepts: true,
      suggestRelations: true,
      buildKnowledgeGraphs: true,
      suggestBibliography: true,
      mayModifyOriginalSources: false,
      mayDeleteValidatedResearch: false,
      mayApproveEditorialContent: false,
      mayAlterCitationsAutomatically: false
    } as const;
  }

  private hasRole(actor: ResearchActor, role: string): boolean {
    return (actor.roles ?? []).some((actorRole) => actorRole.toUpperCase() === role);
  }

  private validateActor(actor: ResearchActor): void {
    if (!actor.userId || !actor.organizationId) {
      throw new BadRequestException("Authenticated research context is required.");
    }
  }

  private normalizeIsoLanguage(language: string, locale?: string): LanguageLocaleMetadata {
    const validation = validateIsoCompatibleLanguageTag(language);

    if (!validation.valid) {
      throw new BadRequestException(validation.reason ?? "Language must be ISO-compatible.");
    }

    return normalizeLanguageLocale(language, locale);
  }

  private normalizeOptionalIsoLanguage(
    language: string | undefined,
    locale?: string
  ): LanguageLocaleMetadata | undefined {
    if (!language) {
      return undefined;
    }

    return this.normalizeIsoLanguage(language, locale);
  }

  private async audit(
    action: ResearchAuditAction,
    actor: ResearchActor,
    target: {
      sourceId?: string;
      noteId?: string;
      entityId?: string;
      relationshipId?: string;
      collectionId?: string;
      collectionItemId?: string;
    },
    beforeState: ResearchSource | ResearchNote | ResearchEntity | ResearchRelationship | ResearchCollection | undefined,
    afterState: ResearchSource | ResearchNote | ResearchEntity | ResearchRelationship | ResearchCollection | ResearchCollectionItem,
    aiSuggested: boolean
  ): Promise<void> {
    await this.repository.appendAuditEvent({
      id: randomUUID(),
      organizationId: actor.organizationId,
      ...target,
      action,
      actorId: actor.userId,
      humanFinalAuthority: true,
      aiSuggested,
      beforeState,
      afterState,
      createdAt: new Date().toISOString()
    });
  }
}
