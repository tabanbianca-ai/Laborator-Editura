import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { RequestContextMiddleware } from "./auth/request-context.middleware";
import { DocumentsModule } from "./documents/documents.module";
import { ExportModule } from "./export/export.module";
import { HealthController } from "./health.controller";
import { ProjectsModule } from "./projects/projects.module";
import { QaModule } from "./qa/qa.module";
import { SemanticFidelityModule } from "./semantic-fidelity/semantic-fidelity.module";
import { SegmentsModule } from "./segments/segments.module";
import { TerminologyModule } from "./terminology/terminology.module";
import { TranslationMemoryModule } from "./translation-memory/translation-memory.module";
import { TranslationsModule } from "./translations/translations.module";
import { WorkflowModule } from "./workflow/workflow.module";

@Module({
  imports: [
    AuthModule,
    ProjectsModule,
    DocumentsModule,
    SegmentsModule,
    TranslationsModule,
    TranslationMemoryModule,
    TerminologyModule,
    QaModule,
    SemanticFidelityModule,
    WorkflowModule,
    ExportModule
  ],
  controllers: [HealthController],
  providers: [RequestContextMiddleware]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestContextMiddleware).forRoutes("*");
  }
}
