import { Module } from "@nestjs/common";
import { runtimeDatabaseProvider } from "../runtime-database.provider";
import { ObservabilityController } from "./observability.controller";
import { DatabaseObservabilityRepository } from "./observability.repository";
import { ObservabilityService } from "./observability.service";

@Module({
  controllers: [ObservabilityController],
  providers: [
    runtimeDatabaseProvider,
    DatabaseObservabilityRepository,
    ObservabilityService
  ],
  exports: [ObservabilityService]
})
export class ObservabilityModule {}
