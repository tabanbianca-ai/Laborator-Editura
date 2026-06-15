const PROTECTED_ENVIRONMENTS = new Set(["staging", "production"]);
const REQUIRED_PROTECTED_SECRETS = [
  "LABORATOR_SESSION_SECRET",
  "LABORATOR_AUTH_LOGIN_SECRET"
] as const;
const WEAK_SECRET_PATTERNS = [
  /changeme/iu,
  /default/iu,
  /demo/iu,
  /example/iu,
  /password/iu,
  /replace/iu,
  /secret/iu,
  /test/iu
];

export interface SecurityEnvironmentValidationResult {
  valid: boolean;
  issues: string[];
}

export function validateSecurityEnvironment(
  env: Record<string, string | undefined> = process.env
): void {
  const result = inspectSecurityEnvironment(env);

  if (!result.valid) {
    throw new Error(`Security environment validation failed: ${result.issues.join("; ")}`);
  }
}

export function inspectSecurityEnvironment(
  env: Record<string, string | undefined> = process.env
): SecurityEnvironmentValidationResult {
  const issues: string[] = [];

  if (!isProtectedEnvironment(env)) {
    return { valid: true, issues };
  }

  for (const name of REQUIRED_PROTECTED_SECRETS) {
    const value = env[name];

    if (!value) {
      issues.push(`${name} is required`);
      continue;
    }

    if (isWeakSecret(value)) {
      issues.push(`${name} is weak or uses a default/demo value`);
    }
  }

  return {
    valid: issues.length === 0,
    issues
  };
}

export function isProtectedEnvironment(env: Record<string, string | undefined> = process.env): boolean {
  const environmentName = env.NODE_ENV ?? env.APP_ENV ?? "";

  return PROTECTED_ENVIRONMENTS.has(environmentName.toLocaleLowerCase());
}

export function isLoginSecretValid(inputSecret: string | undefined): boolean {
  const expectedSecret = process.env.LABORATOR_AUTH_LOGIN_SECRET;

  return !expectedSecret || inputSecret === expectedSecret;
}

function isWeakSecret(value: string): boolean {
  const trimmed = value.trim();

  return (
    trimmed.length < 32 ||
    new Set(trimmed).size < 8 ||
    WEAK_SECRET_PATTERNS.some((pattern) => pattern.test(trimmed))
  );
}
