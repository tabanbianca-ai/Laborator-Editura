import { rmSync } from "node:fs";
import { runtimeDirectory } from "../../playwright.editorial.config";

export default function globalTeardown() {
  rmSync(runtimeDirectory, { force: true, recursive: true });
}
