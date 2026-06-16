import { Module } from "@nestjs/common";
import { ProjectsModule } from "../projects/projects.module";
import { runtimeDatabaseProvider } from "../runtime-database.provider";
import { DocumentsController } from "./documents.controller";
import { DatabaseDocumentsRepository } from "./documents.repository";
import { DocumentsService } from "./documents.service";

@Module({
  imports: [ProjectsModule],
  controllers: [DocumentsController],
  providers: [runtimeDatabaseProvider, DatabaseDocumentsRepository, DocumentsService],
  exports: [DocumentsService]
})
export class DocumentsModule {}
