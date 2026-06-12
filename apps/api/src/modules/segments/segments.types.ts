export interface SegmentActor {
  userId: string;
  organizationId: string;
}

export type SegmentAuditAction = "CREATE" | "UPDATE" | "DELETE" | "APPROVE" | "EXPORT";

export interface Segment {
  id: string;
  organizationId: string;
  projectId: string;
  documentId: string;
  sourceText: string;
  sourceLanguage: string;
  targetLanguage: string;
  order: number;
  status: "NEW" | "IN_TRANSLATION" | "TRANSLATED" | "IN_REVIEW" | "APPROVED";
  latestTranslationId?: string;
  latestTargetText?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, unknown>;
}

export interface CreateSegmentInput {
  projectId: string;
  documentId: string;
  sourceText: string;
  sourceLanguage?: string;
  targetLanguage?: string;
  order?: number;
  metadata?: Record<string, unknown>;
}

export interface SegmentAuditEvent {
  id: string;
  organizationId: string;
  actorId: string;
  action: SegmentAuditAction;
  entityType: "SEGMENT";
  entityId: string;
  beforeState?: Segment | null;
  afterState?: Segment | null;
  createdAt: string;
}
