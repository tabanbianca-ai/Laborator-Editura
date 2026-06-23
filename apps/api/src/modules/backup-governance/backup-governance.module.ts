import { Module } from "@nestjs/common";
import { runtimeDatabaseProvider } from "../runtime-database.provider";
import { BackupGovernanceController } from "./backup-governance.controller";
import { DatabaseBackupGovernanceRepository } from "./backup-governance.repository";
import { BackupGovernanceService } from "./backup-governance.service";

@Module({
  controllers: [BackupGovernanceController],
  providers: [
    runtimeDatabaseProvider,
    DatabaseBackupGovernanceRepository,
    BackupGovernanceService
  ],
  exports: [BackupGovernanceService]
})
export class BackupGovernanceModule {}
