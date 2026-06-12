export type QaReportScope = "SEGMENT" | "DOCUMENT";

export type QaReportStatus = "COMPLETED" | "FAILED";

export type QaIssueType =
  | "MISSING_TARGET_TRANSLATION"
  | "UNTRANSLATED_SEGMENT"
  | "NUMBER_MISMATCH"
  | "DATE_MISMATCH"
  | "PUNCTUATION_MISMATCH"
  | "REPEATED_SEGMENT"
  | "TERMINOLOGY_VIOLATION"
  | "FORBIDDEN_TERMINOLOGY_VARIANT"
  | "EMPTY_TRANSLATION"
  | "TOO_SHORT_TRANSLATION";

export type QaIssueSeverity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type QaIssueStatus = "OPEN" | "RESOLVED";

export type QaAuditAction =
  | "QA_RUN"
  | "ISSUE_CREATED"
  | "ISSUE_RESOLVED"
  | "SCORE_RECALCULATED";

export interface QaActor {
  userId: string;
  organizationId: string;
}

export interface QaSegmentInput {
  projectId?: string;
  documentId?: string;
  segmentId: string;
  sourceText: string;
  targetText?: string;
  sourceLanguage?: string;
  targetLanguage: string;
  domain?: string;
}

export interface QaDocumentInput {
  projectId?: string;
  documentId: string;
  targetLanguage: string;
  domain?: string;
  segments: QaSegmentInput[];
}

export interface QaIssue {
  id: string;
  organizationId: string;
  qaReportId: string;
  projectId?: string;
  documentId?: string;
  segmentId?: string;
  type: QaIssueType;
  severity: QaIssueSeverity;
  status: QaIssueStatus;
  message: string;
  sourceText?: string;
  targetText?: string;
  terminologyTermId?: string;
  createdBy: string;
  resolvedBy?: string;
  createdAt: string;
  resolvedAt?: string;
  metadata?: Record<string, unknown>;
}

export interface QaReport {
  id: string;
  organizationId: string;
  projectId?: string;
  documentId?: string;
  segmentId?: string;
  scope: QaReportScope;
  status: QaReportStatus;
  score: number;
  issueCount: number;
  createdBy: string;
  createdAt: string;
  metadata?: Record<string, unknown>;
  issues: QaIssue[];
}

export interface QaAuditEvent {
  id: string;
  organizationId: string;
  qaReportId?: string;
  qaIssueId?: string;
  action: QaAuditAction;
  actorId: string;
  beforeState?: QaReport | QaIssue;
  afterState?: QaReport | QaIssue;
  createdAt: string;
}

export interface ListQaIssuesInput {
  projectId?: string;
  documentId?: string;
  segmentId?: string;
  status?: QaIssueStatus;
  severity?: QaIssueSeverity;
}

export interface QaRepository {
  createReport(report: QaReport): Promise<QaReport>;
  updateReport(report: QaReport): Promise<QaReport>;
  findReportById(id: string, organizationId: string): Promise<QaReport | null>;
  createIssues(issues: QaIssue[]): Promise<QaIssue[]>;
  updateIssue(issue: QaIssue): Promise<QaIssue>;
  findIssueById(id: string, organizationId: string): Promise<QaIssue | null>;
  listIssues(input: ListQaIssuesInput & { organizationId: string }): Promise<QaIssue[]>;
  appendAuditEvent(event: QaAuditEvent): Promise<void>;
}
