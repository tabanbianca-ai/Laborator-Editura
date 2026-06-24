import { Module } from "@nestjs/common";
import { runtimeDatabaseProvider } from "../runtime-database.provider";
import { LaunchEssentialsController } from "./launch-essentials.controller";
import { DatabaseLaunchEssentialsRepository } from "./launch-essentials.repository";
import { LaunchEssentialsService } from "./launch-essentials.service";

@Module({
  controllers: [LaunchEssentialsController],
  providers: [
    runtimeDatabaseProvider,
    DatabaseLaunchEssentialsRepository,
    LaunchEssentialsService
  ],
  exports: [LaunchEssentialsService]
})
export class LaunchEssentialsModule {}
