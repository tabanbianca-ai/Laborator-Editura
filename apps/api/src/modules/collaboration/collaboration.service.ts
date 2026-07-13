import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { DatabaseCollaborationRepository } from "./collaboration.repository";
import {
  type AddCollaborationCommentInput,
  type CollaborationActor,
  type CollaborationAuditAction,
  type CollaborationComment,
  type CollaborationThread,
  type CommunityComment,
  type CommunityContentType,
  type CommunityFlag,
  type CommunityModerationAction,
  type CommunityReview,
  type CreateCollaborationThreadInput,
  type CreateCommunityCommentInput,
  type CreateCommunityReviewInput,
  type FlagCommunityContentInput
} from "./collaboration.types";

@Injectable()
export class CollaborationService {
  constructor(private readonly repository: DatabaseCollaborationRepository) {}

  async createThread(actor: CollaborationActor, input: CreateCollaborationThreadInput): Promise<CollaborationThread> {
    this.validateActor(actor);

    if (!input.targetType || !input.title) {
      throw new BadRequestException("targetType and title are required.");
    }

    const now = new Date().toISOString();
    const thread: CollaborationThread = {
      id: randomUUID(),
      organizationId: actor.organizationId,
      projectId: input.projectId,
      documentId: input.documentId,
      segmentId: input.segmentId,
      targetType: input.targetType,
      title: input.title,
      visibility: input.visibility ?? "INTERNAL",
      status: "OPEN",
      mentionsPlaceholder: input.mentionsPlaceholder ?? [],
      createdBy: actor.userId,
      createdAt: now,
      updatedAt: now
    };

    const created = await this.repository.createThread(thread);
    await this.audit("COLLABORATION_THREAD_CREATED", actor, { threadId: created.id }, undefined, created);

    return created;
  }

  async getThread(actor: CollaborationActor, threadId: string): Promise<CollaborationThread> {
    this.validateActor(actor);

    const thread = await this.repository.findThreadById(threadId, actor.organizationId);

    if (!thread) {
      throw new NotFoundException("Collaboration thread not found.");
    }

    return thread;
  }

  async addThreadComment(
    actor: CollaborationActor,
    threadId: string,
    input: AddCollaborationCommentInput
  ): Promise<CollaborationComment> {
    this.validateActor(actor);

    if (!input.body) {
      throw new BadRequestException("comment body is required.");
    }

    const thread = await this.getThread(actor, threadId);
    const now = new Date().toISOString();
    const commentType = this.normalizeCommentType(input.commentType);
    const comment: CollaborationComment = {
      id: randomUUID(),
      organizationId: actor.organizationId,
      threadId: thread.id,
      authorUserId: actor.userId,
      body: input.body,
      commentType,
      privateEditorial: input.privateEditorial ?? thread.visibility === "PRIVATE_EDITORIAL",
      mentionsPlaceholder: input.mentionsPlaceholder ?? [],
      resolved: false,
      createdAt: now,
      updatedAt: now
    };

    const created = await this.repository.createCollaborationComment(comment);
    await this.audit(
      "COLLABORATION_COMMENT_CREATED",
      actor,
      { threadId: thread.id, collaborationCommentId: created.id },
      undefined,
      created
    );

    return created;
  }

  async resolveComment(actor: CollaborationActor, commentId: string): Promise<CollaborationComment> {
    this.validateActor(actor);

    const existing = await this.repository.findCollaborationCommentById(commentId, actor.organizationId);

    if (!existing) {
      throw new NotFoundException("Collaboration comment not found.");
    }

    const now = new Date().toISOString();
    const resolved: CollaborationComment = {
      ...existing,
      resolved: true,
      resolvedBy: actor.userId,
      resolvedAt: now,
      updatedAt: now
    };

    const saved = await this.repository.updateCollaborationComment(resolved);
    await this.audit(
      "COLLABORATION_COMMENT_RESOLVED",
      actor,
      { threadId: saved.threadId, collaborationCommentId: saved.id },
      existing,
      saved
    );

    return saved;
  }

  async createReview(actor: CollaborationActor, input: CreateCommunityReviewInput): Promise<CommunityReview> {
    this.validateActor(actor);

    if (!input.publicCatalogItemId || !input.body) {
      throw new BadRequestException("publicCatalogItemId and body are required.");
    }

    const now = new Date().toISOString();
    const review: CommunityReview = {
      id: randomUUID(),
      organizationId: actor.organizationId,
      publicCatalogItemId: input.publicCatalogItemId,
      userId: actor.userId,
      rating: this.clampRating(input.rating),
      title: input.title,
      body: input.body,
      moderationStatus: "PENDING_REVIEW",
      humanModerationRequired: true,
      aiModerationSuggestion: input.aiModerationSuggestion,
      createdAt: now,
      updatedAt: now
    };

    const created = await this.repository.createCommunityReview(review);
    await this.audit("COMMUNITY_REVIEW_CREATED", actor, { communityReviewId: created.id }, undefined, created);

    if (created.aiModerationSuggestion) {
      await this.moderationEvent("AI_MODERATION_SUGGESTED", actor, "REVIEW", created.id, undefined, true);
    }

    return created;
  }

  async createCommunityComment(
    actor: CollaborationActor,
    input: CreateCommunityCommentInput
  ): Promise<CommunityComment> {
    this.validateActor(actor);

    if (!input.publicCatalogItemId || !input.body) {
      throw new BadRequestException("publicCatalogItemId and body are required.");
    }

    const now = new Date().toISOString();
    const comment: CommunityComment = {
      id: randomUUID(),
      organizationId: actor.organizationId,
      publicCatalogItemId: input.publicCatalogItemId,
      userId: actor.userId,
      body: input.body,
      threadTitle: input.threadTitle,
      moderationStatus: "PENDING_REVIEW",
      humanModerationRequired: true,
      aiModerationSuggestion: input.aiModerationSuggestion,
      createdAt: now,
      updatedAt: now
    };

    const created = await this.repository.createCommunityComment(comment);
    await this.audit("COMMUNITY_COMMENT_CREATED", actor, { communityCommentId: created.id }, undefined, created);

    if (created.aiModerationSuggestion) {
      await this.moderationEvent("AI_MODERATION_SUGGESTED", actor, "COMMENT", undefined, created.id, true);
    }

    return created;
  }

  async approveContent(actor: CollaborationActor, contentId: string): Promise<CommunityReview | CommunityComment> {
    this.validateActor(actor);
    this.assertAuthorizedHuman(actor);

    const content = await this.findCommunityContent(actor, contentId);
    const now = new Date().toISOString();
    const approved = {
      ...content.value,
      moderationStatus: "APPROVED" as const,
      approvedBy: actor.userId,
      approvedAt: now,
      updatedAt: now
    };

    const saved = content.type === "REVIEW"
      ? await this.repository.updateCommunityReview(approved as CommunityReview)
      : await this.repository.updateCommunityComment(approved as CommunityComment);

    await this.moderationEvent(
      "CONTENT_APPROVED",
      actor,
      content.type,
      content.type === "REVIEW" ? saved.id : undefined,
      content.type === "COMMENT" ? saved.id : undefined,
      false
    );
    await this.audit(
      "COMMUNITY_CONTENT_APPROVED",
      actor,
      this.communityAuditTarget(content.type, saved.id),
      content.value,
      saved
    );

    return saved;
  }

  async rejectContent(actor: CollaborationActor, contentId: string): Promise<CommunityReview | CommunityComment> {
    this.validateActor(actor);
    this.assertAuthorizedHuman(actor);

    const content = await this.findCommunityContent(actor, contentId);
    const now = new Date().toISOString();
    const rejected = {
      ...content.value,
      moderationStatus: "REJECTED" as const,
      rejectedBy: actor.userId,
      rejectedAt: now,
      updatedAt: now
    };

    const saved = content.type === "REVIEW"
      ? await this.repository.updateCommunityReview(rejected as CommunityReview)
      : await this.repository.updateCommunityComment(rejected as CommunityComment);

    await this.moderationEvent(
      "CONTENT_REJECTED",
      actor,
      content.type,
      content.type === "REVIEW" ? saved.id : undefined,
      content.type === "COMMENT" ? saved.id : undefined,
      false
    );
    await this.audit(
      "COMMUNITY_CONTENT_REJECTED",
      actor,
      this.communityAuditTarget(content.type, saved.id),
      content.value,
      saved
    );

    return saved;
  }

  async flagContent(
    actor: CollaborationActor,
    contentId: string,
    input: FlagCommunityContentInput
  ): Promise<CommunityFlag> {
    this.validateActor(actor);

    if (!input.reason) {
      throw new BadRequestException("flag reason is required.");
    }

    const content = await this.findCommunityContent(actor, contentId, input.contentType);
    const now = new Date().toISOString();
    const flag: CommunityFlag = {
      id: randomUUID(),
      organizationId: actor.organizationId,
      contentType: content.type,
      communityReviewId: content.type === "REVIEW" ? content.value.id : undefined,
      communityCommentId: content.type === "COMMENT" ? content.value.id : undefined,
      reason: input.reason,
      reportedByUserId: actor.userId,
      status: "OPEN",
      createdAt: now,
      updatedAt: now
    };

    const created = await this.repository.createFlag(flag);
    await this.moderationEvent(
      "CONTENT_FLAGGED",
      actor,
      content.type,
      created.communityReviewId,
      created.communityCommentId,
      false,
      created.id
    );
    await this.audit(
      "COMMUNITY_CONTENT_FLAGGED",
      actor,
      { communityFlagId: created.id, ...this.communityAuditTarget(content.type, content.value.id) },
      undefined,
      created
    );

    return created;
  }

  async listPublicReviews(publicCatalogItemId: string): Promise<CommunityReview[]> {
    return this.repository.listApprovedReviews(publicCatalogItemId);
  }

  async listPublicComments(publicCatalogItemId: string): Promise<CommunityComment[]> {
    return this.repository.listApprovedComments(publicCatalogItemId);
  }

  private async findCommunityContent(
    actor: CollaborationActor,
    contentId: string,
    expectedType?: CommunityContentType
  ): Promise<{ type: CommunityContentType; value: CommunityReview | CommunityComment }> {
    if (expectedType !== "COMMENT") {
      const review = await this.repository.findCommunityReviewById(contentId, actor.organizationId);

      if (review) {
        return { type: "REVIEW", value: review };
      }
    }

    if (expectedType !== "REVIEW") {
      const comment = await this.repository.findCommunityCommentById(contentId, actor.organizationId);

      if (comment) {
        return { type: "COMMENT", value: comment };
      }
    }

    throw new NotFoundException("Community content not found.");
  }

  private communityAuditTarget(
    contentType: CommunityContentType,
    contentId: string
  ): { communityReviewId?: string; communityCommentId?: string } {
    return contentType === "REVIEW" ? { communityReviewId: contentId } : { communityCommentId: contentId };
  }

  private async moderationEvent(
    action: CommunityModerationAction,
    actor: CollaborationActor,
    contentType: CommunityContentType,
    communityReviewId?: string,
    communityCommentId?: string,
    aiSuggested = false,
    communityFlagId?: string
  ): Promise<void> {
    await this.repository.createModerationEvent({
      id: randomUUID(),
      organizationId: actor.organizationId,
      contentType,
      communityReviewId,
      communityCommentId,
      communityFlagId,
      action,
      actorId: actor.userId,
      aiSuggested,
      humanFinalAuthority: true,
      createdAt: new Date().toISOString()
    });
  }

  private async audit(
    action: CollaborationAuditAction,
    actor: CollaborationActor,
    target: {
      threadId?: string;
      collaborationCommentId?: string;
      communityReviewId?: string;
      communityCommentId?: string;
      communityFlagId?: string;
    },
    beforeState: CollaborationComment | CommunityReview | CommunityComment | undefined,
    afterState: CollaborationThread | CollaborationComment | CommunityReview | CommunityComment | CommunityFlag
  ): Promise<void> {
    await this.repository.appendAuditEvent({
      id: randomUUID(),
      organizationId: actor.organizationId,
      ...target,
      action,
      actorId: actor.userId,
      beforeState,
      afterState,
      createdAt: new Date().toISOString()
    });
  }

  private clampRating(rating: number): number {
    return Math.min(5, Math.max(1, rating));
  }

  private validateActor(actor: CollaborationActor): void {
    if (!actor.userId || !actor.organizationId) {
      throw new BadRequestException("userId and organizationId are required.");
    }
  }

  private normalizeCommentType(commentType?: CollaborationComment["commentType"]): CollaborationComment["commentType"] {
    const supportedCommentTypes: CollaborationComment["commentType"][] = [
      "COMMENT",
      "EDITORIAL_FEEDBACK",
      "REVIEWER_NOTE",
      "MENTION_PLACEHOLDER"
    ];

    if (!commentType) {
      return "COMMENT";
    }

    if (!supportedCommentTypes.includes(commentType)) {
      throw new BadRequestException("Unsupported collaboration comment type.");
    }

    return commentType;
  }

  private assertAuthorizedHuman(actor: CollaborationActor): void {
    const permissions = new Set(actor.permissions ?? []);
    const roles = new Set((actor.roles ?? []).map((role) => role.toUpperCase()));

    if (
      !permissions.has("review:approve") &&
      !roles.has("PLATFORM_CREATOR") &&
      !roles.has("ADMIN") &&
      !roles.has("REVIEWER")
    ) {
      throw new ForbiddenException("Only authorized humans may approve or reject community content.");
    }
  }
}
