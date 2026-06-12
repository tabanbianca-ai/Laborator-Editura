import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { CurrentActor } from "../auth/request-context.decorator";
import { type AuthenticatedRequestContext } from "../auth/request-context.types";
import { DocumentsService } from "./documents.service";
import { type CreateDocumentInput } from "./documents.types";

@Controller("documents")
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post()
  createDocument(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Body() input: CreateDocumentInput
  ) {
    return this.documentsService.createDocument(actor, input);
  }

  @Get()
  listDocuments(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Query("projectId") projectId?: string
  ) {
    return this.documentsService.listDocuments(actor, projectId);
  }

  @Get(":id")
  getDocument(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string
  ) {
    return this.documentsService.getDocument(actor, id);
  }
}
