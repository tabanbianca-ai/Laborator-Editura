import { Module } from "@nestjs/common";
import { AiTranslationProviderModule } from "../ai-governance/ai-translation-provider.module";
import { WorkspaceModule } from "../workspace/workspace.module";
import { LinguisticAgentAdapter } from "./linguistic-agent.adapter";
import { LexicographicModule } from "../lexicographic/lexicographic.module";
import { DocumentsModule } from "../documents/documents.module";
import { QaModule } from "../qa/qa.module";
import { runtimeDatabaseProvider } from "../runtime-database.provider";
import { SemanticFidelityModule } from "../semantic-fidelity/semantic-fidelity.module";
import { SegmentsModule } from "../segments/segments.module";
import { TerminologyModule } from "../terminology/terminology.module";
import { TranslationMemoryModule } from "../translation-memory/translation-memory.module";
import { WorkflowModule } from "../workflow/workflow.module";
import { DatabaseTranslationsRepository } from "./translations.repository";
import { TranslationsController } from "./translations.controller";
import { TranslationsService } from "./translations.service";

@Module({
  imports: [
    AiTranslationProviderModule,
    WorkspaceModule,
    SegmentsModule,
    DocumentsModule,
    LexicographicModule,
    TranslationMemoryModule,
    TerminologyModule,
    QaModule,
    SemanticFidelityModule,
    WorkflowModule
  ],
  controllers: [TranslationsController],
  providers: [runtimeDatabaseProvider, DatabaseTranslationsRepository, TranslationsService, LinguisticAgentAdapter],
  exports: [TranslationsService, LinguisticAgentAdapter]
})
export class TranslationsModule {}
