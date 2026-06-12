import { createParamDecorator, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { type AuthenticatedRequestContext, type RequestWithAuthContext } from "./request-context.types";

export const CurrentActor = createParamDecorator(
  (_data: unknown, context: ExecutionContext): AuthenticatedRequestContext => {
    const request = context.switchToHttp().getRequest<RequestWithAuthContext>();

    if (!request.authContext) {
      throw new UnauthorizedException("Authenticated request context is required.");
    }

    return request.authContext;
  }
);
