import { Module } from "@nestjs/common";
import { runtimeDatabaseProvider } from "../runtime-database.provider";
import { AuthorStudioController } from "./author-studio.controller";
import { DatabaseAuthorStudioRepository } from "./author-studio.repository";
import { AuthorStudioService } from "./author-studio.service";

@Module({
  controllers: [AuthorStudioController],
  providers: [
    runtimeDatabaseProvider,
    DatabaseAuthorStudioRepository,
    AuthorStudioService
  ],
  exports: [AuthorStudioService]
})
export class AuthorStudioModule {}
