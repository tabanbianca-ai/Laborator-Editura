export type CollaborationTargetType =
  | "PROJECT"
  | "DOCUMENT"
  | "SEGMENT"
  | "EDITORIAL_FEEDBACK"
  | "REVIEWER_NOTE";

export type CollaborationThreadVisibility = "INTERNAL" | "PRIVATE_EDITORIAL";

export type CollaborationThreadStatus = "OPEN" | "RESOLVED" | "ARCHIVED";

export type CollaborationCommentType =
  | "COMMENT"
  | "EDITORIAL_FEEDBACK"
  | "REVIEWER_NOTE"
  | "MENTION_PLACEHOLDER";

export type CommunityModerationStatus =
  | "PENDING_REVIEW"
  | "APPROVED"
  | "REJECTED"
  | "FLAGGED";

export type CommunityContentType = "REVIEW" | "COMMENT";

export type CommunityFlagStatus = "OPEN" | "REVIEWED" | "DISMISSED";

export type CollaborationAuditAction =
  | "COLLABORATION_THREAD_CREATED"
  | "COLLABORATION_COMMENT_CREATED"
  | "COLLABORATION_COMMENT_RESOLVED"
  | "COMMUNITY_REVIEW_CREATED"
  | "COMMUNITY_COMMENT_CREATED"
  | "COMMUNITY_CONTENT_APPROVED"
  | "COMMUNITY_CONTENT_REJECTED"
  | "COMMUNITY_CONTENT_FLAGGED";

export type CommunityModerationAction =
  | "CONTENT_APPROVED"
  | "CONTENT_REJECTED"
  | "CONTENT_FLAGGED"
  | "AI_MODERATION_SUGGESTED";

export interface CollaborationActor {
  userId: string;
  organizationId: string;
  roles?: string[];
  permissions?: string[];
}

export interface CollaborationThread {
  id: string;
  organizationId: string;
  projectId?: string;
  documentId?: string;
  segmentId?: string;
  targetType: CollaborationTargetType;
  title: string;
  visibility: CollaborationThreadVisibility;
  status: CollaborationThreadStatus;
  mentionsPlaceholder: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CollaborationComment {
  id: string;
  organizationId: string;
  threadId: string;
  authorUserId: string;
  body: string;
  commentType: CollaborationCommentType;
  privateEditorial: boolean;
  mentionsPlaceholder: string[];
  resolved: boolean;
  resolvedBy?: string;
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CommunityReview {
  id: string;
  organizationId: string;
  publicCatalogItemId: string;
  userId: string;
  rating: number;
  title?: string;
  body: string;
  moderationStatus: CommunityModerationStatus;
  humanModerationRequired: true;
  aiModerationSuggestion?: string;
  createdAt: string;
  updatedAt: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectedBy?: string;
  rejectedAt?: string;
}

export interface CommunityComment {
  id: string;
  organizationId: string;
  publicCatalogItemId: string;
  userId: string;
  body: string;
  threadTitle?: string;
  moderationStatus: CommunityModerationStatus;
  humanModerationRequired: true;
  aiModerationSuggestion?: string;
  createdAt: string;
  updatedAt: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectedBy?: string;
  rejectedAt?: string;
}

export interface CommunityFlag {
  id: string;
  organizationId: string;
  contentType: CommunityContentType;
  communityReviewId?: string;
  communityCommentId?: string;
  reason: string;
  reportedByUserId: string;
  status: CommunityFlagStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CommunityModerationEvent {
  id: string;
  organizationId: string;
  contentType: CommunityContentType;
  communityReviewId?: string;
  communityCommentId?: string;
  communityFlagId?: string;
  action: CommunityModerationAction;
  actorId: string;
  aiSuggested: boolean;
  humanFinalAuthority: true;
  createdAt: string;
}

export interface CollaborationAuditEvent {
  id: string;
  organizationId: string;
  threadId?: string;
  collaborationCommentId?: string;
  communityReviewId?: string;
  communityCommentId?: string;
  communityFlagId?: string;
  action: CollaborationAuditAction;
  actorId: string;
  beforeState?: CollaborationComment | CommunityReview | CommunityComment;
  afterState?: CollaborationThread | CollaborationComment | CommunityReview | CommunityComment | CommunityFlag;
  createdAt: string;
}

export interface CreateCollaborationThreadInput {
  projectId?: string;
  documentId?: string;
  segmentId?: string;
  targetType: CollaborationTargetType;
  title: string;
  visibility?: CollaborationThreadVisibility;
  mentionsPlaceholder?: string[];
}

export interface AddCollaborationCommentInput {
  body: string;
  commentType?: CollaborationCommentType;
  privateEditorial?: boolean;
  mentionsPlaceholder?: string[];
}

export interface CreateCommunityReviewInput {
  publicCatalogItemId: string;
  rating: number;
  title?: string;
  body: string;
  aiModerationSuggestion?: string;
}

export interface CreateCommunityCommentInput {
  publicCatalogItemId: string;
  body: string;
  threadTitle?: string;
  aiModerationSuggestion?: string;
}

export interface FlagCommunityContentInput {
  contentType?: CommunityContentType;
  reason: string;
}

export interface CollaborationRepository {
  createThread(thread: CollaborationThread): Promise<CollaborationThread>;
  findThreadById(id: string, organizationId: string): Promise<CollaborationThread | null>;
  createCollaborationComment(comment: CollaborationComment): Promise<CollaborationComment>;
  updateCollaborationComment(comment: CollaborationComment): Promise<CollaborationComment>;
  findCollaborationCommentById(id: string, organizationId: string): Promise<CollaborationComment | null>;
  createCommunityReview(review: CommunityReview): Promise<CommunityReview>;
  updateCommunityReview(review: CommunityReview): Promise<CommunityReview>;
  findCommunityReviewById(id: string, organizationId: string): Promise<CommunityReview | null>;
  listApprovedReviews(publicCatalogItemId: string): Promise<CommunityReview[]>;
  createCommunityComment(comment: CommunityComment): Promise<CommunityComment>;
  updateCommunityComment(comment: CommunityComment): Promise<CommunityComment>;
  findCommunityCommentById(id: string, organizationId: string): Promise<CommunityComment | null>;
  listApprovedComments(publicCatalogItemId: string): Promise<CommunityComment[]>;
  createFlag(flag: CommunityFlag): Promise<CommunityFlag>;
  createModerationEvent(event: CommunityModerationEvent): Promise<CommunityModerationEvent>;
  appendAuditEvent(event: CollaborationAuditEvent): Promise<void>;
}
