import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { CurrentActor } from "../auth/request-context.decorator";
import { type AuthenticatedRequestContext } from "../auth/request-context.types";
import { WorkflowService } from "./workflow.service";
import {
  type AdvanceWorkflowInput,
  type BlockWorkflowInput,
  type StartWorkflowInput,
  type UnblockWorkflowInput,
  type WorkflowTargetInput
} from "./workflow.types";

@Controller("workflow")
export class WorkflowController {
  constructor(private readonly workflowService: WorkflowService) {}

  @Post("start")
  startWorkflow(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Body() input: StartWorkflowInput
  ) {
    return this.workflowService.startWorkflow(actor, input);
  }

  @Get("status")
  getWorkflowStatus(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Query() query: Record<string, string | undefined>
  ) {
    return this.workflowService.getWorkflowStatus(actor, this.toTarget(query));
  }

  @Post("advance")
  advanceWorkflow(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Body() input: AdvanceWorkflowInput
  ) {
    return this.workflowService.advanceWorkflow(actor, input);
  }

  @Post("block")
  blockWorkflow(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Body() input: BlockWorkflowInput
  ) {
    return this.workflowService.blockWorkflow(actor, input);
  }

  @Post("unblock")
  unblockWorkflow(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Body() input: UnblockWorkflowInput
  ) {
    return this.workflowService.unblockWorkflow(actor, input);
  }

  @Post("approve")
  approveDocument(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Body() input: WorkflowTargetInput
  ) {
    return this.workflowService.approveDocument(actor, input);
  }

  @Post("ready-for-export")
  markReadyForExport(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Body() input: WorkflowTargetInput
  ) {
    return this.workflowService.markReadyForExport(actor, input);
  }

  @Post("exported")
  markExported(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Body() input: WorkflowTargetInput
  ) {
    return this.workflowService.markExported(actor, input);
  }

  private toTarget(query: Record<string, string | undefined>): WorkflowTargetInput {
    return {
      projectId: query.projectId,
      documentId: query.documentId ?? "",
      segmentId: query.segmentId
    };
  }

}
