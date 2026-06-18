import { Module } from "@nestjs/common";
import { runtimeDatabaseProvider } from "../runtime-database.provider";
import { LexicographicController } from "./lexicographic.controller";
import { DatabaseLexicographicRepository } from "./lexicographic.repository";
import { LexicographicService } from "./lexicographic.service";

@Module({
  controllers: [LexicographicController],
  providers: [runtimeDatabaseProvider, DatabaseLexicographicRepository, LexicographicService],
  exports: [LexicographicService]
})
export class LexicographicModule {}
