import { Module } from "@nestjs/common";
import { runtimeDatabaseProvider } from "../runtime-database.provider";
import { WorkspaceController } from "./workspace.controller";
import { DatabaseWorkspaceRepository } from "./workspace.repository";
import { WorkspaceService } from "./workspace.service";

@Module({
  controllers: [WorkspaceController],
  providers: [
    runtimeDatabaseProvider,
    DatabaseWorkspaceRepository,
    WorkspaceService
  ],
  exports: [WorkspaceService]
})
export class WorkspaceModule {}
