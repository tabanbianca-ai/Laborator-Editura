import { Module } from "@nestjs/common";
import { TerminologyModule } from "../terminology/terminology.module";
import { QaController } from "./qa.controller";
import { InMemoryQaRepository } from "./qa.repository";
import { QaService } from "./qa.service";

@Module({
  imports: [TerminologyModule],
  controllers: [QaController],
  providers: [InMemoryQaRepository, QaService],
  exports: [QaService]
})
export class QaModule {}
