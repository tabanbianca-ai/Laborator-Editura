import { Module } from "@nestjs/common";
import { runtimeDatabaseProvider } from "../runtime-database.provider";
import {
  GatewayController,
  IntegrationsController,
  WebhooksController
} from "./gateway.controller";
import { DatabaseGatewayRepository } from "./gateway.repository";
import { GatewayService } from "./gateway.service";

@Module({
  controllers: [GatewayController, IntegrationsController, WebhooksController],
  providers: [
    runtimeDatabaseProvider,
    DatabaseGatewayRepository,
    GatewayService
  ],
  exports: [GatewayService]
})
export class GatewayModule {}
