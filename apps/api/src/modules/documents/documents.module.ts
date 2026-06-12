import { Module } from "@nestjs/common";
import { ProjectsModule } from "../projects/projects.module";
import { DocumentsController } from "./documents.controller";
import { DatabaseDocumentsRepository } from "./documents.repository";
import { DocumentsService } from "./documents.service";

@Module({
  imports: [ProjectsModule],
  controllers: [DocumentsController],
  providers: [DatabaseDocumentsRepository, DocumentsService],
  exports: [DocumentsService]
})
export class DocumentsModule {}
