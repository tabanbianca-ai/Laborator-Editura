import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CurrentActor } from "../auth/request-context.decorator";
import { type AuthenticatedRequestContext } from "../auth/request-context.types";
import { ExportService } from "./export.service";
import { type ExportDocumentInput } from "./export.types";

@Controller("export")
export class ExportController {
  constructor(private readonly exportService: ExportService) {}

  @Post("documents/:documentId/json-master")
  exportDocument(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("documentId") documentId: string,
    @Body() input: Omit<ExportDocumentInput, "documentId">
  ) {
    return this.exportService.exportDocument(actor, {
      ...input,
      documentId
    });
  }

  @Get("artifacts/:id")
  getArtifact(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string
  ) {
    return this.exportService.getArtifact(actor, id);
  }
}
