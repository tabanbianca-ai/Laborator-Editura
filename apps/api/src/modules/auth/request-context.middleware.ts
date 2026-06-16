import { Injectable, NestMiddleware, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { type AuthActor } from "./auth.types";
import { permissionsForRoles, type RequestWithAuthContext } from "./request-context.types";

@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}

  async use(request: RequestWithAuthContext, _response: unknown, next: () => void): Promise<void> {
    if (this.isPublicRoute(request)) {
      next();
      return;
    }

    const token = this.readAccessToken(request);

    if (!token) {
      throw new UnauthorizedException("Valid authenticated context is required.");
    }

    const actor = await this.resolveActor(token);

    request.authContext = {
      ...actor,
      permissions: permissionsForRoles(actor.roles)
    };

    next();
  }

  private isPublicRoute(request: RequestWithAuthContext): boolean {
    const method = (request.method ?? "").toUpperCase();
    const routePath = this.routePath(request);

    return (method === "GET" && this.isHealthRoute(routePath)) ||
      (method === "POST" && routePath.endsWith("/auth/login"));
  }

  private routePath(request: RequestWithAuthContext): string {
    const rawPath = request.originalUrl ?? request.path ?? request.url ?? "/";
    const pathWithoutQuery = rawPath.split("?")[0] ?? "/";

    return pathWithoutQuery.length > 1 ? pathWithoutQuery.replace(/\/+$/u, "") : pathWithoutQuery;
  }

  private isHealthRoute(routePath: string): boolean {
    return routePath === "/health";
  }

  private readAccessToken(request: RequestWithAuthContext): string | undefined {
    const authorization = this.firstHeader(request.headers?.authorization);

    if (authorization !== undefined && authorization.toLocaleLowerCase().startsWith("bearer ")) {
      return authorization.slice("bearer ".length).trim();
    }

    return this.firstHeader(request.headers?.["x-session-token"]);
  }

  private firstHeader(value: string | string[] | undefined): string | undefined {
    return Array.isArray(value) ? value[0] : value;
  }

  private async resolveActor(token: string): Promise<AuthActor> {
    try {
      return await this.authService.getCurrentActor(token);
    } catch {
      throw new UnauthorizedException("Valid authenticated context is required.");
    }
  }
}
