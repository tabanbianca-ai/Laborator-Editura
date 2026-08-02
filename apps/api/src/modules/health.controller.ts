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

  @Get("liveness")
  getLiveness() {
    return {
      name: PRODUCT_NAME,
      status: "ok",
      check: "liveness"
    };
  }

  @Get("readiness")
  getReadiness() {
    return {
      name: PRODUCT_NAME,
      status: "ok",
      check: "readiness"
    };
  }

  @Get("startup")
  getStartup() {
    return {
      name: PRODUCT_NAME,
      status: "ok",
      check: "startup"
    };
  }
}
