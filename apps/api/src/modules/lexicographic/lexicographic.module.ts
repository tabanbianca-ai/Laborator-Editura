import { Module } from "@nestjs/common";
import { LexicographicController } from "./lexicographic.controller";
import { InMemoryLexicographicRepository } from "./lexicographic.repository";
import { LexicographicService } from "./lexicographic.service";

@Module({
  controllers: [LexicographicController],
  providers: [InMemoryLexicographicRepository, LexicographicService],
  exports: [LexicographicService]
})
export class LexicographicModule {}
