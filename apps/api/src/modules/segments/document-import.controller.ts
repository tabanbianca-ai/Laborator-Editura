import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { CurrentActor } from "../auth/request-context.decorator";
import { type AuthenticatedRequestContext } from "../auth/request-context.types";
import { type DocxImportInput, type UploadedDocxFile } from "../documents/documents.types";
import { DocumentImportService } from "./document-import.service";

@Controller("documents")
export class DocumentImportController {
  constructor(private readonly documentImportService: DocumentImportService) {}

  @Post("import-docx")
  @UseInterceptors(FileInterceptor("file", {
    limits: {
      fileSize: 8 * 1024 * 1024,
      files: 1
    }
  }))
  importDocx(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @UploadedFile() file: UploadedDocxFile | undefined,
    @Body() input: DocxImportInput
  ) {
    return this.documentImportService.importDocx(actor, file, input);
  }
}
