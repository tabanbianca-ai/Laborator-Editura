import { apiGet, apiPost, type ApiResult } from "./api-client";
import {
  listDocuments,
  listProjects,
  type DocumentRecord,
  type ProjectRecord
} from "./projects-documents-api";

export interface WorkspaceSegmentRecord {
  documentId: string;
  id: string;
  latestTargetText?: string;
  latestTranslationId?: string;
  order: number;
  projectId: string;
  sourceLanguage: string;
  sourceLocale?: string;
  sourceText: string;
  status: "APPROVED" | "IN_REVIEW" | "IN_TRANSLATION" | "NEW" | "TRANSLATED";
  targetLanguage: string;
  targetLocale?: string;
  updatedAt: string;
}

export interface WorkspaceTranslationMetadata {
  lexicographicSupport?: LexicographicReference[];
  qaScore?: number;
  semanticScore?: number;
  terminologyValid?: boolean;
}

export interface WorkspaceTranslationRecord {
  createdBy: string;
  documentId: string;
  id: string;
  metadata?: WorkspaceTranslationMetadata;
  originalAuthorId?: string;
  originalAuthorName?: string;
  projectId: string;
  segmentId: string;
  semanticReportId?: string;
  sourceLanguage: string;
  sourceLocale?: string;
  sourceText: string;
  status: "APPROVED" | "DRAFT" | "SUBMITTED" | "VALIDATED";
  targetLanguage: string;
  targetLocale?: string;
  targetText: string;
  translatorId?: string;
  translatorName?: string;
  updatedAt: string;
}

export interface LexicographicReference {
  authoritative: false;
  authority: string;
  citations?: Array<{
    id: string;
    pageOrSection?: string;
    sourceReference: string;
  }>;
  entryId: string;
  humanFinalAuthority: true;
  priorityRank: number;
  sourceId: string;
  sourceLanguage: string;
  sourceReferences?: string[];
  targetLanguage?: string;
  term: string;
  translationEquivalents?: string[];
}

export interface TerminologyViolation {
  authoritative: true;
  message: string;
  priority: string;
  severity?: "CRITICAL" | "HIGH";
  term: string;
  termId: string;
  type: string;
}

export interface TerminologyCheckResult {
  dictionaryEvidence?: LexicographicReference[];
  valid: boolean;
  violations: TerminologyViolation[];
}

export interface DictionaryEntry {
  citations?: LexicographicReference["citations"];
  id: string;
  sourceId: string;
  sourceLanguage: string;
  targetLanguage?: string;
  term: string;
}

export interface SemanticIssue {
  alternatives?: string[];
  aiExplanation?: string;
  createdAt: string;
  documentId?: string;
  id: string;
  message: string;
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  segmentId?: string;
  status: "OPEN" | "RESOLVED";
  type: string;
}

export interface TranslationWorkspaceData {
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
}

interface TranslationWorkspaceInput {
  documentId?: string;
  segmentId?: string;
}

export async function getTranslationWorkspaceData({
  documentId,
  segmentId
}: TranslationWorkspaceInput): Promise<TranslationWorkspaceData> {
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
    return emptyWorkspace({
      documents,
      documentsError: documentsResult.error,
      projects,
      projectsError: projectsResult.error
    });
  }

  const [segmentsResult, translationsResult] = await Promise.all([
    listWorkspaceSegments(selectedDocument.id),
    listWorkspaceTranslations(selectedDocument.id)
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
      translationsError: translationsResult.error
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
    translationsError: translationsResult.error
  };
}

export function submitWorkspaceTranslation(input: {
  metadata?: Record<string, unknown>;
  segmentId: string;
  targetText: string;
  translatorName?: string;
}): Promise<ApiResult<WorkspaceTranslationRecord>> {
  return apiPost<WorkspaceTranslationRecord, typeof input>("/translations/submit", input);
}

function listWorkspaceSegments(documentId: string): Promise<ApiResult<WorkspaceSegmentRecord[]>> {
  return apiGet<WorkspaceSegmentRecord[]>(`/segments?documentId=${encodeURIComponent(documentId)}`);
}

function listWorkspaceTranslations(documentId: string): Promise<ApiResult<WorkspaceTranslationRecord[]>> {
  return apiGet<WorkspaceTranslationRecord[]>(
    `/translations?documentId=${encodeURIComponent(documentId)}`
  );
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

function emptyWorkspace(input: {
  documents: DocumentRecord[];
  documentsError: string | null;
  projects: ProjectRecord[];
  projectsError: string | null;
}): TranslationWorkspaceData {
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
    translationsError: null
  };
}
