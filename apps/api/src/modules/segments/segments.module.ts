import { Module } from "@nestjs/common";
import { DocumentsModule } from "../documents/documents.module";
import { runtimeDatabaseProvider } from "../runtime-database.provider";
import { WorkflowModule } from "../workflow/workflow.module";
import { DocumentImportController } from "./document-import.controller";
import { DocumentImportService } from "./document-import.service";
import { SegmentsController } from "./segments.controller";
import { DatabaseSegmentsRepository } from "./segments.repository";
import { SegmentsService } from "./segments.service";

@Module({
  imports: [DocumentsModule, WorkflowModule],
  controllers: [SegmentsController, DocumentImportController],
  providers: [
    runtimeDatabaseProvider,
    DatabaseSegmentsRepository,
    SegmentsService,
    DocumentImportService
  ],
  exports: [SegmentsService]
})
export class SegmentsModule {}
