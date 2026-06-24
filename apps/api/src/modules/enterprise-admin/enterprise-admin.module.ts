import { Module } from "@nestjs/common";
import { runtimeDatabaseProvider } from "../runtime-database.provider";
import { EnterpriseAdminController } from "./enterprise-admin.controller";
import { DatabaseEnterpriseAdminRepository } from "./enterprise-admin.repository";
import { EnterpriseAdminService } from "./enterprise-admin.service";

@Module({
  controllers: [EnterpriseAdminController],
  providers: [
    runtimeDatabaseProvider,
    DatabaseEnterpriseAdminRepository,
    EnterpriseAdminService
  ],
  exports: [EnterpriseAdminService]
})
export class EnterpriseAdminModule {}
