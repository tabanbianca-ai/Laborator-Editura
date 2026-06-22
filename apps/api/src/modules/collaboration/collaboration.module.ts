import { Module } from "@nestjs/common";
import { runtimeDatabaseProvider } from "../runtime-database.provider";
import {
  CollaborationController,
  CommunityModerationController,
  PublicCommunityController
} from "./collaboration.controller";
import { DatabaseCollaborationRepository } from "./collaboration.repository";
import { CollaborationService } from "./collaboration.service";

@Module({
  controllers: [CollaborationController, CommunityModerationController, PublicCommunityController],
  providers: [
    runtimeDatabaseProvider,
    DatabaseCollaborationRepository,
    CollaborationService
  ],
  exports: [CollaborationService]
})
export class CollaborationModule {}
