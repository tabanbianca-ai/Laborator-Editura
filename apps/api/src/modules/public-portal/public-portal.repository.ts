import { Inject, Injectable } from "@nestjs/common";
import { getDefaultRuntimeDatabase, type FileBackedRuntimeDatabase } from "@laborator/db";
import { RUNTIME_DATABASE } from "../runtime-database.provider";
import {
  type PublicAccessRecord,
  type PublicCatalogItem,
  type PublicDistributionRecord,
  type PublicPortalAuditEvent,
  type PublicPortalRepository
} from "./public-portal.types";

@Injectable()
export class DatabasePublicPortalRepository implements PublicPortalRepository {
  constructor(
    @Inject(RUNTIME_DATABASE)
    private readonly database: FileBackedRuntimeDatabase = getDefaultRuntimeDatabase()
  ) {}

  async createCatalogItem(item: PublicCatalogItem): Promise<PublicCatalogItem> {
    return this.database.insert("public_catalog_items", item);
  }

  async updateCatalogItem(item: PublicCatalogItem): Promise<PublicCatalogItem> {
    return this.database.upsert("public_catalog_items", item);
  }

  async findCatalogItemById(id: string, organizationId: string): Promise<PublicCatalogItem | null> {
    return this.database.findByIdForTenant<PublicCatalogItem>("public_catalog_items", id, organizationId);
  }

  async findCatalogItemPublicById(id: string): Promise<PublicCatalogItem | null> {
    const item = this.database.findById<PublicCatalogItem>("public_catalog_items", id);

    return item?.availabilityStatus === "PUBLIC" ? item : null;
  }

  async listPublicCatalogItems(): Promise<PublicCatalogItem[]> {
    return this.database.select<PublicCatalogItem>(
      "public_catalog_items",
      (item) => item.availabilityStatus === "PUBLIC"
    );
  }

  async createDistributionRecord(record: PublicDistributionRecord): Promise<PublicDistributionRecord> {
    return this.database.insert("public_distribution_records", record);
  }

  async createAccessRecord(record: PublicAccessRecord): Promise<PublicAccessRecord> {
    return this.database.insert("public_access_records", record);
  }

  async appendAuditEvent(event: PublicPortalAuditEvent): Promise<void> {
    this.database.insert("public_portal_audit_events", event);
  }
}
