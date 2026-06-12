import { Body, Controller, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { CurrentActor } from "../auth/request-context.decorator";
import { type AuthenticatedRequestContext } from "../auth/request-context.types";
import { QaService } from "./qa.service";
import {
  type ListQaIssuesInput,
  type QaDocumentInput,
  type QaIssueSeverity,
  type QaIssueStatus,
  type QaSegmentInput
} from "./qa.types";

@Controller("qa")
export class QaController {
  constructor(private readonly qaService: QaService) {}

  @Post("segments/run")
  runQaOnSegment(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Body() input: QaSegmentInput
  ) {
    return this.qaService.runQaOnSegment(actor, input);
  }

  @Post("documents/run")
  runQaOnDocument(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Body() input: QaDocumentInput
  ) {
    return this.qaService.runQaOnDocument(actor, input);
  }

  @Get("issues")
  listIssues(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Query() query: Record<string, string | undefined>
  ) {
    const input: ListQaIssuesInput = {
      projectId: query.projectId,
      documentId: query.documentId,
      segmentId: query.segmentId,
      status: query.status as QaIssueStatus | undefined,
      severity: query.severity as QaIssueSeverity | undefined
    };

    return this.qaService.listIssues(actor, input);
  }

  @Patch("issues/:id/resolve")
  markIssueResolved(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string
  ) {
    return this.qaService.markIssueResolved(actor, id);
  }

  @Post("reports/:id/recalculate-score")
  recalculateQaScore(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string
  ) {
    return this.qaService.recalculateQaScore(actor, id);
  }
}
