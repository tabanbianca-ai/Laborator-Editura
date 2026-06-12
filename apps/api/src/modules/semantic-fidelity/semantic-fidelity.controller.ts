import { Body, Controller, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { CurrentActor } from "../auth/request-context.decorator";
import { type AuthenticatedRequestContext } from "../auth/request-context.types";
import { SemanticFidelityService } from "./semantic-fidelity.service";
import {
  type ListSemanticIssuesInput,
  type SemanticDocumentInput,
  type SemanticFidelityIssueStatus,
  type SemanticFidelityRiskLevel,
  type SemanticSegmentInput
} from "./semantic-fidelity.types";

@Controller("semantic-fidelity")
export class SemanticFidelityController {
  constructor(private readonly semanticFidelityService: SemanticFidelityService) {}

  @Post("segments/run")
  runCheckOnSegment(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Body() input: SemanticSegmentInput
  ) {
    return this.semanticFidelityService.runCheckOnSegment(actor, input);
  }

  @Post("documents/run")
  runCheckOnDocument(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Body() input: SemanticDocumentInput
  ) {
    return this.semanticFidelityService.runCheckOnDocument(actor, input);
  }

  @Get("issues")
  listIssues(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Query() query: Record<string, string | undefined>
  ) {
    const input: ListSemanticIssuesInput = {
      projectId: query.projectId,
      documentId: query.documentId,
      segmentId: query.segmentId,
      status: query.status as SemanticFidelityIssueStatus | undefined,
      riskLevel: query.riskLevel as SemanticFidelityRiskLevel | undefined
    };

    return this.semanticFidelityService.listIssues(actor, input);
  }

  @Patch("issues/:id/resolve")
  markIssueResolved(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string
  ) {
    return this.semanticFidelityService.markIssueResolved(actor, id);
  }

  @Post("reports/:id/recalculate-score")
  recalculateSemanticScore(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string
  ) {
    return this.semanticFidelityService.recalculateSemanticScore(actor, id);
  }
}
