import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CurrentActor } from "../auth/request-context.decorator";
import { type AuthenticatedRequestContext } from "../auth/request-context.types";
import { WorkflowDefinitionService } from "./workflow-definition.service";
import {
  type CreateWorkflowDefinitionInput,
  type CreateWorkflowVersionInput,
  type RecordWorkflowApprovalInput,
  type StartConfigurableWorkflowInput,
  type TransitionConfigurableWorkflowInput
} from "./workflow.types";

@Controller()
export class WorkflowDefinitionController {
  constructor(private readonly workflowDefinitionService: WorkflowDefinitionService) {}

  @Post("workflows")
  createDefinition(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Body() input: CreateWorkflowDefinitionInput
  ) {
    return this.workflowDefinitionService.createDefinition(actor, input);
  }

  @Get("workflows")
  listDefinitions(@CurrentActor() actor: AuthenticatedRequestContext) {
    return this.workflowDefinitionService.listDefinitions(actor);
  }

  @Get("workflows/:id/versions")
  listVersions(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string
  ) {
    return this.workflowDefinitionService.listVersions(actor, id);
  }

  @Post("workflows/:id/versions")
  createVersion(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string,
    @Body() input: CreateWorkflowVersionInput
  ) {
    return this.workflowDefinitionService.createVersion(actor, id, input);
  }

  @Post("workflows/:id/versions/:versionId/activate")
  activateVersion(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string,
    @Param("versionId") versionId: string
  ) {
    return this.workflowDefinitionService.activateVersion(actor, id, versionId);
  }

  @Post("workflow-instances")
  startInstance(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Body() input: StartConfigurableWorkflowInput
  ) {
    return this.workflowDefinitionService.startInstance(actor, input);
  }

  @Get("workflow-instances/:id")
  getInstance(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string
  ) {
    return this.workflowDefinitionService.getInstance(actor, id);
  }

  @Post("workflow-instances/:id/transition")
  transitionInstance(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string,
    @Body() input: TransitionConfigurableWorkflowInput
  ) {
    return this.workflowDefinitionService.transitionInstance(actor, id, input);
  }

  @Post("workflow-instances/:id/approvals")
  recordApproval(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string,
    @Body() input: RecordWorkflowApprovalInput
  ) {
    return this.workflowDefinitionService.recordApproval(actor, id, input);
  }
}
