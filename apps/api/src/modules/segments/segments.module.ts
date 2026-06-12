import { Module } from "@nestjs/common";
import { DocumentsModule } from "../documents/documents.module";
import { SegmentsController } from "./segments.controller";
import { DatabaseSegmentsRepository } from "./segments.repository";
import { SegmentsService } from "./segments.service";

@Module({
  imports: [DocumentsModule],
  controllers: [SegmentsController],
  providers: [DatabaseSegmentsRepository, SegmentsService],
  exports: [SegmentsService]
})
export class SegmentsModule {}
