import { Inject, Injectable } from "@nestjs/common";
import { getDefaultRuntimeDatabase, type FileBackedRuntimeDatabase } from "@laborator/db";
import { RUNTIME_DATABASE } from "../runtime-database.provider";
import {
  type LayoutPublicationAuditEvent,
  type LayoutPublicationPlan,
  type LayoutPublicationRepository,
  type PublishingDistributionRecord,
  type PublishingPreflightResult,
  type PublishingRecord
} from "./layout-publishing.types";

@Injectable()
export class DatabaseLayoutPublicationRepository implements LayoutPublicationRepository {
  constructor(
    @Inject(RUNTIME_DATABASE)
    private readonly database: FileBackedRuntimeDatabase = getDefaultRuntimeDatabase()
  ) {}

  async createPlan(plan: LayoutPublicationPlan): Promise<LayoutPublicationPlan> {
    return this.database.insert("layout_publication_plans", plan);
  }

  async updatePlan(plan: LayoutPublicationPlan): Promise<LayoutPublicationPlan> {
    return this.database.upsert("layout_publication_plans", plan);
  }

  async findPlanById(id: string, organizationId: string): Promise<LayoutPublicationPlan | null> {
    return this.database.findByIdForTenant<LayoutPublicationPlan>(
      "layout_publication_plans",
      id,
      organizationId
    );
  }

  async appendAuditEvent(event: LayoutPublicationAuditEvent): Promise<void> {
    this.database.insert("layout_publication_audit_events", event);
  }

  async createPreflightResult(result: PublishingPreflightResult): Promise<PublishingPreflightResult> {
    return this.database.insert("layout_publishing_preflight_results", result);
  }

  async findPreflightResultById(
    id: string,
    organizationId: string
  ): Promise<PublishingPreflightResult | null> {
    return this.database.findByIdForTenant<PublishingPreflightResult>(
      "layout_publishing_preflight_results",
      id,
      organizationId
    );
  }

  async createPublishingRecord(record: PublishingRecord): Promise<PublishingRecord> {
    return this.database.insert("layout_publishing_records", record);
  }

  async updatePublishingRecord(record: PublishingRecord): Promise<PublishingRecord> {
    return this.database.upsert("layout_publishing_records", record);
  }

  async findPublishingRecordById(
    id: string,
    organizationId: string
  ): Promise<PublishingRecord | null> {
    return this.database.findByIdForTenant<PublishingRecord>(
      "layout_publishing_records",
      id,
      organizationId
    );
  }

  async listPublishingRecords(
    publicationId: string,
    organizationId: string
  ): Promise<PublishingRecord[]> {
    return this.database.selectForTenant<PublishingRecord>(
      "layout_publishing_records",
      organizationId,
      (record) => record.publicationId === publicationId
    );
  }

  async createDistributionRecord(
    record: PublishingDistributionRecord
  ): Promise<PublishingDistributionRecord> {
    return this.database.insert("layout_publishing_distribution_records", record);
  }

  async updateDistributionRecord(
    record: PublishingDistributionRecord
  ): Promise<PublishingDistributionRecord> {
    return this.database.upsert("layout_publishing_distribution_records", record);
  }

  async findDistributionRecordById(
    id: string,
    organizationId: string
  ): Promise<PublishingDistributionRecord | null> {
    return this.database.findByIdForTenant<PublishingDistributionRecord>(
      "layout_publishing_distribution_records",
      id,
      organizationId
    );
  }

  async listDistributionRecords(
    publishingRecordId: string,
    organizationId: string
  ): Promise<PublishingDistributionRecord[]> {
    return this.database.selectForTenant<PublishingDistributionRecord>(
      "layout_publishing_distribution_records",
      organizationId,
      (record) => record.publishingRecordId === publishingRecordId
    );
  }
}
