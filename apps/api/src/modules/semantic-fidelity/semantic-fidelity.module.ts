import { Module } from "@nestjs/common";
import { QaModule } from "../qa/qa.module";
import { TerminologyModule } from "../terminology/terminology.module";
import { TranslationMemoryModule } from "../translation-memory/translation-memory.module";
import { InMemorySemanticFidelityRepository } from "./semantic-fidelity.repository";
import { SemanticFidelityController } from "./semantic-fidelity.controller";
import { SemanticFidelityService } from "./semantic-fidelity.service";

@Module({
  imports: [TerminologyModule, TranslationMemoryModule, QaModule],
  controllers: [SemanticFidelityController],
  providers: [InMemorySemanticFidelityRepository, SemanticFidelityService],
  exports: [SemanticFidelityService]
})
export class SemanticFidelityModule {}
