import { Body, Controller, Get, Headers, Param, Post } from "@nestjs/common";
import { CurrentActor } from "./request-context.decorator";
import { type AuthenticatedRequestContext } from "./request-context.types";
import { AuthService } from "./auth.service";
import {
  type ChangePasswordInput,
  type InitiateFounderOwnershipTransferInput,
  type LoginInput,
  type RequestPasswordResetInput,
  type UpdateProfileInput,
  type VerifyEmailInput
} from "./auth.types";

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

  @Get("profile")
  profile(@CurrentActor() actor: AuthenticatedRequestContext) {
    return this.authService.getProfile(actor);
  }

  @Post("profile")
  updateProfile(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Body() input: UpdateProfileInput
  ) {
    return this.authService.updateProfile(actor, input);
  }

  @Get("session")
  session(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Headers("authorization") authorization?: string
  ) {
    return this.authService.verifySession(actor, this.readBearerToken(authorization));
  }

  @Post("session/refresh")
  refreshSession(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Headers("authorization") authorization?: string
  ) {
    return this.authService.refreshSession(actor, this.readBearerToken(authorization));
  }

  @Post("logout")
  logout(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Headers("authorization") authorization?: string
  ) {
    return this.authService.logout(actor, this.readBearerToken(authorization));
  }

  @Post("password/reset")
  requestPasswordReset(@Body() input: RequestPasswordResetInput) {
    return this.authService.requestPasswordReset(input);
  }

  @Post("password/change")
  changePassword(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Body() input: ChangePasswordInput
  ) {
    return this.authService.changePassword(actor, input);
  }

  @Post("email/verify")
  verifyEmail(@Body() input: VerifyEmailInput) {
    return this.authService.verifyEmail(input);
  }

  @Get("sessions")
  listSessions(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Headers("authorization") authorization?: string
  ) {
    return this.authService.listActiveSessions(actor, this.readBearerToken(authorization));
  }

  @Post("sessions/:sessionId/revoke")
  revokeSession(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("sessionId") sessionId: string
  ) {
    return this.authService.revokeSession(actor, sessionId);
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

  private readBearerToken(authorization: string | undefined): string {
    if (!authorization?.toLocaleLowerCase().startsWith("bearer ")) {
      return "";
    }

    return authorization.slice("bearer ".length).trim();
  }
}
