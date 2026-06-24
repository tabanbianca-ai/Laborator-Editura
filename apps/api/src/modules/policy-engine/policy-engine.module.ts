import { Module } from "@nestjs/common";
import { runtimeDatabaseProvider } from "../runtime-database.provider";
import { PolicyEngineController } from "./policy-engine.controller";
import { DatabasePolicyEngineRepository } from "./policy-engine.repository";
import { PolicyEngineService } from "./policy-engine.service";

@Module({
  controllers: [PolicyEngineController],
  providers: [
    runtimeDatabaseProvider,
    DatabasePolicyEngineRepository,
    PolicyEngineService
  ],
  exports: [PolicyEngineService]
})
export class PolicyEngineModule {}
