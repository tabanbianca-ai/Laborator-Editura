import { apiGet, apiPost, type ApiResult } from "./api-client";

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

export interface ResearchAiPolicy {
  extractConcepts: true;
  mayModifyOriginalSources: false;
  summarizeSources: true;
  suggestRelations: true;
}

export interface ResearchSourceRecord {
  aiPolicy: ResearchAiPolicy;
  author?: string;
  citation?: string;
  createdAt: string;
  firstPublicationYear?: number;
  humanFinalAuthority: true;
  id: string;
  language: string;
  locale?: string;
  notes?: string;
  originalAuthor?: string;
  originalLanguage?: string;
  originalLocale?: string;
  authoringLanguage?: string;
  authoringLocale?: string;
  targetLanguage?: string;
  targetLocale?: string;
  publisher?: string;
  sourceType: ResearchSourceType;
  tags: string[];
  title: string;
  updatedAt: string;
  url?: string;
  visibility: ResearchVisibility;
}

export interface ResearchNoteRecord {
  content: string;
  createdAt: string;
  id: string;
  noteType: string;
  sourceId?: string;
  title?: string;
  visibility: ResearchVisibility;
}

export interface ResearchEntityRecord {
  aliases: string[];
  description?: string;
  entityType: string;
  id: string;
  language?: string;
  name: string;
  sourceIds: string[];
  tags: string[];
}

export interface ResearchRelationshipRecord {
  createdAt: string;
  description?: string;
  fromEntityId: string;
  id: string;
  relationshipType: string;
  sourceIds: string[];
  toEntityId: string;
}

export interface ResearchCollectionRecord {
  createdAt: string;
  description?: string;
  id: string;
  name: string;
  sharedEditorialCollection: boolean;
  thematicTags: string[];
  visibility: ResearchVisibility;
}

export interface ResearchSearchResult {
  collections: ResearchCollectionRecord[];
  entities: ResearchEntityRecord[];
  notes: ResearchNoteRecord[];
  relationships: ResearchRelationshipRecord[];
  sources: ResearchSourceRecord[];
}

export interface ResearchWorkspaceData {
  search: ResearchSearchResult | null;
  searchError: string | null;
  selectedSource: ResearchSourceRecord | null;
  selectedSourceError: string | null;
  sources: ResearchSourceRecord[];
  sourcesError: string | null;
}

export interface ResearchWorkspaceInput {
  language?: string;
  query?: string;
  sourceId?: string;
  sourceType?: string;
  tags?: string;
}

export interface CreateResearchSourceRequest {
  author?: string;
  citation?: string;
  firstPublicationYear?: number;
  language: string;
  locale?: string;
  notes?: string;
  originalLanguage?: string;
  originalLocale?: string;
  authoringLanguage?: string;
  authoringLocale?: string;
  targetLanguage?: string;
  targetLocale?: string;
  sourceType: ResearchSourceType;
  tags?: string[];
  title: string;
  visibility?: ResearchVisibility;
}

export async function getResearchWorkspaceData({
  language,
  query,
  sourceId,
  sourceType,
  tags
}: ResearchWorkspaceInput): Promise<ResearchWorkspaceData> {
  const [sourcesResult, searchResult] = await Promise.all([
    listResearchSources(),
    searchResearch({
      language,
      query,
      sourceType,
      tags
    })
  ]);
  const sources = sourcesResult.data ?? [];
  const fallbackSource = sources[0] ?? null;
  const selectedSourceResult = sourceId
    ? await getResearchSource(sourceId)
    : {
        data: fallbackSource,
        error: null
      };

  return {
    search: searchResult.data,
    searchError: searchResult.error,
    selectedSource: selectedSourceResult.data,
    selectedSourceError: selectedSourceResult.error,
    sources,
    sourcesError: sourcesResult.error
  };
}

export function createResearchSource(
  input: CreateResearchSourceRequest
): Promise<ApiResult<ResearchSourceRecord>> {
  return apiPost<ResearchSourceRecord, CreateResearchSourceRequest>("/research/sources", input);
}

function listResearchSources(): Promise<ApiResult<ResearchSourceRecord[]>> {
  return apiGet<ResearchSourceRecord[]>("/research/sources");
}

function getResearchSource(sourceId: string): Promise<ApiResult<ResearchSourceRecord>> {
  return apiGet<ResearchSourceRecord>(`/research/sources/${encodeURIComponent(sourceId)}`);
}

function searchResearch(input: {
  language?: string;
  query?: string;
  sourceType?: string;
  tags?: string;
}): Promise<ApiResult<ResearchSearchResult>> {
  const query = new URLSearchParams();

  if (input.query) {
    query.set("query", input.query);
  }

  if (input.language) {
    query.set("language", input.language);
  }

  if (input.sourceType) {
    query.set("sourceType", input.sourceType);
  }

  if (input.tags) {
    query.set("tags", input.tags);
  }

  const suffix = query.toString() ? `?${query.toString()}` : "";

  return apiGet<ResearchSearchResult>(`/research/search${suffix}`);
}
