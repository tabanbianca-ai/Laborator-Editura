export const PRODUCT_NAME = "Laboratorul Editurii";

export type UserRole = "ADMIN" | "TRANSLATOR" | "REVIEWER" | "VIEWER";

export interface HealthResponse {
  name?: string;
  service?: string;
  status: "ok";
}

export * from "./json-master-format/index.js";
