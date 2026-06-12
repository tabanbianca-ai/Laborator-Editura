export type SemanticFidelityReportScope = "SEGMENT" | "DOCUMENT";

export type SemanticFidelityReportStatus = "COMPLETED" | "FAILED";

export type SemanticFidelityIssueType =
  | "MEANING_DRIFT"
  | "UNJUSTIFIED_REINTERPRETATION"
  | "OMITTED_MEANING"
  | "ADDED_MEANING"
  | "TERMINOLOGY_MEANING_CONFLICT"
  | "CONTEXT_MISMATCH";

export type SemanticFidelityRiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type SemanticFidelityIssueStatus = "OPEN" | "RESOLVED";

export type SemanticFidelityAuditAction =
  | "SEMANTIC_CHECK"
  | "ISSUE_CREATED"
  | "ISSUE_RESOLVED"
  | "SCORE_RECALCULATED";

export interface SemanticFidelityActor {
  userId: string;
  organizationId: string;
}

export interface SemanticSegmentInput {
  projectId?: string;
  documentId?: string;
  segmentId: string;
  sourceText: string;
  targetText: string;
  sourceLanguage: string;
  targetLanguage: string;
  domain?: string;
}

export interface SemanticDocumentInput {
  projectId?: string;
  documentId: string;
  sourceLanguage: string;
  targetLanguage: string;
  domain?: string;
  segments: SemanticSegmentInput[];
}

export interface SemanticFidelityIssue {
  id: string;
  organizationId: string;
  semanticReportId: string;
  projectId?: string;
  documentId?: string;
  segmentId?: string;
  type: SemanticFidelityIssueType;
  riskLevel: SemanticFidelityRiskLevel;
  status: SemanticFidelityIssueStatus;
  message: string;
  sourceText?: string;
  targetText?: string;
  terminologyTermId?: string;
  translationMemoryEntryId?: string;
  qaIssueId?: string;
  aiExplanation?: string;
  alternatives?: string[];
  createdBy: string;
  resolvedBy?: string;
  createdAt: string;
  resolvedAt?: string;
  metadata?: Record<string, unknown>;
}

export interface SemanticFidelityReport {
  id: string;
  organizationId: string;
  projectId?: string;
  documentId?: string;
  segmentId?: string;
  scope: SemanticFidelityReportScope;
  status: SemanticFidelityReportStatus;
  score: number;
  riskLevel: SemanticFidelityRiskLevel;
  issueCount: number;
  createdBy: string;
  createdAt: string;
  metadata?: Record<string, unknown>;
  issues: SemanticFidelityIssue[];
}

export interface SemanticFidelityAuditEvent {
  id: string;
  organizationId: string;
  semanticReportId?: string;
  semanticIssueId?: string;
  action: SemanticFidelityAuditAction;
  actorId: string;
  beforeState?: SemanticFidelityReport | SemanticFidelityIssue;
  afterState?: SemanticFidelityReport | SemanticFidelityIssue;
  createdAt: string;
}

export interface ListSemanticIssuesInput {
  projectId?: string;
  documentId?: string;
  segmentId?: string;
  status?: SemanticFidelityIssueStatus;
  riskLevel?: SemanticFidelityRiskLevel;
}

export interface SemanticFidelityRepository {
  createReport(report: SemanticFidelityReport): Promise<SemanticFidelityReport>;
  updateReport(report: SemanticFidelityReport): Promise<SemanticFidelityReport>;
  findReportById(id: string, organizationId: string): Promise<SemanticFidelityReport | null>;
  createIssues(issues: SemanticFidelityIssue[]): Promise<SemanticFidelityIssue[]>;
  updateIssue(issue: SemanticFidelityIssue): Promise<SemanticFidelityIssue>;
  findIssueById(id: string, organizationId: string): Promise<SemanticFidelityIssue | null>;
  listIssues(input: ListSemanticIssuesInput & { organizationId: string }): Promise<SemanticFidelityIssue[]>;
  appendAuditEvent(event: SemanticFidelityAuditEvent): Promise<void>;
}
