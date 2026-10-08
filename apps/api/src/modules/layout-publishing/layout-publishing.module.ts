import { Module } from "@nestjs/common";
import { ExportModule } from "../export/export.module";
import { LibraryModule } from "../library/library.module";
import { ProjectsModule } from "../projects/projects.module";
import { RightsProvenanceModule } from "../rights-provenance/rights-provenance.module";
import { runtimeDatabaseProvider } from "../runtime-database.provider";
import { WorkflowModule } from "../workflow/workflow.module";
import { LayoutPublishingController } from "./layout-publishing.controller";
import { DatabaseLayoutPublicationRepository } from "./layout-publishing.repository";
import { LayoutPublishingService } from "./layout-publishing.service";

@Module({
  imports: [
    ExportModule,
    LibraryModule,
    ProjectsModule,
    RightsProvenanceModule,
    WorkflowModule
  ],
  controllers: [LayoutPublishingController],
  providers: [
    runtimeDatabaseProvider,
    DatabaseLayoutPublicationRepository,
    LayoutPublishingService
  ],
  exports: [LayoutPublishingService]
})
export class LayoutPublishingModule {}
