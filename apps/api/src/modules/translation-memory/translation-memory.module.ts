import { Module } from "@nestjs/common";
import { TranslationMemoryController } from "./translation-memory.controller";
import { InMemoryTranslationMemoryRepository } from "./translation-memory.repository";
import { TranslationMemoryService } from "./translation-memory.service";

@Module({
  controllers: [TranslationMemoryController],
  providers: [InMemoryTranslationMemoryRepository, TranslationMemoryService],
  exports: [TranslationMemoryService]
})
export class TranslationMemoryModule {}
