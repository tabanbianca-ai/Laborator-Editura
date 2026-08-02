export type ErrorCategory =
  | "VALIDATION"
  | "AUTHENTICATION"
  | "AUTHORIZATION"
  | "NOT_FOUND"
  | "CONFLICT"
  | "RATE_LIMIT"
  | "DEPENDENCY"
  | "CONFIGURATION"
  | "INTERNAL";

export interface CommonErrorPayload {
  readonly error_code: string;
  readonly category: ErrorCategory;
  readonly http_status: number;
  readonly message_key: string;
  readonly correlation_id: string;
  readonly details?: unknown;
  readonly retryable: boolean;
  readonly timestamp: string;
}

export interface CommonErrorInput {
  readonly errorCode: string;
  readonly category: ErrorCategory;
  readonly httpStatus: number;
  readonly messageKey: string;
  readonly correlationId: string;
  readonly details?: unknown;
  readonly retryable?: boolean;
  readonly timestamp?: string;
}

const defaultRetryableCategories: readonly ErrorCategory[] = ["RATE_LIMIT", "DEPENDENCY"];

export function createCommonErrorPayload(input: CommonErrorInput): CommonErrorPayload {
  return {
    error_code: input.errorCode,
    category: input.category,
    http_status: input.httpStatus,
    message_key: input.messageKey,
    correlation_id: input.correlationId,
    details: input.details,
    retryable: input.retryable ?? defaultRetryableCategories.includes(input.category),
    timestamp: input.timestamp ?? new Date().toISOString()
  };
}

export function createSafeUserErrorPayload(input: CommonErrorInput): CommonErrorPayload {
  return createCommonErrorPayload({
    ...input,
    details: undefined
  });
}

export function isCommonErrorPayload(value: unknown): value is CommonErrorPayload {
  if (!isObjectRecord(value)) {
    return false;
  }

  return (
    typeof value.error_code === "string" &&
    isErrorCategory(value.category) &&
    typeof value.http_status === "number" &&
    typeof value.message_key === "string" &&
    typeof value.correlation_id === "string" &&
    typeof value.retryable === "boolean" &&
    typeof value.timestamp === "string"
  );
}

export function isErrorCategory(value: unknown): value is ErrorCategory {
  return (
    value === "VALIDATION" ||
    value === "AUTHENTICATION" ||
    value === "AUTHORIZATION" ||
    value === "NOT_FOUND" ||
    value === "CONFLICT" ||
    value === "RATE_LIMIT" ||
    value === "DEPENDENCY" ||
    value === "CONFIGURATION" ||
    value === "INTERNAL"
  );
}

function isObjectRecord(value: unknown): value is { readonly [key: string]: unknown } {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
