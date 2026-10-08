import { Module } from "@nestjs/common";
import { LayoutPublishingModule } from "../layout-publishing/layout-publishing.module";
import { LexicographicModule } from "../lexicographic/lexicographic.module";
import { MultimediaCreationModule } from "../multimedia-creation/multimedia-creation.module";
import { runtimeDatabaseProvider } from "../runtime-database.provider";
import { SemanticFidelityModule } from "../semantic-fidelity/semantic-fidelity.module";
import { TerminologyModule } from "../terminology/terminology.module";
import { TranslationsModule } from "../translations/translations.module";
import { MediaLocalizationController } from "./media-localization.controller";
import { DatabaseMediaLocalizationRepository } from "./media-localization.repository";
import { MediaLocalizationService } from "./media-localization.service";

@Module({
  imports: [
    TranslationsModule,
    LexicographicModule,
    TerminologyModule,
    SemanticFidelityModule,
    MultimediaCreationModule,
    LayoutPublishingModule
  ],
  controllers: [MediaLocalizationController],
  providers: [
    runtimeDatabaseProvider,
    DatabaseMediaLocalizationRepository,
    MediaLocalizationService
  ],
  exports: [MediaLocalizationService]
})
export class MediaLocalizationModule {}
