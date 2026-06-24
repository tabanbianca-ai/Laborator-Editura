import { apiGet, apiPost, type ApiResult } from "./api-client";
import {
  listDocuments,
  listProjects,
  type DocumentRecord,
  type ProjectRecord
} from "./projects-documents-api";
import type {
  DictionaryEntry,
  LexicographicReference,
  SemanticIssue,
  TerminologyCheckResult,
  WorkspaceSegmentRecord,
  WorkspaceTranslationRecord
} from "./translation-workspace-client";

export type ReviewWorkflowStatus =
  | "DRAFT"
  | "IN_TRANSLATION"
  | "IN_QA"
  | "IN_SEMANTIC_REVIEW"
  | "IN_REVIEW"
  | "APPROVED"
  | "READY_FOR_EXPORT"
  | "EXPORTED"
  | "BLOCKED";

export interface ReviewWorkflowState {
  approvedAt?: string;
  approvedBy?: string;
  blockedReason?: string;
  documentId: string;
  id: string;
  projectId?: string;
  status: ReviewWorkflowStatus;
  updatedAt: string;
  updatedBy?: string;
}

export interface ReviewWorkspaceData {
  activeSegment: WorkspaceSegmentRecord | null;
  documents: DocumentRecord[];
  documentsError: string | null;
  latestTranslation: WorkspaceTranslationRecord | null;
  lexicographicReferences: DictionaryEntry[];
  lexicographicReferencesError: string | null;
  projects: ProjectRecord[];
  projectsError: string | null;
  selectedDocument: DocumentRecord | null;
  selectedProject: ProjectRecord | null;
  semanticIssues: SemanticIssue[];
  semanticIssuesError: string | null;
  segments: WorkspaceSegmentRecord[];
  segmentsError: string | null;
  terminology: TerminologyCheckResult | null;
  terminologyError: string | null;
  translations: WorkspaceTranslationRecord[];
  translationsError: string | null;
  workflow: ReviewWorkflowState | null;
  workflowError: string | null;
}

interface ReviewWorkspaceInput {
  documentId?: string;
  segmentId?: string;
}

export async function getReviewWorkspaceData({
  documentId,
  segmentId
}: ReviewWorkspaceInput): Promise<ReviewWorkspaceData> {
  const [projectsResult, documentsResult] = await Promise.all([listProjects(), listDocuments()]);
  const documents = documentsResult.data ?? [];
  const projects = projectsResult.data ?? [];
  const selectedDocument = documentId
    ? documents.find((document) => document.id === documentId) ?? null
    : null;
  const selectedProject = selectedDocument
    ? projects.find((project) => project.id === selectedDocument.projectId) ?? null
    : null;

  if (!selectedDocument) {
    return emptyReviewWorkspace({
      documents,
      documentsError: documentsResult.error,
      projects,
      projectsError: projectsResult.error
    });
  }

  const [segmentsResult, translationsResult, workflowResult] = await Promise.all([
    listReviewSegments(selectedDocument.id),
    listReviewTranslations(selectedDocument.id),
    getWorkflowStatus({
      documentId: selectedDocument.id,
      projectId: selectedDocument.projectId
    })
  ]);
  const segments = [...(segmentsResult.data ?? [])].sort((left, right) => left.order - right.order);
  const translations = translationsResult.data ?? [];
  const activeSegment = resolveActiveSegment(segments, segmentId);
  const latestTranslation = activeSegment
    ? findLatestTranslation(activeSegment, translations)
    : null;

  if (!activeSegment) {
    return {
      activeSegment: null,
      documents,
      documentsError: documentsResult.error,
      latestTranslation: null,
      lexicographicReferences: [],
      lexicographicReferencesError: null,
      projects,
      projectsError: projectsResult.error,
      selectedDocument,
      selectedProject,
      semanticIssues: [],
      semanticIssuesError: null,
      segments,
      segmentsError: segmentsResult.error,
      terminology: null,
      terminologyError: null,
      translations,
      translationsError: translationsResult.error,
      workflow: workflowResult.data,
      workflowError: workflowResult.error
    };
  }

  const targetText = latestTranslation?.targetText ?? activeSegment.latestTargetText ?? "";
  const [terminologyResult, lexicographicResult, semanticResult] = await Promise.all([
    checkTerminology({
      domain: selectedProject?.domain,
      language: activeSegment.targetLanguage,
      sourceLanguage: activeSegment.sourceLanguage,
      sourceText: activeSegment.sourceText,
      targetLanguage: activeSegment.targetLanguage,
      targetText
    }),
    searchLexicographicReferences({
      sourceLanguage: activeSegment.sourceLanguage,
      targetLanguage: activeSegment.targetLanguage,
      term: activeSegment.sourceText
    }),
    listSemanticIssues({
      documentId: selectedDocument.id,
      segmentId: activeSegment.id
    })
  ]);

  return {
    activeSegment,
    documents,
    documentsError: documentsResult.error,
    latestTranslation,
    lexicographicReferences: lexicographicResult.data ?? [],
    lexicographicReferencesError: lexicographicResult.error,
    projects,
    projectsError: projectsResult.error,
    selectedDocument,
    selectedProject,
    semanticIssues: semanticResult.data ?? [],
    semanticIssuesError: semanticResult.error,
    segments,
    segmentsError: segmentsResult.error,
    terminology: terminologyResult.data,
    terminologyError: terminologyResult.error,
    translations,
    translationsError: translationsResult.error,
    workflow: workflowResult.data,
    workflowError: workflowResult.error
  };
}

export function approveReviewDocument(input: {
  documentId: string;
  projectId?: string;
}): Promise<ApiResult<ReviewWorkflowState>> {
  return apiPost<ReviewWorkflowState, typeof input>("/workflow/approve", input);
}

export type ReviewLexicographicEvidence = LexicographicReference;

function listReviewSegments(documentId: string): Promise<ApiResult<WorkspaceSegmentRecord[]>> {
  return apiGet<WorkspaceSegmentRecord[]>(`/segments?documentId=${encodeURIComponent(documentId)}`);
}

function listReviewTranslations(documentId: string): Promise<ApiResult<WorkspaceTranslationRecord[]>> {
  return apiGet<WorkspaceTranslationRecord[]>(
    `/translations?documentId=${encodeURIComponent(documentId)}`
  );
}

function getWorkflowStatus(input: {
  documentId: string;
  projectId?: string;
}): Promise<ApiResult<ReviewWorkflowState>> {
  const query = new URLSearchParams({
    documentId: input.documentId
  });

  if (input.projectId) {
    query.set("projectId", input.projectId);
  }

  return apiGet<ReviewWorkflowState>(`/workflow/status?${query.toString()}`);
}

function checkTerminology(input: {
  domain?: string;
  language: string;
  sourceLanguage: string;
  sourceText: string;
  targetLanguage: string;
  targetText: string;
}): Promise<ApiResult<TerminologyCheckResult>> {
  return apiPost<TerminologyCheckResult, typeof input>("/terminology/check-segment", input);
}

function searchLexicographicReferences(input: {
  sourceLanguage: string;
  targetLanguage: string;
  term: string;
}): Promise<ApiResult<DictionaryEntry[]>> {
  const query = new URLSearchParams({
    sourceLanguage: input.sourceLanguage,
    targetLanguage: input.targetLanguage,
    term: input.term
  });

  return apiGet<DictionaryEntry[]>(`/lexicographic/search?${query.toString()}`);
}

function listSemanticIssues(input: {
  documentId: string;
  segmentId: string;
}): Promise<ApiResult<SemanticIssue[]>> {
  const query = new URLSearchParams({
    documentId: input.documentId,
    segmentId: input.segmentId
  });

  return apiGet<SemanticIssue[]>(`/semantic-fidelity/issues?${query.toString()}`);
}

function resolveActiveSegment(
  segments: WorkspaceSegmentRecord[],
  segmentId: string | undefined
): WorkspaceSegmentRecord | null {
  if (segments.length === 0) {
    return null;
  }

  return segments.find((segment) => segment.id === segmentId) ?? segments[0] ?? null;
}

function findLatestTranslation(
  segment: WorkspaceSegmentRecord,
  translations: WorkspaceTranslationRecord[]
): WorkspaceTranslationRecord | null {
  const latestById = segment.latestTranslationId
    ? translations.find((translation) => translation.id === segment.latestTranslationId)
    : undefined;

  if (latestById) {
    return latestById;
  }

  return (
    translations
      .filter((translation) => translation.segmentId === segment.id)
      .sort((left, right) => new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime())[0] ??
    null
  );
}

function emptyReviewWorkspace(input: {
  documents: DocumentRecord[];
  documentsError: string | null;
  projects: ProjectRecord[];
  projectsError: string | null;
}): ReviewWorkspaceData {
  return {
    activeSegment: null,
    documents: input.documents,
    documentsError: input.documentsError,
    latestTranslation: null,
    lexicographicReferences: [],
    lexicographicReferencesError: null,
    projects: input.projects,
    projectsError: input.projectsError,
    selectedDocument: null,
    selectedProject: null,
    semanticIssues: [],
    semanticIssuesError: null,
    segments: [],
    segmentsError: null,
    terminology: null,
    terminologyError: null,
    translations: [],
    translationsError: null,
    workflow: null,
    workflowError: null
  };
}
