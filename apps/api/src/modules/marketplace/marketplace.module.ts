import { Module } from "@nestjs/common";
import { runtimeDatabaseProvider } from "../runtime-database.provider";
import { MarketplaceController } from "./marketplace.controller";
import { DatabaseMarketplaceRepository } from "./marketplace.repository";
import { MarketplaceService } from "./marketplace.service";

@Module({
  controllers: [MarketplaceController],
  providers: [
    runtimeDatabaseProvider,
    DatabaseMarketplaceRepository,
    MarketplaceService
  ],
  exports: [MarketplaceService]
})
export class MarketplaceModule {}
