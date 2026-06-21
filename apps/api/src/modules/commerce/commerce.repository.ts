import { Inject, Injectable } from "@nestjs/common";
import { getDefaultRuntimeDatabase, type FileBackedRuntimeDatabase } from "@laborator/db";
import { RUNTIME_DATABASE } from "../runtime-database.provider";
import {
  type CommerceAuditEvent,
  type CommerceDistributionChannel,
  type CommerceEdition,
  type CommercePrintProfile,
  type CommerceRepository
} from "./commerce.types";

@Injectable()
export class DatabaseCommerceRepository implements CommerceRepository {
  constructor(
    @Inject(RUNTIME_DATABASE)
    private readonly database: FileBackedRuntimeDatabase = getDefaultRuntimeDatabase()
  ) {}

  async createEdition(edition: CommerceEdition): Promise<CommerceEdition> {
    return this.database.insert("commerce_editions", edition);
  }

  async updateEdition(edition: CommerceEdition): Promise<CommerceEdition> {
    return this.database.upsert("commerce_editions", edition);
  }

  async findEditionById(id: string, organizationId: string): Promise<CommerceEdition | null> {
    return this.database.findByIdForTenant<CommerceEdition>("commerce_editions", id, organizationId);
  }

  async listPublicStoreEditions(): Promise<CommerceEdition[]> {
    return this.database.select<CommerceEdition>(
      "commerce_editions",
      (edition) => edition.approvalStatus === "APPROVED" && edition.availabilityStatus === "AVAILABLE"
    );
  }

  async createDistributionChannel(
    channel: CommerceDistributionChannel
  ): Promise<CommerceDistributionChannel> {
    return this.database.insert("commerce_distribution_channels", channel);
  }

  async createPrintProfile(profile: CommercePrintProfile): Promise<CommercePrintProfile> {
    return this.database.insert("commerce_print_profiles", profile);
  }

  async appendAuditEvent(event: CommerceAuditEvent): Promise<void> {
    this.database.insert("commerce_audit_events", event);
  }
}
