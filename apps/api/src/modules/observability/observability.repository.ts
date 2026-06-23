import { Inject, Injectable } from "@nestjs/common";
import { getDefaultRuntimeDatabase, type FileBackedRuntimeDatabase } from "@laborator/db";
import { RUNTIME_DATABASE } from "../runtime-database.provider";
import {
  type ObservabilityAgentExecution,
  type ObservabilityAuditEvent,
  type ObservabilityLogRecord,
  type ObservabilityMetric,
  type ObservabilityRepository,
  type ObservabilityTrace
} from "./observability.types";

@Injectable()
export class DatabaseObservabilityRepository implements ObservabilityRepository {
  constructor(
    @Inject(RUNTIME_DATABASE)
    private readonly database: FileBackedRuntimeDatabase = getDefaultRuntimeDatabase()
  ) {}

  async createMetric(metric: ObservabilityMetric): Promise<ObservabilityMetric> {
    return this.database.insert("observability_metrics", metric);
  }

  async listMetrics(organizationId: string): Promise<ObservabilityMetric[]> {
    return this.database.selectForTenant<ObservabilityMetric>("observability_metrics", organizationId);
  }

  async createLog(log: ObservabilityLogRecord): Promise<ObservabilityLogRecord> {
    return this.database.insert("observability_logs", log);
  }

  async listLogs(organizationId: string): Promise<ObservabilityLogRecord[]> {
    return this.database.selectForTenant<ObservabilityLogRecord>("observability_logs", organizationId);
  }

  async createTrace(trace: ObservabilityTrace): Promise<ObservabilityTrace> {
    return this.database.insert("observability_traces", trace);
  }

  async listTraces(organizationId: string): Promise<ObservabilityTrace[]> {
    return this.database.selectForTenant<ObservabilityTrace>("observability_traces", organizationId);
  }

  async createAgentExecution(
    execution: ObservabilityAgentExecution
  ): Promise<ObservabilityAgentExecution> {
    return this.database.insert("observability_agent_executions", execution);
  }

  async listAgentExecutions(
    organizationId: string
  ): Promise<ObservabilityAgentExecution[]> {
    return this.database.selectForTenant<ObservabilityAgentExecution>(
      "observability_agent_executions",
      organizationId
    );
  }

  async appendAuditEvent(event: ObservabilityAuditEvent): Promise<void> {
    this.database.insert("observability_audit_events", event);
  }
}
