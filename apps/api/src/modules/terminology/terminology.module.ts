import { Module } from "@nestjs/common";
import { LexicographicModule } from "../lexicographic/lexicographic.module";
import { runtimeDatabaseProvider } from "../runtime-database.provider";
import { InMemoryTerminologyRepository } from "./terminology.repository";
import { TerminologyController } from "./terminology.controller";
import { TerminologyService } from "./terminology.service";

@Module({
  imports: [LexicographicModule],
  controllers: [TerminologyController],
  providers: [runtimeDatabaseProvider, InMemoryTerminologyRepository, TerminologyService],
  exports: [TerminologyService]
})
export class TerminologyModule {}
