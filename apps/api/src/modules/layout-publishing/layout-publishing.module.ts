import { Module } from "@nestjs/common";
import { runtimeDatabaseProvider } from "../runtime-database.provider";
import { LayoutPublishingController } from "./layout-publishing.controller";
import { DatabaseLayoutPublicationRepository } from "./layout-publishing.repository";
import { LayoutPublishingService } from "./layout-publishing.service";

@Module({
  controllers: [LayoutPublishingController],
  providers: [
    runtimeDatabaseProvider,
    DatabaseLayoutPublicationRepository,
    LayoutPublishingService
  ],
  exports: [LayoutPublishingService]
})
export class LayoutPublishingModule {}
