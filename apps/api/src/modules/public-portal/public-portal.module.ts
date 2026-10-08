import { Module } from "@nestjs/common";
import { runtimeDatabaseProvider } from "../runtime-database.provider";
import {
  PublicCatalogController,
  PublicPortalAdminController
} from "./public-portal.controller";
import { DatabasePublicPortalRepository } from "./public-portal.repository";
import { PublicPortalService } from "./public-portal.service";

@Module({
  controllers: [PublicPortalAdminController, PublicCatalogController],
  providers: [
    runtimeDatabaseProvider,
    DatabasePublicPortalRepository,
    PublicPortalService
  ],
  exports: [PublicPortalService]
})
export class PublicPortalModule {}
