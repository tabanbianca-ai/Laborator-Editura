export type LayoutPublicationKind = "BOOK" | "MAGAZINE";

export type LayoutExportFormat =
  | "JSON_MASTER"
  | "PDF"
  | "EPUB"
  | "MOBI"
  | "HARDCOVER"
  | "PAPERBACK"
  | "PRINT_ON_DEMAND";

export type LayoutApprovalStatus =
  | "PENDING_HUMAN_APPROVAL"
  | "APPROVED"
  | "REJECTED";

export type LayoutAuditAction =
  | "LAYOUT_PLAN_CREATED"
  | "STYLE_REVISION_CREATED"
  | "PUBLICATION_APPROVED"
  | "PUBLICATION_REJECTED"
  | "EXPORT_RECORDED";

export interface LayoutPublishingActor {
  userId: string;
  organizationId: string;
  roles?: string[];
  permissions?: string[];
}

export interface BookLayoutPlan {
  chapters: string[];
  sections: string[];
  footnotes: string[];
  tableOfContents: boolean;
  indexes: string[];
  illustrations: string[];
  captions: string[];
  pageTemplates: string[];
}

export interface MagazineLayoutPlan {
  issues: string[];
  articles: string[];
  columns: string[];
  imageGalleries: string[];
  covers: string[];
  archives: string[];
}

export interface EditorialFinishingProfile {
  widowOrphanControl: boolean;
  typographyValidation: boolean;
  spacing: "COMPACT" | "STANDARD" | "EXPANDED";
  kerning: boolean;
  margins: string;
  bleed: string;
  pagination: "AUTO" | "MANUAL_REVIEW_REQUIRED";
  printProfiles: string[];
}

export interface LayoutMultimediaProfile {
  audioChapters: string[];
  synchronizedNarration: boolean;
  videoAssets: string[];
  illustrations: string[];
  galleries: string[];
}

export interface LayoutPublicationExportHistory {
  id: string;
  format: LayoutExportFormat;
  artifactUri?: string;
  createdBy: string;
  createdAt: string;
}

export interface LayoutPublicationHistoryItem {
  id: string;
  action: LayoutAuditAction;
  actorId: string;
  at: string;
  layoutVersion: number;
  styleRevision: number;
  details?: object;
}

export interface LayoutPublicationPlan {
  id: string;
  organizationId: string;
  projectId?: string;
  documentId?: string;
  publicationKind: LayoutPublicationKind;
  title: string;
  language: string;
  bookLayout?: BookLayoutPlan;
  magazineLayout?: MagazineLayoutPlan;
  editorialFinishing: EditorialFinishingProfile;
  exportFormats: LayoutExportFormat[];
  multimedia: LayoutMultimediaProfile;
  layoutVersion: number;
  styleRevision: number;
  publicationHistory: LayoutPublicationHistoryItem[];
  exportHistory: LayoutPublicationExportHistory[];
  approvalStatus: LayoutApprovalStatus;
  humanApprovalRequired: true;
  approvedBy?: string;
  approvedAt?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, unknown>;
}

export interface LayoutPublicationAuditEvent {
  id: string;
  organizationId: string;
  layoutPublicationPlanId: string;
  action: LayoutAuditAction;
  actorId: string;
  beforeState?: LayoutPublicationPlan;
  afterState?: LayoutPublicationPlan;
  createdAt: string;
}

export interface CreateLayoutPublicationPlanInput {
  projectId?: string;
  documentId?: string;
  publicationKind: LayoutPublicationKind;
  title: string;
  language: string;
  bookLayout?: Partial<BookLayoutPlan>;
  magazineLayout?: Partial<MagazineLayoutPlan>;
  editorialFinishing?: Partial<EditorialFinishingProfile>;
  exportFormats?: LayoutExportFormat[];
  multimedia?: Partial<LayoutMultimediaProfile>;
  metadata?: Record<string, unknown>;
}

export interface RecordLayoutExportInput {
  format: LayoutExportFormat;
  artifactUri?: string;
}

export interface LayoutPublicationRepository {
  createPlan(plan: LayoutPublicationPlan): Promise<LayoutPublicationPlan>;
  updatePlan(plan: LayoutPublicationPlan): Promise<LayoutPublicationPlan>;
  findPlanById(id: string, organizationId: string): Promise<LayoutPublicationPlan | null>;
  appendAuditEvent(event: LayoutPublicationAuditEvent): Promise<void>;
}
