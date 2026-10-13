import { mkdirSync, rmSync } from "node:fs";
import { runtimeDirectory } from "../../playwright.editorial.config";

export default function globalSetup() {
  rmSync(runtimeDirectory, { force: true, recursive: true });
  mkdirSync(runtimeDirectory, { recursive: true });
}
