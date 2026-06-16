import { Module } from "@nestjs/common";
import { DocumentsModule } from "../documents/documents.module";
import { runtimeDatabaseProvider } from "../runtime-database.provider";
import { SegmentsController } from "./segments.controller";
import { DatabaseSegmentsRepository } from "./segments.repository";
import { SegmentsService } from "./segments.service";

@Module({
  imports: [DocumentsModule],
  controllers: [SegmentsController],
  providers: [runtimeDatabaseProvider, DatabaseSegmentsRepository, SegmentsService],
  exports: [SegmentsService]
})
export class SegmentsModule {}
