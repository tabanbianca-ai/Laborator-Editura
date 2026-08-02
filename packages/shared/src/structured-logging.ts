export type LogSeverity = "TRACE" | "DEBUG" | "INFO" | "WARN" | "ERROR" | "FATAL";

export interface StructuredLogEvent {
  readonly timestamp: string;
  readonly severity: LogSeverity;
  readonly service: string;
  readonly module: string;
  readonly environment: string;
  readonly event_name: string;
  readonly correlation_id: string;
  readonly trace_id?: string;
  readonly actor_id?: string;
  readonly resource_id?: string;
  readonly message: string;
  readonly metadata?: unknown;
}

export interface StructuredLogInput {
  readonly severity: LogSeverity;
  readonly service: string;
  readonly module: string;
  readonly environment: string;
  readonly eventName: string;
  readonly correlationId: string;
  readonly traceId?: string;
  readonly actorId?: string;
  readonly resourceId?: string;
  readonly message: string;
  readonly metadata?: unknown;
  readonly timestamp?: string;
}

const sensitiveKeyFragments = [
  "authorization",
  "cookie",
  "password",
  "privatekey",
  "private_key",
  "secret",
  "session",
  "token",
  "api_key",
  "apikey"
];

export function createStructuredLogEvent(input: StructuredLogInput): StructuredLogEvent {
  return {
    timestamp: input.timestamp ?? new Date().toISOString(),
    severity: input.severity,
    service: input.service,
    module: input.module,
    environment: input.environment,
    event_name: input.eventName,
    correlation_id: input.correlationId,
    trace_id: input.traceId,
    actor_id: input.actorId,
    resource_id: input.resourceId,
    message: input.message,
    metadata:
      input.metadata === undefined ? undefined : redactSensitiveMetadata(input.metadata)
  };
}

export function redactSensitiveMetadata(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => redactSensitiveMetadata(item));
  }

  if (!isObjectRecord(value)) {
    return value;
  }

  const redacted: { [key: string]: unknown } = {};

  for (const [key, nestedValue] of Object.entries(value)) {
    redacted[key] = isSensitiveMetadataKey(key)
      ? "[REDACTED]"
      : redactSensitiveMetadata(nestedValue);
  }

  return redacted;
}

export function isLogSeverity(value: unknown): value is LogSeverity {
  return (
    value === "TRACE" ||
    value === "DEBUG" ||
    value === "INFO" ||
    value === "WARN" ||
    value === "ERROR" ||
    value === "FATAL"
  );
}

export function isSensitiveMetadataKey(key: string): boolean {
  const normalized = key.replace(/[-\s]/gu, "_").toLowerCase();
  return sensitiveKeyFragments.some((fragment) => normalized.includes(fragment));
}

function isObjectRecord(value: unknown): value is { readonly [key: string]: unknown } {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
