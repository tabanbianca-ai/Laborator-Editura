import { Module } from "@nestjs/common";
import { runtimeDatabaseProvider } from "../runtime-database.provider";
import { SecurityGovernanceController } from "./security-governance.controller";
import { DatabaseSecurityGovernanceRepository } from "./security-governance.repository";
import { SecurityGovernanceService } from "./security-governance.service";

@Module({
  controllers: [SecurityGovernanceController],
  providers: [
    runtimeDatabaseProvider,
    DatabaseSecurityGovernanceRepository,
    SecurityGovernanceService
  ],
  exports: [SecurityGovernanceService]
})
export class SecurityGovernanceModule {}
