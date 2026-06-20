import { Module } from "@nestjs/common";
import { runtimeDatabaseProvider } from "../runtime-database.provider";
import { PlatformEngineeringController } from "./platform-engineering.controller";
import { DatabasePlatformEngineeringRepository } from "./platform-engineering.repository";
import { PlatformEngineeringService } from "./platform-engineering.service";

@Module({
  controllers: [PlatformEngineeringController],
  providers: [
    runtimeDatabaseProvider,
    DatabasePlatformEngineeringRepository,
    PlatformEngineeringService
  ],
  exports: [PlatformEngineeringService]
})
export class PlatformEngineeringModule {}
