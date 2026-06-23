import { BadRequestException, Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { DatabaseObservabilityRepository } from "./observability.repository";
import {
  type ObservabilityActor,
  type ObservabilityAgentExecution,
  type ObservabilityAuditAction,
  type ObservabilityLogRecord,
  type ObservabilityMetric,
  type ObservabilitySystemHealth,
  type ObservabilityTrace,
  type RecordAgentExecutionInput,
  type RecordLogInput,
  type RecordMetricInput,
  type RecordTraceInput
} from "./observability.types";

@Injectable()
export class ObservabilityService {
  constructor(private readonly repository: DatabaseObservabilityRepository) {}

  async getHealth(actor: ObservabilityActor): Promise<ObservabilitySystemHealth> {
    this.validateActor(actor);

    const health: ObservabilitySystemHealth = {
      name: "Laboratorul Editurii Observability",
      status: "ok",
      apiUptimeSeconds: Math.round(process.uptime()),
      runtimeDatabaseStatus: "AVAILABLE",
      backupStatus: "CONFIGURED",
      moduleHealth: {
        apiGateway: "READY",
        runtimeDatabase: "READY",
        backupRestore: "READY",
        observability: "READY",
        workflow: "READY"
      },
      externalApmIntegration: "NOT_CONFIGURED",
      humanFinalAuthority: true,
      checkedAt: new Date().toISOString()
    };

    await this.audit("OBSERVABILITY_HEALTH_READ", actor, {}, health);
    return health;
  }

  async getMetrics(actor: ObservabilityActor): Promise<ObservabilityMetric[]> {
    this.validateActor(actor);
    await this.ensureBaselineMetrics(actor);
    return this.repository.listMetrics(actor.organizationId);
  }

  async getLogs(actor: ObservabilityActor): Promise<ObservabilityLogRecord[]> {
    this.validateActor(actor);
    const existing = await this.repository.listLogs(actor.organizationId);

    if (existing.length === 0) {
      await this.recordLog(actor, {
        severity: "INFO",
        moduleName: "observability",
        requestPath: "/observability/logs",
        message: "Observability structured log stream initialized.",
        metadata: {
          externalApmIntegration: "NOT_CONFIGURED",
          logsAreAppendOnly: true
        }
      });
    }

    return this.repository.listLogs(actor.organizationId);
  }

  async getTraces(actor: ObservabilityActor): Promise<ObservabilityTrace[]> {
    this.validateActor(actor);
    const existing = await this.repository.listTraces(actor.organizationId);

    if (existing.length === 0) {
      await this.recordTrace(actor, {
        spanName: "observability.dashboard.bootstrap",
        moduleName: "observability",
        durationMs: 0,
        status: "OK",
        metadata: {
          parentSpanPlaceholder: true,
          externalApmIntegration: "NOT_CONFIGURED"
        }
      });
    }

    return this.repository.listTraces(actor.organizationId);
  }

  async getAgentExecutions(actor: ObservabilityActor): Promise<ObservabilityAgentExecution[]> {
    this.validateActor(actor);
    const existing = await this.repository.listAgentExecutions(actor.organizationId);

    if (existing.length === 0) {
      await this.recordAgentExecution(actor, {
        agentName: "Observability Dashboard",
        executionType: "DIAGNOSTIC_SUMMARY",
        status: "SUCCEEDED",
        durationMs: 0,
        estimatedCost: 0,
        tokenUsageMetadata: {
          provider: "none",
          totalTokens: 0
        },
        dependencies: ["runtime-database", "backup-restore"],
        auditLink: "observability.bootstrap",
        metadata: {
          providerIntegration: "NOT_CONFIGURED",
          noInfrastructureActionExecuted: true
        }
      });
    }

    return this.repository.listAgentExecutions(actor.organizationId);
  }

  async recordMetric(actor: ObservabilityActor, input: RecordMetricInput): Promise<ObservabilityMetric> {
    this.validateActor(actor);
    this.validateRequired(input.metricName, "metricName");
    this.validateRequired(input.moduleName, "moduleName");

    const metric: ObservabilityMetric = {
      id: randomUUID(),
      organizationId: actor.organizationId,
      metricName: input.metricName,
      metricType: input.metricType ?? "GAUGE",
      moduleName: input.moduleName,
      value: input.value,
      unit: input.unit,
      requestCount: input.requestCount,
      errorCount: input.errorCount,
      latencyMs: input.latencyMs,
      runtimeDatabaseStatus: input.runtimeDatabaseStatus,
      backupStatus: input.backupStatus,
      metadata: input.metadata,
      createdBy: actor.userId,
      recordedAt: new Date().toISOString()
    };

    const created = await this.repository.createMetric(metric);
    await this.audit("OBSERVABILITY_METRIC_RECORDED", actor, { metricId: created.id }, created);

    return created;
  }

  async recordLog(actor: ObservabilityActor, input: RecordLogInput): Promise<ObservabilityLogRecord> {
    this.validateActor(actor);
    this.validateRequired(input.moduleName, "moduleName");
    this.validateRequired(input.message, "message");

    const log: ObservabilityLogRecord = {
      id: randomUUID(),
      organizationId: actor.organizationId,
      severity: input.severity,
      moduleName: input.moduleName,
      correlationId: input.correlationId ?? this.createCorrelationId(),
      actorId: actor.userId,
      requestPath: input.requestPath,
      message: input.message,
      metadata: input.metadata,
      createdAt: new Date().toISOString()
    };

    const created = await this.repository.createLog(log);
    await this.audit("OBSERVABILITY_LOG_RECORDED", actor, { logId: created.id }, created);

    return created;
  }

  async recordTrace(actor: ObservabilityActor, input: RecordTraceInput): Promise<ObservabilityTrace> {
    this.validateActor(actor);
    this.validateRequired(input.spanName, "spanName");
    this.validateRequired(input.moduleName, "moduleName");

    const correlationId = input.correlationId ?? this.createCorrelationId();
    const trace: ObservabilityTrace = {
      id: randomUUID(),
      organizationId: actor.organizationId,
      traceId: input.traceId ?? randomUUID(),
      correlationId,
      spanName: input.spanName,
      moduleName: input.moduleName,
      durationMs: input.durationMs,
      status: input.status ?? "OK",
      parentSpanId: input.parentSpanId,
      metadata: input.metadata,
      createdAt: new Date().toISOString()
    };

    const created = await this.repository.createTrace(trace);
    await this.audit("OBSERVABILITY_TRACE_RECORDED", actor, { traceId: created.id }, created);

    return created;
  }

  async recordAgentExecution(
    actor: ObservabilityActor,
    input: RecordAgentExecutionInput
  ): Promise<ObservabilityAgentExecution> {
    this.validateActor(actor);
    this.validateRequired(input.agentName, "agentName");
    this.validateRequired(input.executionType, "executionType");

    const execution: ObservabilityAgentExecution = {
      id: randomUUID(),
      organizationId: actor.organizationId,
      agentName: input.agentName,
      executionType: input.executionType,
      projectId: input.projectId,
      documentId: input.documentId,
      status: input.status,
      durationMs: input.durationMs,
      estimatedCost: input.estimatedCost,
      tokenUsageMetadata: input.tokenUsageMetadata,
      dependencies: input.dependencies ?? [],
      auditLink: input.auditLink,
      humanFinalAuthority: true,
      aiMayDiagnose: true,
      aiMaySummarizeIncidents: true,
      aiMaySuggestRemediation: true,
      aiMayAutoExecuteInfrastructureActions: false,
      createdBy: actor.userId,
      createdAt: new Date().toISOString(),
      metadata: input.metadata
    };

    const created = await this.repository.createAgentExecution(execution);
    await this.audit(
      "OBSERVABILITY_AGENT_EXECUTION_RECORDED",
      actor,
      { agentExecutionId: created.id },
      created
    );

    return created;
  }

  private async ensureBaselineMetrics(actor: ObservabilityActor): Promise<void> {
    const existing = await this.repository.listMetrics(actor.organizationId);

    if (existing.length > 0) {
      return;
    }

    await this.recordMetric(actor, {
      metricName: "api.uptime",
      metricType: "GAUGE",
      moduleName: "api",
      value: Math.round(process.uptime()),
      unit: "seconds",
      metadata: { dashboardBaseline: true }
    });
    await this.recordMetric(actor, {
      metricName: "api.requests.total",
      metricType: "COUNTER",
      moduleName: "api",
      value: 0,
      requestCount: 0,
      metadata: { externalApmIntegration: "NOT_CONFIGURED" }
    });
    await this.recordMetric(actor, {
      metricName: "api.errors.total",
      metricType: "COUNTER",
      moduleName: "api",
      value: 0,
      errorCount: 0,
      metadata: { externalApmIntegration: "NOT_CONFIGURED" }
    });
    await this.recordMetric(actor, {
      metricName: "api.latency.p95",
      metricType: "HISTOGRAM",
      moduleName: "api",
      value: 0,
      unit: "ms",
      latencyMs: 0,
      metadata: { latencyMetadataOnly: true }
    });
    await this.recordMetric(actor, {
      metricName: "runtime_db.status",
      metricType: "STATUS",
      moduleName: "runtime-database",
      value: 1,
      runtimeDatabaseStatus: "AVAILABLE",
      metadata: { statusLabel: "AVAILABLE" }
    });
    await this.recordMetric(actor, {
      metricName: "backup.status",
      metricType: "STATUS",
      moduleName: "backup-restore",
      value: 1,
      backupStatus: "CONFIGURED",
      metadata: { statusLabel: "CONFIGURED" }
    });
  }

  private async audit(
    action: ObservabilityAuditAction,
    actor: ObservabilityActor,
    target: {
      metricId?: string;
      logId?: string;
      traceId?: string;
      agentExecutionId?: string;
    },
    afterState: object
  ): Promise<void> {
    await this.repository.appendAuditEvent({
      id: randomUUID(),
      organizationId: actor.organizationId,
      ...target,
      action,
      actorId: actor.userId,
      afterState,
      humanFinalAuthority: true,
      createdAt: new Date().toISOString()
    });
  }

  private createCorrelationId(): string {
    return `obs_${randomUUID()}`;
  }

  private validateActor(actor: ObservabilityActor): void {
    if (!actor.userId || !actor.organizationId) {
      throw new BadRequestException("Authenticated observability context is required.");
    }
  }

  private validateRequired(value: string | undefined, fieldName: string): void {
    if (!value) {
      throw new BadRequestException(`${fieldName} is required.`);
    }
  }
}
