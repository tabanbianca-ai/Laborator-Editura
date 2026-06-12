import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { DocumentsModule } from "../documents/documents.module";
import { ProjectsModule } from "../projects/projects.module";
import { SegmentsModule } from "../segments/segments.module";
import { TranslationsModule } from "../translations/translations.module";
import { WorkflowModule } from "../workflow/workflow.module";
import { ExportController } from "./export.controller";
import { DatabaseExportRepository } from "./export.repository";
import { ExportService } from "./export.service";

@Module({
  imports: [
    AuthModule,
    ProjectsModule,
    DocumentsModule,
    SegmentsModule,
    TranslationsModule,
    WorkflowModule
  ],
  controllers: [ExportController],
  providers: [DatabaseExportRepository, ExportService],
  exports: [ExportService]
})
export class ExportModule {}
