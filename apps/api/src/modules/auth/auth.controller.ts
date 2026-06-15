import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CurrentActor } from "./request-context.decorator";
import { type AuthenticatedRequestContext } from "./request-context.types";
import { AuthService } from "./auth.service";
import { type InitiateFounderOwnershipTransferInput, type LoginInput } from "./auth.types";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  login(@Body() input: LoginInput) {
    return this.authService.login(input);
  }

  @Get("me")
  me(@CurrentActor() actor: AuthenticatedRequestContext) {
    return actor;
  }

  @Get("founder-protection")
  getFounderProtection(@CurrentActor() actor: AuthenticatedRequestContext) {
    return this.authService.getFounderProtection(actor);
  }

  @Post("founder-protection/recover")
  recoverFounderProtection(@CurrentActor() actor: AuthenticatedRequestContext) {
    return this.authService.recoverFounderProtection(actor);
  }

  @Post("founder-protection/transfer")
  initiateFounderOwnershipTransfer(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Body() input: InitiateFounderOwnershipTransferInput
  ) {
    return this.authService.initiateFounderOwnershipTransfer(actor, input);
  }

  @Post("founder-protection/transfer/:transferId/accept")
  acceptFounderOwnershipTransfer(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("transferId") transferId: string
  ) {
    return this.authService.acceptFounderOwnershipTransfer(actor, transferId);
  }

  @Post("founder-protection/transfer/:transferId/cancel")
  cancelFounderOwnershipTransfer(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("transferId") transferId: string
  ) {
    return this.authService.cancelFounderOwnershipTransfer(actor, transferId);
  }
}
