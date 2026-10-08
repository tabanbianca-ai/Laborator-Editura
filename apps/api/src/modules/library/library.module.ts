import { Module } from "@nestjs/common";
import { runtimeDatabaseProvider } from "../runtime-database.provider";
import { LibraryController } from "./library.controller";
import { DatabaseLibraryRepository } from "./library.repository";
import { LibraryService } from "./library.service";

@Module({
  controllers: [LibraryController],
  providers: [
    runtimeDatabaseProvider,
    DatabaseLibraryRepository,
    LibraryService
  ],
  exports: [LibraryService]
})
export class LibraryModule {}
