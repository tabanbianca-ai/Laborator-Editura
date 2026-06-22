import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CurrentActor } from "../auth/request-context.decorator";
import { type AuthenticatedRequestContext } from "../auth/request-context.types";
import { CollaborationService } from "./collaboration.service";
import {
  type AddCollaborationCommentInput,
  type CreateCollaborationThreadInput,
  type CreateCommunityCommentInput,
  type CreateCommunityReviewInput,
  type FlagCommunityContentInput
} from "./collaboration.types";

@Controller("collaboration")
export class CollaborationController {
  constructor(private readonly collaborationService: CollaborationService) {}

  @Post("threads")
  createThread(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Body() input: CreateCollaborationThreadInput
  ) {
    return this.collaborationService.createThread(actor, input);
  }

  @Get("threads/:id")
  getThread(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string
  ) {
    return this.collaborationService.getThread(actor, id);
  }

  @Post("threads/:id/comments")
  addThreadComment(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string,
    @Body() input: AddCollaborationCommentInput
  ) {
    return this.collaborationService.addThreadComment(actor, id, input);
  }

  @Post("comments/:id/resolve")
  resolveComment(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string
  ) {
    return this.collaborationService.resolveComment(actor, id);
  }
}

@Controller("community")
export class CommunityModerationController {
  constructor(private readonly collaborationService: CollaborationService) {}

  @Post("reviews")
  createReview(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Body() input: CreateCommunityReviewInput
  ) {
    return this.collaborationService.createReview(actor, input);
  }

  @Post("comments")
  createCommunityComment(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Body() input: CreateCommunityCommentInput
  ) {
    return this.collaborationService.createCommunityComment(actor, input);
  }

  @Post("content/:id/approve")
  approveContent(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string
  ) {
    return this.collaborationService.approveContent(actor, id);
  }

  @Post("content/:id/reject")
  rejectContent(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string
  ) {
    return this.collaborationService.rejectContent(actor, id);
  }

  @Post("content/:id/flag")
  flagContent(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string,
    @Body() input: FlagCommunityContentInput
  ) {
    return this.collaborationService.flagContent(actor, id, input);
  }
}

@Controller("public/community")
export class PublicCommunityController {
  constructor(private readonly collaborationService: CollaborationService) {}

  @Get("catalog-items/:id/reviews")
  listPublicReviews(@Param("id") id: string) {
    return this.collaborationService.listPublicReviews(id);
  }

  @Get("catalog-items/:id/comments")
  listPublicComments(@Param("id") id: string) {
    return this.collaborationService.listPublicComments(id);
  }
}
