import { Inject, Injectable } from "@nestjs/common";
import { getDefaultRuntimeDatabase, type FileBackedRuntimeDatabase } from "@laborator/db";
import { RUNTIME_DATABASE } from "../runtime-database.provider";
import {
  type LayoutPublicationAuditEvent,
  type LayoutPublicationPlan,
  type LayoutPublicationRepository
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
}
