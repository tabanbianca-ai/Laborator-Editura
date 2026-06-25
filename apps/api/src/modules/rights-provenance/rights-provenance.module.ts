import { Module } from "@nestjs/common";
import { runtimeDatabaseProvider } from "../runtime-database.provider";
import { RightsProvenanceController } from "./rights-provenance.controller";
import { DatabaseRightsProvenanceRepository } from "./rights-provenance.repository";
import { RightsProvenanceService } from "./rights-provenance.service";

@Module({
  controllers: [RightsProvenanceController],
  providers: [
    runtimeDatabaseProvider,
    DatabaseRightsProvenanceRepository,
    RightsProvenanceService
  ],
  exports: [RightsProvenanceService]
})
export class RightsProvenanceModule {}
