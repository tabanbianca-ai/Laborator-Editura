import { spawn, spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const apiRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const pnpm = process.env.npm_execpath;

if (!pnpm) {
  throw new Error("pnpm executable was not provided by the package runner.");
}

const build = spawnSync(process.execPath, [pnpm, "run", "build"], {
  cwd: apiRoot,
  env: process.env,
  stdio: "inherit"
});

if (build.status !== 0) {
  process.exit(build.status ?? 1);
}

const server = spawn(
  process.execPath,
  [join(apiRoot, "dist", "apps", "api", "src", "main.js")],
  {
  cwd: apiRoot,
  env: process.env,
  stdio: "inherit"
  }
);

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => server.kill(signal));
}

server.on("exit", (code) => process.exit(code ?? 0));
