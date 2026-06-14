import { apiGet, apiPost, type ApiResult } from "./api-client";

export interface SegmentRecord {
  documentId: string;
  id: string;
  latestTargetText?: string;
  latestTranslationId?: string;
  order: number;
  projectId: string;
  sourceLanguage: string;
  sourceText: string;
  status: "APPROVED" | "IN_REVIEW" | "IN_TRANSLATION" | "NEW" | "TRANSLATED";
  targetLanguage: string;
  updatedAt: string;
}

export interface SegmentTranslationRecord {
  documentId: string;
  id: string;
  projectId: string;
  segmentId: string;
  sourceLanguage: string;
  sourceText: string;
  status: "APPROVED" | "DRAFT" | "SUBMITTED" | "VALIDATED";
  targetLanguage: string;
  targetText: string;
  updatedAt: string;
}

interface SubmitTranslationInput {
  segmentId: string;
  targetText: string;
}

export function listSegments(documentId: string): Promise<ApiResult<SegmentRecord[]>> {
  return apiGet<SegmentRecord[]>(
    `/segments?documentId=${encodeURIComponent(documentId)}`
  );
}

export function listTranslations(
  documentId: string
): Promise<ApiResult<SegmentTranslationRecord[]>> {
  return apiGet<SegmentTranslationRecord[]>(
    `/translations?documentId=${encodeURIComponent(documentId)}`
  );
}

export function submitTranslation(
  input: SubmitTranslationInput
): Promise<ApiResult<SegmentTranslationRecord>> {
  return apiPost<SegmentTranslationRecord, SubmitTranslationInput>(
    "/translations/submit",
    input
  );
}
