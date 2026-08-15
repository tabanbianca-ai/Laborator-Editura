import { Module } from "@nestjs/common";
import { VpsOperationsController } from "./vps-operations.controller";
import { VpsOperationsService } from "./vps-operations.service";

@Module({
  controllers: [VpsOperationsController],
  providers: [VpsOperationsService]
})
export class VpsOperationsModule {}
