import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CurrentActor } from "../auth/request-context.decorator";
import { type AuthenticatedRequestContext } from "../auth/request-context.types";
import { LaunchEssentialsService } from "./launch-essentials.service";
import {
  type AcceptGdprConsentInput,
  type DisableMfaMetadataInput,
  type EnableMfaMetadataInput,
  type RotateSecretMetadataInput,
  type StoreSecretMetadataInput
} from "./launch-essentials.types";

@Controller("launch-essentials")
export class LaunchEssentialsController {
  constructor(private readonly launchEssentialsService: LaunchEssentialsService) {}

  @Get("mfa")
  listMfa(@CurrentActor() actor: AuthenticatedRequestContext) {
    return this.launchEssentialsService.listMfaRecords(actor);
  }

  @Post("mfa/enable")
  enableMfa(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Body() input: EnableMfaMetadataInput
  ) {
    return this.launchEssentialsService.enableMfaMetadata(actor, input);
  }

  @Post("mfa/disable")
  disableMfa(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Body() input: DisableMfaMetadataInput
  ) {
    return this.launchEssentialsService.disableMfaMetadata(actor, input);
  }

  @Get("gdpr/consents")
  listMyConsents(@CurrentActor() actor: AuthenticatedRequestContext) {
    return this.launchEssentialsService.listMyConsents(actor);
  }

  @Post("gdpr/consents")
  acceptConsent(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Body() input: AcceptGdprConsentInput
  ) {
    return this.launchEssentialsService.acceptConsent(actor, input);
  }

  @Post("gdpr/consents/:id/withdraw")
  withdrawConsent(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string
  ) {
    return this.launchEssentialsService.withdrawConsent(actor, id);
  }

  @Post("gdpr/export-requests")
  requestPersonalDataExport(@CurrentActor() actor: AuthenticatedRequestContext) {
    return this.launchEssentialsService.requestPersonalDataExport(actor);
  }

  @Post("gdpr/deletion-requests")
  requestAccountDeletion(@CurrentActor() actor: AuthenticatedRequestContext) {
    return this.launchEssentialsService.requestAccountDeletion(actor);
  }

  @Get("secrets")
  listSecrets(@CurrentActor() actor: AuthenticatedRequestContext) {
    return this.launchEssentialsService.listSecrets(actor);
  }

  @Post("secrets")
  storeSecret(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Body() input: StoreSecretMetadataInput
  ) {
    return this.launchEssentialsService.storeSecretMetadata(actor, input);
  }

  @Post("secrets/:id/rotate")
  rotateSecret(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string,
    @Body() input: RotateSecretMetadataInput
  ) {
    return this.launchEssentialsService.rotateSecretMetadata(actor, id, input);
  }

  @Post("secrets/:id/access")
  recordSecretAccess(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string
  ) {
    return this.launchEssentialsService.recordSecretAccess(actor, id);
  }

  @Get("audit")
  listAudit(@CurrentActor() actor: AuthenticatedRequestContext) {
    return this.launchEssentialsService.listAudit(actor);
  }
}
