import { Body, Controller, Get, Post } from "@nestjs/common";
import { CurrentActor } from "./request-context.decorator";
import { type AuthenticatedRequestContext } from "./request-context.types";
import { AuthService } from "./auth.service";
import { type LoginInput } from "./auth.types";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  login(@Body() input: LoginInput) {
    return this.authService.login(input);
  }

  @Get("me")
  me(@CurrentActor() actor: AuthenticatedRequestContext) {
    return actor;
  }
}
