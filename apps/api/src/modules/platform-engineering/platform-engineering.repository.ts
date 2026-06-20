import { Inject, Injectable } from "@nestjs/common";
import { getDefaultRuntimeDatabase, type FileBackedRuntimeDatabase } from "@laborator/db";
import { RUNTIME_DATABASE } from "../runtime-database.provider";
import {
  type AgentCoordinationRun,
  type PlatformEngineeringAuditEvent,
  type PlatformEngineeringPlan,
  type PlatformEngineeringRepository
} from "./platform-engineering.types";

@Injectable()
export class DatabasePlatformEngineeringRepository implements PlatformEngineeringRepository {
  constructor(
    @Inject(RUNTIME_DATABASE)
    private readonly database: FileBackedRuntimeDatabase = getDefaultRuntimeDatabase()
  ) {}

  async createPlan(plan: PlatformEngineeringPlan): Promise<PlatformEngineeringPlan> {
    return this.database.insert("platform_engineering_plans", plan);
  }

  async updatePlan(plan: PlatformEngineeringPlan): Promise<PlatformEngineeringPlan> {
    return this.database.upsert("platform_engineering_plans", plan);
  }

  async findPlanById(
    id: string,
    organizationId: string
  ): Promise<PlatformEngineeringPlan | null> {
    return this.database.findByIdForTenant<PlatformEngineeringPlan>(
      "platform_engineering_plans",
      id,
      organizationId
    );
  }

  async createAgentCoordinationRun(
    run: AgentCoordinationRun
  ): Promise<AgentCoordinationRun> {
    return this.database.insert("agent_coordination_runs", run);
  }

  async appendAuditEvent(event: PlatformEngineeringAuditEvent): Promise<void> {
    this.database.insert("platform_engineering_audit_events", event);
  }
}
