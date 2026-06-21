import { Module } from "@nestjs/common";
import { runtimeDatabaseProvider } from "../runtime-database.provider";
import { CommerceAdminController, PublicStoreController } from "./commerce.controller";
import { DatabaseCommerceRepository } from "./commerce.repository";
import { CommerceService } from "./commerce.service";

@Module({
  controllers: [CommerceAdminController, PublicStoreController],
  providers: [
    runtimeDatabaseProvider,
    DatabaseCommerceRepository,
    CommerceService
  ],
  exports: [CommerceService]
})
export class CommerceModule {}
