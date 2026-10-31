import { existsSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../../../..");
const require = createRequire(import.meta.url);
const cache = new Map();
export function loadFinancialSource(path) {
  path = resolve(root, path);
  if (cache.has(path)) return cache.get(path).exports;
  const module = { exports: {} }; cache.set(path, module);
  try {
    const output = ts.transpileModule(readFileSync(path, "utf8"), { compilerOptions: {
      module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, experimentalDecorators: true
    } }).outputText;
    new Function("require", "module", "exports", "__filename", "__dirname", output)((name) => {
      if (name === "@laborator/db") return Object.assign({}, ...["runtime-database", "financial-persistence", "ai-budget-projection", "ai-budget-reservations"]
        .map((file) => loadFinancialSource(`packages/db/src/${file}.ts`)));
      if (name === "@laborator/shared") return loadFinancialSource("packages/shared/src/index.ts");
      if (name.startsWith(".")) {
        const candidate = resolve(dirname(path), name.replace(/\.js$/u, ""));
        if (existsSync(`${candidate}.ts`)) return loadFinancialSource(`${candidate}.ts`);
      }
      return require(name);
    }, module, module.exports, path, dirname(path));
    return module.exports;
  } catch (error) { cache.delete(path); throw error; }
}
