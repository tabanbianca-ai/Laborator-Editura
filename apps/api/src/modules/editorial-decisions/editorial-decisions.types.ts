export type EditorialDecisionEvidenceSourceType =
  | "VALIDATED_GLOSSARY"
  | "EDITORIAL_DECISION"
  | "SPECIALIZED_DICTIONARY"
  | "ACADEMIC_DICTIONARY"
  | "TRANSLATION_MEMORY"
  | "SEMANTIC_FIDELITY"
  | "AI_REASONING";

export type EditorialDecisionApprovalStatus =
  | "PENDING_HUMAN_APPROVAL"
  | "APPROVED"
  | "REJECTED";

export type EditorialDecisionAuditAction =
  | "RECOMMENDATION_CREATED"
  | "VERSION_CREATED"
  | "APPROVED"
  | "REJECTED";

export interface EditorialDecisionActor {
  userId: string;
  organizationId: string;
  roles?: string[];
  permissions?: string[];
}

export interface EditorialDecisionEvidenceSource {
  sourceType: EditorialDecisionEvidenceSourceType;
  sourceId?: string;
  label: string;
  priorityRank: number;
  authoritative: boolean;
  humanFinalAuthority: true;
  payload?: object;
}

export interface EditorialDecisionAuditTrailItem {
  action: EditorialDecisionAuditAction;
  actorId: string;
  at: string;
  version: number;
  details?: object;
}

export interface EditorialDecisionRecommendation {
  id: string;
  organizationId: string;
  editorialDecisionId: string;
  projectId?: string;
  documentId?: string;
  segmentId?: string;
  sourceText: string;
  targetText: string;
  sourceLanguage: string;
  targetLanguage: string;
  domain?: string;
  recommendation: string;
  alternatives: string[];
  rationale: string;
  confidenceScore: number;
  evidenceSources: EditorialDecisionEvidenceSource[];
  humanApprovalRequired: true;
  approvedBy?: string;
  approvedAt?: string;
  approvalStatus: EditorialDecisionApprovalStatus;
  auditTrail: EditorialDecisionAuditTrailItem[];
  version: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, unknown>;
}

export interface EditorialDecisionAuditEvent {
  id: string;
  organizationId: string;
  editorialDecisionId: string;
  action: EditorialDecisionAuditAction;
  actorId: string;
  beforeState?: EditorialDecisionRecommendation;
  afterState?: EditorialDecisionRecommendation;
  createdAt: string;
}

export interface CreateEditorialDecisionRecommendationInput {
  projectId?: string;
  documentId?: string;
  segmentId?: string;
  sourceText: string;
  targetText: string;
  sourceLanguage: string;
  targetLanguage: string;
  domain?: string;
  metadata?: Record<string, unknown>;
}

export interface EditorialDecisionRepository {
  createRecommendation(
    recommendation: EditorialDecisionRecommendation
  ): Promise<EditorialDecisionRecommendation>;
  updateRecommendation(
    recommendation: EditorialDecisionRecommendation
  ): Promise<EditorialDecisionRecommendation>;
  findRecommendationById(
    id: string,
    organizationId: string
  ): Promise<EditorialDecisionRecommendation | null>;
  listApprovedDecisions(input: {
    organizationId: string;
    sourceLanguage: string;
    targetLanguage: string;
    domain?: string;
  }): Promise<EditorialDecisionRecommendation[]>;
  appendAuditEvent(event: EditorialDecisionAuditEvent): Promise<void>;
}

export const EDITORIAL_DECISION_PRIORITY_RULE = [
  "VALIDATED_GLOSSARY",
  "DOCUMENTED_EDITORIAL_DECISION",
  "SPECIALIZED_DICTIONARY",
  "ACADEMIC_DICTIONARY",
  "TRANSLATION_MEMORY",
  "AI_SUGGESTION"
] as const;
