import { Controller, Get } from "@nestjs/common";
import { PRODUCT_NAME } from "@laborator/shared";

@Controller("health")
export class HealthController {
  @Get()
  getHealth() {
    return {
      name: PRODUCT_NAME,
      status: "ok"
    };
  }
}
