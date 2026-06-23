import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { AiGovernanceModule } from "./ai-governance/ai-governance.module";
import { AuthorStudioModule } from "./author-studio/author-studio.module";
import { AuthModule } from "./auth/auth.module";
import { BackupGovernanceModule } from "./backup-governance/backup-governance.module";
import { CommerceModule } from "./commerce/commerce.module";
import { CollaborationModule } from "./collaboration/collaboration.module";
import { RequestContextMiddleware } from "./auth/request-context.middleware";
import { DocumentsModule } from "./documents/documents.module";
import { EditorialDecisionModule } from "./editorial-decisions/editorial-decisions.module";
import { ExportModule } from "./export/export.module";
import { GatewayModule } from "./gateway/gateway.module";
import { HealthController } from "./health.controller";
import { LayoutPublishingModule } from "./layout-publishing/layout-publishing.module";
import { LibraryModule } from "./library/library.module";
import { LexicographicModule } from "./lexicographic/lexicographic.module";
import { MediaLocalizationModule } from "./media-localization/media-localization.module";
import { MultimediaCreationModule } from "./multimedia-creation/multimedia-creation.module";
import { ObservabilityModule } from "./observability/observability.module";
import { PlatformEngineeringModule } from "./platform-engineering/platform-engineering.module";
import { ProjectsModule } from "./projects/projects.module";
import { PublicPortalModule } from "./public-portal/public-portal.module";
import { QaModule } from "./qa/qa.module";
import { RateLimitMiddleware } from "./security/rate-limit.middleware";
import { ResearchModule } from "./research/research.module";
import { SecurityGovernanceModule } from "./security-governance/security-governance.module";
import { SecurityHeadersMiddleware } from "./security/security-headers.middleware";
import { SemanticFidelityModule } from "./semantic-fidelity/semantic-fidelity.module";
import { SegmentsModule } from "./segments/segments.module";
import { SchedulingModule } from "./scheduling/scheduling.module";
import { TerminologyModule } from "./terminology/terminology.module";
import { TranslationMemoryModule } from "./translation-memory/translation-memory.module";
import { TranslationsModule } from "./translations/translations.module";
import { WorkflowModule } from "./workflow/workflow.module";

@Module({
  imports: [
    AiGovernanceModule,
    AuthModule,
    AuthorStudioModule,
    BackupGovernanceModule,
    CommerceModule,
    CollaborationModule,
    ProjectsModule,
    DocumentsModule,
    SegmentsModule,
    TranslationsModule,
    LexicographicModule,
    TranslationMemoryModule,
    TerminologyModule,
    QaModule,
    SemanticFidelityModule,
    EditorialDecisionModule,
    GatewayModule,
    LayoutPublishingModule,
    LibraryModule,
    MediaLocalizationModule,
    MultimediaCreationModule,
    ObservabilityModule,
    PlatformEngineeringModule,
    PublicPortalModule,
    ResearchModule,
    SecurityGovernanceModule,
    SchedulingModule,
    WorkflowModule,
    ExportModule
  ],
  controllers: [HealthController],
  providers: [SecurityHeadersMiddleware, RateLimitMiddleware, RequestContextMiddleware]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(SecurityHeadersMiddleware, RateLimitMiddleware, RequestContextMiddleware)
      .forRoutes("*");
  }
}
