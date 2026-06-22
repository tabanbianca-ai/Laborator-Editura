import { Inject, Injectable } from "@nestjs/common";
import { getDefaultRuntimeDatabase, type FileBackedRuntimeDatabase } from "@laborator/db";
import { RUNTIME_DATABASE } from "../runtime-database.provider";
import {
  type CollaborationAuditEvent,
  type CollaborationComment,
  type CollaborationRepository,
  type CollaborationThread,
  type CommunityComment,
  type CommunityFlag,
  type CommunityModerationEvent,
  type CommunityReview
} from "./collaboration.types";

@Injectable()
export class DatabaseCollaborationRepository implements CollaborationRepository {
  constructor(
    @Inject(RUNTIME_DATABASE)
    private readonly database: FileBackedRuntimeDatabase = getDefaultRuntimeDatabase()
  ) {}

  async createThread(thread: CollaborationThread): Promise<CollaborationThread> {
    return this.database.insert("collaboration_threads", thread);
  }

  async findThreadById(id: string, organizationId: string): Promise<CollaborationThread | null> {
    return this.database.findByIdForTenant<CollaborationThread>("collaboration_threads", id, organizationId);
  }

  async createCollaborationComment(comment: CollaborationComment): Promise<CollaborationComment> {
    return this.database.insert("collaboration_comments", comment);
  }

  async updateCollaborationComment(comment: CollaborationComment): Promise<CollaborationComment> {
    return this.database.upsert("collaboration_comments", comment);
  }

  async findCollaborationCommentById(id: string, organizationId: string): Promise<CollaborationComment | null> {
    return this.database.findByIdForTenant<CollaborationComment>("collaboration_comments", id, organizationId);
  }

  async createCommunityReview(review: CommunityReview): Promise<CommunityReview> {
    return this.database.insert("community_reviews", review);
  }

  async updateCommunityReview(review: CommunityReview): Promise<CommunityReview> {
    return this.database.upsert("community_reviews", review);
  }

  async findCommunityReviewById(id: string, organizationId: string): Promise<CommunityReview | null> {
    return this.database.findByIdForTenant<CommunityReview>("community_reviews", id, organizationId);
  }

  async listApprovedReviews(publicCatalogItemId: string): Promise<CommunityReview[]> {
    return this.database.select<CommunityReview>(
      "community_reviews",
      (review) => review.publicCatalogItemId === publicCatalogItemId && review.moderationStatus === "APPROVED"
    );
  }

  async createCommunityComment(comment: CommunityComment): Promise<CommunityComment> {
    return this.database.insert("community_comments", comment);
  }

  async updateCommunityComment(comment: CommunityComment): Promise<CommunityComment> {
    return this.database.upsert("community_comments", comment);
  }

  async findCommunityCommentById(id: string, organizationId: string): Promise<CommunityComment | null> {
    return this.database.findByIdForTenant<CommunityComment>("community_comments", id, organizationId);
  }

  async listApprovedComments(publicCatalogItemId: string): Promise<CommunityComment[]> {
    return this.database.select<CommunityComment>(
      "community_comments",
      (comment) => comment.publicCatalogItemId === publicCatalogItemId && comment.moderationStatus === "APPROVED"
    );
  }

  async createFlag(flag: CommunityFlag): Promise<CommunityFlag> {
    return this.database.insert("community_flags", flag);
  }

  async createModerationEvent(event: CommunityModerationEvent): Promise<CommunityModerationEvent> {
    return this.database.insert("community_moderation_events", event);
  }

  async appendAuditEvent(event: CollaborationAuditEvent): Promise<void> {
    this.database.insert("collaboration_audit_events", event);
  }
}
