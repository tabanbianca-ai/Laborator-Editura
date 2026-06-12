import { Module } from "@nestjs/common";
import { InMemoryTerminologyRepository } from "./terminology.repository";
import { TerminologyController } from "./terminology.controller";
import { TerminologyService } from "./terminology.service";

@Module({
  controllers: [TerminologyController],
  providers: [InMemoryTerminologyRepository, TerminologyService],
  exports: [TerminologyService]
})
export class TerminologyModule {}
