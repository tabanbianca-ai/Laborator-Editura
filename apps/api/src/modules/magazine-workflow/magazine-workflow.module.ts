import { Module } from "@nestjs/common";
import { DocumentsModule } from "../documents/documents.module";
import { LayoutPublishingModule } from "../layout-publishing/layout-publishing.module";
import { ProjectsModule } from "../projects/projects.module";
import { RightsProvenanceModule } from "../rights-provenance/rights-provenance.module";
import { runtimeDatabaseProvider } from "../runtime-database.provider";
import { WorkflowModule } from "../workflow/workflow.module";
import { MagazineWorkflowController } from "./magazine-workflow.controller";
import { DatabaseMagazineWorkflowRepository } from "./magazine-workflow.repository";
import { MagazineWorkflowService } from "./magazine-workflow.service";

@Module({
  imports: [
    DocumentsModule,
    LayoutPublishingModule,
    ProjectsModule,
    RightsProvenanceModule,
    WorkflowModule
  ],
  controllers: [MagazineWorkflowController],
  providers: [
    runtimeDatabaseProvider,
    DatabaseMagazineWorkflowRepository,
    MagazineWorkflowService
  ],
  exports: [MagazineWorkflowService]
})
export class MagazineWorkflowModule {}
