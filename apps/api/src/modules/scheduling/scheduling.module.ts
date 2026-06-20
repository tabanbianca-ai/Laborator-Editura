import { Module } from "@nestjs/common";
import { runtimeDatabaseProvider } from "../runtime-database.provider";
import { DatabaseSchedulingRepository } from "./scheduling.repository";
import { SchedulingController } from "./scheduling.controller";
import { SchedulingService } from "./scheduling.service";

@Module({
  controllers: [SchedulingController],
  providers: [
    runtimeDatabaseProvider,
    DatabaseSchedulingRepository,
    SchedulingService
  ],
  exports: [SchedulingService]
})
export class SchedulingModule {}
