export type ObservabilitySeverity = "DEBUG" | "INFO" | "WARN" | "ERROR" | "CRITICAL";

export type ObservabilityMetricType = "COUNTER" | "GAUGE" | "HISTOGRAM" | "STATUS";

export type ObservabilityTraceStatus = "OK" | "ERROR" | "PENDING";

export type ObservabilityAgentExecutionStatus =
  | "PENDING"
  | "RUNNING"
  | "SUCCEEDED"
  | "FAILED"
  | "CANCELLED";

export type ObservabilityAuditAction =
  | "OBSERVABILITY_HEALTH_READ"
  | "OBSERVABILITY_METRIC_RECORDED"
  | "OBSERVABILITY_LOG_RECORDED"
  | "OBSERVABILITY_TRACE_RECORDED"
  | "OBSERVABILITY_AGENT_EXECUTION_RECORDED";

export interface ObservabilityActor {
  userId: string;
  organizationId: string;
  roles?: string[];
  permissions?: string[];
}

export interface ObservabilitySystemHealth {
  name: "Laboratorul Editurii Observability";
  status: "ok" | "degraded";
  apiUptimeSeconds: number;
  runtimeDatabaseStatus: "AVAILABLE" | "UNKNOWN";
  backupStatus: "CONFIGURED" | "UNKNOWN";
  moduleHealth: Record<string, "READY" | "DEGRADED" | "UNKNOWN">;
  externalApmIntegration: "NOT_CONFIGURED";
  humanFinalAuthority: true;
  checkedAt: string;
}

export interface ObservabilityMetric {
  id: string;
  organizationId: string;
  metricName: string;
  metricType: ObservabilityMetricType;
  moduleName: string;
  value: number;
  unit?: string;
  requestCount?: number;
  errorCount?: number;
  latencyMs?: number;
  runtimeDatabaseStatus?: "AVAILABLE" | "UNAVAILABLE" | "UNKNOWN";
  backupStatus?: "CONFIGURED" | "MISSING" | "UNKNOWN";
  metadata?: Record<string, unknown>;
  createdBy: string;
  recordedAt: string;
}

export interface ObservabilityLogRecord {
  id: string;
  organizationId: string;
  severity: ObservabilitySeverity;
  moduleName: string;
  correlationId: string;
  actorId?: string;
  requestPath?: string;
  message: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface ObservabilityTrace {
  id: string;
  organizationId: string;
  traceId: string;
  correlationId: string;
  spanName: string;
  moduleName: string;
  durationMs: number;
  status: ObservabilityTraceStatus;
  parentSpanId?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface ObservabilityTokenUsageMetadata {
  provider?: string;
  model?: string;
  inputTokens?: number;
  outputTokens?: number;
  totalTokens?: number;
}

export interface ObservabilityAgentExecution {
  id: string;
  organizationId: string;
  agentName: string;
  executionType: string;
  projectId?: string;
  documentId?: string;
  status: ObservabilityAgentExecutionStatus;
  durationMs: number;
  estimatedCost?: number;
  tokenUsageMetadata?: ObservabilityTokenUsageMetadata;
  dependencies: string[];
  auditLink?: string;
  humanFinalAuthority: true;
  aiMayDiagnose: true;
  aiMaySummarizeIncidents: true;
  aiMaySuggestRemediation: true;
  aiMayAutoExecuteInfrastructureActions: false;
  createdBy: string;
  createdAt: string;
  metadata?: Record<string, unknown>;
}

export interface ObservabilityAuditEvent {
  id: string;
  organizationId: string;
  action: ObservabilityAuditAction;
  actorId: string;
  metricId?: string;
  logId?: string;
  traceId?: string;
  agentExecutionId?: string;
  beforeState?: object;
  afterState?: object;
  humanFinalAuthority: true;
  createdAt: string;
}

export interface RecordMetricInput {
  metricName: string;
  metricType?: ObservabilityMetricType;
  moduleName: string;
  value: number;
  unit?: string;
  requestCount?: number;
  errorCount?: number;
  latencyMs?: number;
  runtimeDatabaseStatus?: "AVAILABLE" | "UNAVAILABLE" | "UNKNOWN";
  backupStatus?: "CONFIGURED" | "MISSING" | "UNKNOWN";
  metadata?: Record<string, unknown>;
}

export interface RecordLogInput {
  severity: ObservabilitySeverity;
  moduleName: string;
  correlationId?: string;
  requestPath?: string;
  message: string;
  metadata?: Record<string, unknown>;
}

export interface RecordTraceInput {
  traceId?: string;
  correlationId?: string;
  spanName: string;
  moduleName: string;
  durationMs: number;
  status?: ObservabilityTraceStatus;
  parentSpanId?: string;
  metadata?: Record<string, unknown>;
}

export interface RecordAgentExecutionInput {
  agentName: string;
  executionType: string;
  projectId?: string;
  documentId?: string;
  status: ObservabilityAgentExecutionStatus;
  durationMs: number;
  estimatedCost?: number;
  tokenUsageMetadata?: ObservabilityTokenUsageMetadata;
  dependencies?: string[];
  auditLink?: string;
  metadata?: Record<string, unknown>;
}

export interface ObservabilityRepository {
  createMetric(metric: ObservabilityMetric): Promise<ObservabilityMetric>;
  listMetrics(organizationId: string): Promise<ObservabilityMetric[]>;
  createLog(log: ObservabilityLogRecord): Promise<ObservabilityLogRecord>;
  listLogs(organizationId: string): Promise<ObservabilityLogRecord[]>;
  createTrace(trace: ObservabilityTrace): Promise<ObservabilityTrace>;
  listTraces(organizationId: string): Promise<ObservabilityTrace[]>;
  createAgentExecution(execution: ObservabilityAgentExecution): Promise<ObservabilityAgentExecution>;
  listAgentExecutions(organizationId: string): Promise<ObservabilityAgentExecution[]>;
  appendAuditEvent(event: ObservabilityAuditEvent): Promise<void>;
}
