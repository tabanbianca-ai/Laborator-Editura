import { Module } from "@nestjs/common";
import { LexicographicModule } from "../lexicographic/lexicographic.module";
import { runtimeDatabaseProvider } from "../runtime-database.provider";
import { SemanticFidelityModule } from "../semantic-fidelity/semantic-fidelity.module";
import { TerminologyModule } from "../terminology/terminology.module";
import { TranslationMemoryModule } from "../translation-memory/translation-memory.module";
import { EditorialDecisionController } from "./editorial-decisions.controller";
import { DatabaseEditorialDecisionRepository } from "./editorial-decisions.repository";
import { EditorialDecisionService } from "./editorial-decisions.service";

@Module({
  imports: [
    LexicographicModule,
    TerminologyModule,
    TranslationMemoryModule,
    SemanticFidelityModule
  ],
  controllers: [EditorialDecisionController],
  providers: [
    runtimeDatabaseProvider,
    DatabaseEditorialDecisionRepository,
    EditorialDecisionService
  ],
  exports: [EditorialDecisionService]
})
export class EditorialDecisionModule {}
