import { Injectable, type NestMiddleware } from "@nestjs/common";

interface ResponseWithHeaders {
  setHeader(name: string, value: string): void;
}

@Injectable()
export class SecurityHeadersMiddleware implements NestMiddleware {
  use(_request: unknown, response: ResponseWithHeaders, next: () => void): void {
    response.setHeader(
      "Content-Security-Policy",
      "default-src 'self'; frame-ancestors 'none'; object-src 'none'; base-uri 'self'; form-action 'self'"
    );
    response.setHeader("X-Frame-Options", "DENY");
    response.setHeader("X-Content-Type-Options", "nosniff");
    response.setHeader("Referrer-Policy", "no-referrer");
    response.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=()");

    next();
  }
}
