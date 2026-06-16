import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { DocumentsModule } from "../documents/documents.module";
import { ProjectsModule } from "../projects/projects.module";
import { runtimeDatabaseProvider } from "../runtime-database.provider";
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
  providers: [runtimeDatabaseProvider, DatabaseExportRepository, ExportService],
  exports: [ExportService]
})
export class ExportModule {}
