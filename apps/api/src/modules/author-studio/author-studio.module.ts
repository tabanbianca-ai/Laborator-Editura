import { Module } from "@nestjs/common";
import { runtimeDatabaseProvider } from "../runtime-database.provider";
import { AuthorStudioController } from "./author-studio.controller";
import { DatabaseAuthorStudioRepository } from "./author-studio.repository";
import { AuthorStudioService } from "./author-studio.service";
import { ManuscriptsAgentAdapter } from "./manuscripts-agent.adapter";

@Module({
  controllers: [AuthorStudioController],
  providers: [
    runtimeDatabaseProvider,
    DatabaseAuthorStudioRepository,
    AuthorStudioService,
    ManuscriptsAgentAdapter
  ],
  exports: [AuthorStudioService, ManuscriptsAgentAdapter]
})
export class AuthorStudioModule {}
