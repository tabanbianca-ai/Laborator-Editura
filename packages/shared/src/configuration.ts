export type ConfigurationEnvironment = "development" | "test" | "staging" | "production";

export type ConfigurationValueType = "string" | "number" | "boolean" | "url" | "secret";

export interface ConfigurationVariableDefinition {
  readonly name: string;
  readonly type: ConfigurationValueType;
  readonly required: boolean;
  readonly secret?: boolean;
  readonly defaultValue?: string;
  readonly allowedValues?: readonly string[];
  readonly minLength?: number;
}

export interface ConfigurationValidationIssue {
  readonly name: string;
  readonly code:
    | "CONFIG_REQUIRED"
    | "CONFIG_INVALID_TYPE"
    | "CONFIG_INVALID_VALUE"
    | "CONFIG_WEAK_SECRET";
  readonly message: string;
}

export type ConfigurationInput = {
  readonly [key: string]: string | undefined;
};

export type ParsedConfigurationValue = string | number | boolean;

export interface ConfigurationValidationResult {
  readonly valid: boolean;
  readonly values: {
    readonly [key: string]: ParsedConfigurationValue | undefined;
  };
  readonly issues: readonly ConfigurationValidationIssue[];
}

const weakSecretValues = new Set([
  "changeme",
  "default",
  "demo",
  "example",
  "password",
  "secret",
  "test",
  "replace-with-random-32-plus-character-session-value",
  "replace-with-random-32-plus-character-login-value"
]);

export class ConfigurationValidationError extends Error {
  constructor(readonly issues: readonly ConfigurationValidationIssue[]) {
    super(formatConfigurationValidationIssues(issues));
    this.name = "ConfigurationValidationError";
  }
}

export function validateRuntimeConfiguration(
  input: ConfigurationInput,
  schema: readonly ConfigurationVariableDefinition[]
): ConfigurationValidationResult {
  const values: { [key: string]: ParsedConfigurationValue | undefined } = {};
  const issues: ConfigurationValidationIssue[] = [];

  for (const definition of schema) {
    const rawValue = input[definition.name] ?? definition.defaultValue;

    if (rawValue === undefined || rawValue.length === 0) {
      if (definition.required) {
        issues.push({
          name: definition.name,
          code: "CONFIG_REQUIRED",
          message: `${definition.name} is required.`
        });
      }
      values[definition.name] = undefined;
      continue;
    }

    const parsed = parseConfigurationValue(rawValue, definition.type);
    if (parsed === undefined) {
      issues.push({
        name: definition.name,
        code: "CONFIG_INVALID_TYPE",
        message: `${definition.name} has an invalid value type.`
      });
      values[definition.name] = undefined;
      continue;
    }

    if (
      definition.allowedValues !== undefined &&
      !definition.allowedValues.includes(String(parsed))
    ) {
      issues.push({
        name: definition.name,
        code: "CONFIG_INVALID_VALUE",
        message: `${definition.name} is not one of the allowed values.`
      });
    }

    if (definition.secret === true || definition.type === "secret") {
      const secretIssue = validateSecretStrength(
        definition.name,
        rawValue,
        definition.minLength ?? 32
      );
      if (secretIssue !== undefined) {
        issues.push(secretIssue);
      }
    }

    values[definition.name] = parsed;
  }

  return {
    valid: issues.length === 0,
    values,
    issues
  };
}

export function assertRuntimeConfiguration(
  input: ConfigurationInput,
  schema: readonly ConfigurationVariableDefinition[]
): ConfigurationValidationResult {
  const result = validateRuntimeConfiguration(input, schema);
  if (!result.valid) {
    throw new ConfigurationValidationError(result.issues);
  }

  return result;
}

export function formatConfigurationValidationIssues(
  issues: readonly ConfigurationValidationIssue[]
): string {
  if (issues.length === 0) {
    return "Configuration is valid.";
  }

  return issues.map((issue) => `${issue.code}:${issue.name}`).join(", ");
}

export function createCoreConfigurationSchema(
  environment: ConfigurationEnvironment
): readonly ConfigurationVariableDefinition[] {
  const protectedEnvironment = environment === "staging" || environment === "production";

  return [
    {
      name: "NODE_ENV",
      type: "string",
      required: true,
      allowedValues: ["development", "test", "production"]
    },
    {
      name: "APP_ENV",
      type: "string",
      required: true,
      allowedValues: ["local", "development", "test", "staging", "production"]
    },
    {
      name: "LABORATOR_SESSION_SECRET",
      type: "secret",
      required: protectedEnvironment,
      secret: true,
      minLength: 32
    },
    {
      name: "LABORATOR_AUTH_LOGIN_SECRET",
      type: "secret",
      required: protectedEnvironment,
      secret: true,
      minLength: 32
    }
  ];
}

function parseConfigurationValue(
  rawValue: string,
  type: ConfigurationValueType
): ParsedConfigurationValue | undefined {
  if (type === "number") {
    const parsed = Number(rawValue);
    return Number.isFinite(parsed) ? parsed : undefined;
  }

  if (type === "boolean") {
    if (rawValue === "true") {
      return true;
    }
    if (rawValue === "false") {
      return false;
    }
    return undefined;
  }

  if (type === "url") {
    try {
      return new URL(rawValue).toString();
    } catch {
      return undefined;
    }
  }

  return rawValue;
}

function validateSecretStrength(
  name: string,
  rawValue: string,
  minLength: number
): ConfigurationValidationIssue | undefined {
  const normalized = rawValue.trim().toLowerCase();
  if (rawValue.length < minLength || weakSecretValues.has(normalized)) {
    return {
      name,
      code: "CONFIG_WEAK_SECRET",
      message: `${name} must be replaced with a strong secret.`
    };
  }

  return undefined;
}
