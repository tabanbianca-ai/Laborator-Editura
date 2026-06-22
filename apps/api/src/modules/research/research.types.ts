export type ResearchSourceType =
  | "BOOK"
  | "PDF"
  | "ARTICLE"
  | "MANUSCRIPT"
  | "MAGAZINE"
  | "WEBSITE_REFERENCE"
  | "HISTORICAL_DOCUMENT"
  | "MULTIMEDIA_REFERENCE";

export type ResearchVisibility =
  | "PRIVATE"
  | "TEAM"
  | "ORGANIZATION"
  | "PUBLIC_REFERENCE";

export type ResearchNoteType =
  | "PRIVATE_NOTE"
  | "EDITORIAL_NOTE"
  | "TRANSLATION_NOTE"
  | "SEMANTIC_NOTE"
  | "TERMINOLOGY_NOTE"
  | "MANUSCRIPT_NOTE";

export type ResearchEntityType =
  | "CONCEPT"
  | "CHARACTER"
  | "PLACE"
  | "TIMELINE"
  | "HISTORICAL_EVENT"
  | "TERMINOLOGY_ENTRY"
  | "SPIRITUAL_CONCEPT"
  | "CUSTOM_ENTITY";

export type ResearchRelationshipType =
  | "REFERENCE"
  | "SYNONYM"
  | "INFLUENCE"
  | "CHRONOLOGY"
  | "PARENT_CHILD"
  | "RELATED_ENTITY";

export type ResearchEcosystemModule =
  | "AUTHOR_STUDIO"
  | "TRANSLATION"
  | "LEXICOGRAPHIC"
  | "TERMINOLOGY"
  | "SEMANTIC_FIDELITY"
  | "MULTIMEDIA_CREATION"
  | "MEDIA_LOCALIZATION"
  | "PUBLIC_PORTAL"
  | "COMMERCE";

export type ResearchCollectionItemType =
  | "SOURCE"
  | "NOTE"
  | "ENTITY"
  | "RELATIONSHIP";

export type ResearchAuditAction =
  | "RESEARCH_SOURCE_CREATED"
  | "RESEARCH_NOTE_CREATED"
  | "RESEARCH_ENTITY_CREATED"
  | "RESEARCH_RELATIONSHIP_CREATED"
  | "RESEARCH_COLLECTION_CREATED"
  | "RESEARCH_COLLECTION_ITEM_ADDED"
  | "RESEARCH_AI_SUGGESTION_RECORDED"
  | "RESEARCH_APPROVAL_RECORDED";

export interface ResearchActor {
  userId: string;
  organizationId: string;
  roles?: string[];
  permissions?: string[];
}

export interface ResearchEcosystemReference {
  module: ResearchEcosystemModule;
  entityId: string;
  label?: string;
}

export interface ResearchAiPolicy {
  summarizeSources: true;
  extractConcepts: true;
  suggestRelations: true;
  buildKnowledgeGraphs: true;
  suggestBibliography: true;
  mayModifyOriginalSources: false;
  mayDeleteValidatedResearch: false;
  mayApproveEditorialContent: false;
  mayAlterCitationsAutomatically: false;
}

export interface ResearchSource {
  id: string;
  organizationId: string;
  title: string;
  subtitle?: string;
  author?: string;
  originalAuthor?: string;
  language: string;
  originalLanguage?: string;
  firstPublicationYear?: number;
  sourceType: ResearchSourceType;
  publisher?: string;
  isbn?: string;
  url?: string;
  citation?: string;
  tags: string[];
  notes?: string;
  visibility: ResearchVisibility;
  ecosystemReferences: ResearchEcosystemReference[];
  aiPolicy: ResearchAiPolicy;
  humanFinalAuthority: true;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ResearchNote {
  id: string;
  organizationId: string;
  sourceId?: string;
  projectId?: string;
  manuscriptId?: string;
  entityId?: string;
  noteType: ResearchNoteType;
  title?: string;
  content: string;
  visibility: ResearchVisibility;
  privateToCreator: boolean;
  ecosystemReferences: ResearchEcosystemReference[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ResearchEntity {
  id: string;
  organizationId: string;
  entityType: ResearchEntityType;
  name: string;
  description?: string;
  language?: string;
  aliases: string[];
  tags: string[];
  sourceIds: string[];
  ecosystemReferences: ResearchEcosystemReference[];
  aiSuggested: boolean;
  humanFinalAuthority: true;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ResearchRelationship {
  id: string;
  organizationId: string;
  fromEntityId: string;
  toEntityId: string;
  relationshipType: ResearchRelationshipType;
  description?: string;
  sourceIds: string[];
  aiSuggested: boolean;
  humanFinalAuthority: true;
  createdBy: string;
  createdAt: string;
}

export interface ResearchCollection {
  id: string;
  organizationId: string;
  name: string;
  description?: string;
  visibility: ResearchVisibility;
  projectId?: string;
  thematicTags: string[];
  sharedEditorialCollection: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ResearchCollectionItem {
  id: string;
  organizationId: string;
  collectionId: string;
  itemType: ResearchCollectionItemType;
  sourceId?: string;
  noteId?: string;
  entityId?: string;
  relationshipId?: string;
  addedBy: string;
  createdAt: string;
}

export interface ResearchAuditEvent {
  id: string;
  organizationId: string;
  sourceId?: string;
  noteId?: string;
  entityId?: string;
  relationshipId?: string;
  collectionId?: string;
  collectionItemId?: string;
  action: ResearchAuditAction;
  actorId: string;
  humanFinalAuthority: true;
  aiSuggested: boolean;
  beforeState?: ResearchSource | ResearchNote | ResearchEntity | ResearchRelationship | ResearchCollection;
  afterState?:
    | ResearchSource
    | ResearchNote
    | ResearchEntity
    | ResearchRelationship
    | ResearchCollection
    | ResearchCollectionItem;
  createdAt: string;
}

export interface CreateResearchSourceInput {
  title: string;
  subtitle?: string;
  author?: string;
  originalAuthor?: string;
  language: string;
  originalLanguage?: string;
  firstPublicationYear?: number;
  sourceType: ResearchSourceType;
  publisher?: string;
  isbn?: string;
  url?: string;
  citation?: string;
  tags?: string[];
  notes?: string;
  visibility?: ResearchVisibility;
  ecosystemReferences?: ResearchEcosystemReference[];
}

export interface CreateResearchNoteInput {
  sourceId?: string;
  projectId?: string;
  manuscriptId?: string;
  entityId?: string;
  noteType: ResearchNoteType;
  title?: string;
  content: string;
  visibility?: ResearchVisibility;
  ecosystemReferences?: ResearchEcosystemReference[];
}

export interface CreateResearchEntityInput {
  entityType: ResearchEntityType;
  name: string;
  description?: string;
  language?: string;
  aliases?: string[];
  tags?: string[];
  sourceIds?: string[];
  ecosystemReferences?: ResearchEcosystemReference[];
  aiSuggested?: boolean;
}

export interface CreateResearchRelationshipInput {
  fromEntityId: string;
  toEntityId: string;
  relationshipType: ResearchRelationshipType;
  description?: string;
  sourceIds?: string[];
  aiSuggested?: boolean;
}

export interface CreateResearchCollectionInput {
  name: string;
  description?: string;
  visibility?: ResearchVisibility;
  projectId?: string;
  thematicTags?: string[];
  sharedEditorialCollection?: boolean;
}

export interface AddResearchCollectionItemInput {
  itemType: ResearchCollectionItemType;
  sourceId?: string;
  noteId?: string;
  entityId?: string;
  relationshipId?: string;
}

export interface ResearchSearchQuery {
  query?: string;
  author?: string;
  language?: string;
  tags?: string | string[];
  sourceType?: ResearchSourceType;
  entity?: string;
  projectId?: string;
}

export interface ResearchSearchResult {
  sources: ResearchSource[];
  notes: ResearchNote[];
  entities: ResearchEntity[];
  relationships: ResearchRelationship[];
  collections: ResearchCollection[];
}

export interface ResearchRepository {
  createSource(source: ResearchSource): Promise<ResearchSource>;
  listSources(organizationId: string): Promise<ResearchSource[]>;
  findSourceById(id: string, organizationId: string): Promise<ResearchSource | null>;
  createNote(note: ResearchNote): Promise<ResearchNote>;
  listNotes(organizationId: string): Promise<ResearchNote[]>;
  createEntity(entity: ResearchEntity): Promise<ResearchEntity>;
  listEntities(organizationId: string): Promise<ResearchEntity[]>;
  findEntityById(id: string, organizationId: string): Promise<ResearchEntity | null>;
  createRelationship(relationship: ResearchRelationship): Promise<ResearchRelationship>;
  listRelationships(organizationId: string): Promise<ResearchRelationship[]>;
  createCollection(collection: ResearchCollection): Promise<ResearchCollection>;
  listCollections(organizationId: string): Promise<ResearchCollection[]>;
  findCollectionById(id: string, organizationId: string): Promise<ResearchCollection | null>;
  createCollectionItem(item: ResearchCollectionItem): Promise<ResearchCollectionItem>;
  appendAuditEvent(event: ResearchAuditEvent): Promise<void>;
}
