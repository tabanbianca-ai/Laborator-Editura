import { Module } from "@nestjs/common";
import { runtimeDatabaseProvider } from "../runtime-database.provider";
import { MultimediaCreationController } from "./multimedia-creation.controller";
import { DatabaseMultimediaRepository } from "./multimedia-creation.repository";
import { MultimediaCreationService } from "./multimedia-creation.service";

@Module({
  controllers: [MultimediaCreationController],
  providers: [
    runtimeDatabaseProvider,
    DatabaseMultimediaRepository,
    MultimediaCreationService
  ],
  exports: [MultimediaCreationService]
})
export class MultimediaCreationModule {}
