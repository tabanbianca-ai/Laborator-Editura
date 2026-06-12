import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { DatabaseAuthRepository } from "./auth.repository";
import { AuthService } from "./auth.service";
import { RequestContextMiddleware } from "./request-context.middleware";

@Module({
  controllers: [AuthController],
  providers: [DatabaseAuthRepository, AuthService, RequestContextMiddleware],
  exports: [AuthService, RequestContextMiddleware]
})
export class AuthModule {}
