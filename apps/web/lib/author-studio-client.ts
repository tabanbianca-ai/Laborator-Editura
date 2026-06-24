import { apiGet, apiPost, type ApiResult } from "./api-client";

export type AuthorManuscriptType =
  | "BOOK"
  | "ARTICLE"
  | "MAGAZINE_ARTICLE"
  | "CHILDREN_BOOK"
  | "SCRIPT";

export type AuthorManuscriptStatus =
  | "DRAFT"
  | "IN_REVISION"
  | "SUBMITTED"
  | "IN_EDITORIAL_REVIEW"
  | "ARCHIVED";

export type AuthorSectionType =
  | "CHAPTER"
  | "SECTION"
  | "SCENE"
  | "SYNOPSIS"
  | "OUTLINE";

export interface AuthorManuscript {
  aiSuggestionsAdvisoryOnly: true;
  archivedAt?: string;
  authorAttribution: {
    authorId: string;
    retained: true;
  };
  authorId: string;
  createdAt: string;
  documentId?: string;
  genre?: string;
  humanEditorialApprovalRequired: true;
  id: string;
  language: string;
  manuscriptType: AuthorManuscriptType;
  organizationId: string;
  outline?: string;
  projectId?: string;
  publicExposure: false;
  sourceManuscriptId?: string;
  status: AuthorManuscriptStatus;
  stylePreferences?: string[];
  submittedAt?: string;
  subtitle?: string;
  synopsis?: string;
  title: string;
  translatorAttribution?: {
    originalAuthorAttributionPreserved: true;
    translatorId?: string;
    translatorName?: string;
    visibleInEditorialRecords: true;
  };
  updatedAt: string;
}

export interface AuthorManuscriptSection {
  createdAt: string;
  id: string;
  manuscriptId: string;
  notes?: string;
  orderIndex: number;
  organizationId: string;
  outline?: string;
  parentSectionId?: string;
  sectionType: AuthorSectionType;
  synopsis?: string;
  title: string;
  updatedAt: string;
}

export interface AuthorDraft {
  aiSuggestionApplied: false;
  autosave: boolean;
  autosaveMetadata?: {
    savedAt: string;
    source: "MANUAL_SAVE" | "AUTOSAVE";
  };
  characterCount: number;
  content: string;
  createdAt: string;
  createdBy: string;
  id: string;
  manuscriptId: string;
  organizationId: string;
  sectionId: string;
  version: number;
  wordCount: number;
}

export interface CreateAuthorManuscriptInput {
  genre?: string;
  language: string;
  manuscriptType: AuthorManuscriptType;
  outline?: string;
  sourceManuscriptId?: string;
  subtitle?: string;
  synopsis?: string;
  title: string;
  translatorName?: string;
}

export interface CreateAuthorSectionInput {
  notes?: string;
  orderIndex?: number;
  outline?: string;
  sectionType: AuthorSectionType;
  synopsis?: string;
  title: string;
}

export interface SaveAuthorDraftInput {
  autosave?: boolean;
  content: string;
}

export interface AuthorSectionDraft {
  draft: AuthorDraft | null;
  section: AuthorManuscriptSection;
}

export interface AuthorManuscriptWorkspace {
  draftError: string | null;
  manuscript: AuthorManuscript | null;
  manuscriptError: string | null;
  sections: AuthorSectionDraft[];
  sectionsError: string | null;
}

export function listAuthorManuscripts(): Promise<ApiResult<AuthorManuscript[]>> {
  return apiGet<AuthorManuscript[]>("/author-studio/manuscripts");
}

export function getAuthorManuscript(id: string): Promise<ApiResult<AuthorManuscript>> {
  return apiGet<AuthorManuscript>(`/author-studio/manuscripts/${encodeURIComponent(id)}`);
}

export function listAuthorSections(
  manuscriptId: string
): Promise<ApiResult<AuthorManuscriptSection[]>> {
  return apiGet<AuthorManuscriptSection[]>(
    `/author-studio/manuscripts/${encodeURIComponent(manuscriptId)}/sections`
  );
}

export function getLatestAuthorDraft(sectionId: string): Promise<ApiResult<AuthorDraft | null>> {
  return apiGet<AuthorDraft | null>(
    `/author-studio/sections/${encodeURIComponent(sectionId)}/draft`
  );
}

export function createAuthorManuscript(
  input: CreateAuthorManuscriptInput
): Promise<ApiResult<AuthorManuscript>> {
  return apiPost<AuthorManuscript, CreateAuthorManuscriptInput>(
    "/author-studio/manuscripts",
    input
  );
}

export function createAuthorSection(
  manuscriptId: string,
  input: CreateAuthorSectionInput
): Promise<ApiResult<AuthorManuscriptSection>> {
  return apiPost<AuthorManuscriptSection, CreateAuthorSectionInput>(
    `/author-studio/manuscripts/${encodeURIComponent(manuscriptId)}/sections`,
    input
  );
}

export function saveAuthorDraft(
  sectionId: string,
  input: SaveAuthorDraftInput
): Promise<ApiResult<AuthorDraft>> {
  return apiPost<AuthorDraft, SaveAuthorDraftInput>(
    `/author-studio/sections/${encodeURIComponent(sectionId)}/drafts`,
    input
  );
}

export async function getAuthorManuscriptWorkspace(
  manuscriptId: string
): Promise<AuthorManuscriptWorkspace> {
  const manuscriptResult = await getAuthorManuscript(manuscriptId);

  if (manuscriptResult.error || !manuscriptResult.data) {
    return {
      draftError: null,
      manuscript: null,
      manuscriptError: manuscriptResult.error ?? "Manuscript could not be loaded.",
      sections: [],
      sectionsError: null
    };
  }

  const sectionsResult = await listAuthorSections(manuscriptResult.data.id);

  if (sectionsResult.error || !sectionsResult.data) {
    return {
      draftError: null,
      manuscript: manuscriptResult.data,
      manuscriptError: null,
      sections: [],
      sectionsError: sectionsResult.error ?? "Sections could not be loaded."
    };
  }

  const draftResults = await Promise.all(
    sectionsResult.data.map(async (section) => ({
      draftResult: await getLatestAuthorDraft(section.id),
      section
    }))
  );

  const firstDraftError = draftResults.find(({ draftResult }) => draftResult.error)?.draftResult.error ?? null;

  return {
    draftError: firstDraftError,
    manuscript: manuscriptResult.data,
    manuscriptError: null,
    sections: draftResults.map(({ draftResult, section }) => ({
      draft: draftResult.data ?? null,
      section
    })),
    sectionsError: null
  };
}
