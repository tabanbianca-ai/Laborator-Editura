export const PRODUCT_NAME = "Laboratorul Editurii";

export type UserRole =
  | "PLATFORM_CREATOR"
  | "ADMIN"
  | "EDITOR"
  | "TRANSLATOR"
  | "PROOFREADER"
  | "REVIEWER"
  | "DESIGNER"
  | "NARRATOR"
  | "AUDIO_NARRATOR"
  | "AUTHOR"
  | "COLLABORATOR"
  | "READER"
  | "GUEST"
  | "VIEWER";

export interface HealthResponse {
  name?: string;
  service?: string;
  status: "ok";
}

export * from "./json-master-format";
export * from "./language-policy";
export * from "./configuration";
export * from "./errors";
export * from "./localization";
export * from "./structured-logging";
export * from "./canonical-data";
