import { Injectable, type NestMiddleware, TooManyRequestsException } from "@nestjs/common";

type RateLimitPolicyName = "auth" | "sensitive" | "default";

interface RateLimitPolicy {
  maxRequests: number;
  windowMs: number;
}

interface RateLimitBucket {
  count: number;
  resetAt: number;
}

interface RequestForRateLimit {
  connection?: { remoteAddress?: string };
  headers?: Record<string, string | string[] | undefined>;
  ip?: string;
  method?: string;
  path?: string;
  socket?: { remoteAddress?: string };
  url?: string;
}

const RATE_LIMIT_POLICIES: Record<RateLimitPolicyName, RateLimitPolicy> = {
  auth: {
    maxRequests: 10,
    windowMs: 60_000
  },
  sensitive: {
    maxRequests: 60,
    windowMs: 60_000
  },
  default: {
    maxRequests: 300,
    windowMs: 60_000
  }
};

const SAFE_RATE_LIMIT_MESSAGE = "Too many requests. Try again later.";

@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
  private readonly buckets = new Map<string, RateLimitBucket>();

  use(request: RequestForRateLimit, _response: unknown, next: () => void): void {
    const routePath = this.routePath(request);

    if (routePath === "/health") {
      next();
      return;
    }

    const policyName = this.policyName(request, routePath);
    const policy = RATE_LIMIT_POLICIES[policyName];
    const key = `${policyName}:${this.clientKey(request)}:${request.method ?? "GET"}:${routePath}`;
    const now = Date.now();
    const bucket = this.currentBucket(key, policy, now);

    bucket.count += 1;

    if (bucket.count > policy.maxRequests) {
      throw new TooManyRequestsException(SAFE_RATE_LIMIT_MESSAGE);
    }

    next();
  }

  private currentBucket(key: string, policy: RateLimitPolicy, now: number): RateLimitBucket {
    const existing = this.buckets.get(key);

    if (!existing || existing.resetAt <= now) {
      const bucket = {
        count: 0,
        resetAt: now + policy.windowMs
      };
      this.buckets.set(key, bucket);
      this.cleanup(now);
      return bucket;
    }

    return existing;
  }

  private cleanup(now: number): void {
    for (const [key, bucket] of this.buckets.entries()) {
      if (bucket.resetAt <= now) {
        this.buckets.delete(key);
      }
    }
  }

  private policyName(request: RequestForRateLimit, routePath: string): RateLimitPolicyName {
    const method = (request.method ?? "GET").toUpperCase();

    if (routePath.startsWith("/auth")) {
      return "auth";
    }

    if (
      method !== "GET" ||
      routePath.startsWith("/export") ||
      routePath.startsWith("/workflow") ||
      routePath.includes("/approve") ||
      routePath.includes("/validate") ||
      routePath.includes("/recover") ||
      routePath.includes("/transfer")
    ) {
      return "sensitive";
    }

    return "default";
  }

  private routePath(request: RequestForRateLimit): string {
    const path = request.path ?? request.url ?? "/";

    return path.split("?")[0] ?? "/";
  }

  private clientKey(request: RequestForRateLimit): string {
    return (
      request.ip ??
      request.socket?.remoteAddress ??
      request.connection?.remoteAddress ??
      this.firstHeader(request.headers?.["x-forwarded-for"])?.split(",")[0]?.trim() ??
      "unknown"
    );
  }

  private firstHeader(value: string | string[] | undefined): string | undefined {
    return Array.isArray(value) ? value[0] : value;
  }
}
