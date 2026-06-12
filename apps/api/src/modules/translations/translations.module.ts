import { Module } from "@nestjs/common";
import { QaModule } from "../qa/qa.module";
import { SemanticFidelityModule } from "../semantic-fidelity/semantic-fidelity.module";
import { SegmentsModule } from "../segments/segments.module";
import { TerminologyModule } from "../terminology/terminology.module";
import { TranslationMemoryModule } from "../translation-memory/translation-memory.module";
import { DatabaseTranslationsRepository } from "./translations.repository";
import { TranslationsController } from "./translations.controller";
import { TranslationsService } from "./translations.service";

@Module({
  imports: [
    SegmentsModule,
    TranslationMemoryModule,
    TerminologyModule,
    QaModule,
    SemanticFidelityModule
  ],
  controllers: [TranslationsController],
  providers: [DatabaseTranslationsRepository, TranslationsService],
  exports: [TranslationsService]
})
export class TranslationsModule {}
