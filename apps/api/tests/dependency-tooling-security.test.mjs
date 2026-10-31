import assert from "node:assert/strict";
import * as fs from "node:fs";
import { createRequire } from "node:module";
import { join, dirname, relative } from "node:path";
import { tmpdir } from "node:os";
import { pathToFileURL } from "node:url";
import test from "node:test";

const require = createRequire(import.meta.url);
const rootRequire = createRequire(new URL("../../../package.json", import.meta.url));
const nestRequire = createRequire(require.resolve("@nestjs/cli/package.json"));
const checkerRequire = createRequire(nestRequire.resolve("fork-ts-checker-webpack-plugin/package.json"));

test("secure minimatch preserves callable CommonJS, named/ESM and legacy matching contracts", async () => {
  const consumers = [createRequire(rootRequire.resolve("eslint/package.json")), checkerRequire,
    createRequire(nestRequire.resolve("glob/package.json"))];
  for (const consumer of consumers) {
    const match = consumer("minimatch");
    assert.equal(consumer("minimatch/package.json").version, "11.0.1");
    assert.equal(typeof match, "function");
    assert.equal(match.minimatch, match);
    for (const [file, pattern, options, expected] of [
      ["src/chapter.ts", "**/*.ts", {}, true], ["src/chapter.js", "**/*.ts", {}, false],
      [".hidden.ts", "*.ts", {}, false], [".hidden.ts", "*.ts", { dot: true }, true],
      ["src/test.ts", "**/*.{ts,js}", {}, true], ["test.ts", "!*.js", {}, true],
      ["src/.hidden/test.ts", "**/*.ts", { dot: true }, true],
      ["src/chapter.ts", "*.ts", { matchBase: true }, true]
    ]) {
      assert.equal(match(file, pattern, options), expected);
      assert.equal(new match.Minimatch(pattern, options).match(file), expected);
    }
    assert.deepEqual(match.match(["a.ts", "a.js"], "*.ts"), ["a.ts"]);
    assert.equal(match.defaults({ dot: true })(".a.ts", "*.ts"), true);
  }
  const entry = checkerRequire.resolve("minimatch").replace("/commonjs/", "/esm/");
  const esm = await import(pathToFileURL(entry).href);
  assert.equal(esm.minimatch("chapter.ts", "*.ts"), true);
});

test("Nest checker invokes its real legacy issue filter through patched minimatch", () => {
  const pluginRoot = dirname(nestRequire.resolve("fork-ts-checker-webpack-plugin/package.json"));
  const { createIssuePredicateFromIssueMatch } = require(join(pluginRoot, "lib/issue/issue-match.js"));
  const filter = createIssuePredicateFromIssueMatch("/fixture", { file: "src/**/*.ts", severity: "error" });
  assert.equal(filter({ file: "/fixture/src/chapter.ts", severity: "error" }), true);
  assert.equal(filter({ file: "/fixture/src/chapter.js", severity: "error" }), false);
  assert.equal(filter({ file: "/fixture/src/chapter.ts", severity: "warning" }), false);
});

test("patched glob preserves Nest sync assets and stops traversal after cancellation", async (t) => {
  const directory = fs.mkdtempSync(join(tmpdir(), "secure-glob-"));
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  for (const folder of ["src", "src/nested", "src/excluded"]) fs.mkdirSync(join(directory, folder), { recursive: true });
  for (const file of ["src/a.json", "src/.hidden.json", "src/nested/b.json", "src/excluded/c.json"]) {
    fs.writeFileSync(join(directory, file), "{}");
  }
  const glob = nestRequire("glob");
  assert.equal(nestRequire("glob/package.json").version, "14.0.2");
  assert.deepEqual(glob.sync("src/**/*.json", { cwd: directory, dot: true, ignore: "src/excluded/**" }).sort(),
    ["src/.hidden.json", "src/a.json", "src/nested/b.json"]);
  const { AssetsManager } = nestRequire("./lib/compiler/assets-manager.js");
  const target = join(directory, "dist");
  new AssetsManager().copyAssets({ sourceRoot: relative(process.cwd(), join(directory, "src")), compilerOptions: {
    assets: [{ include: "**/*.json", exclude: "excluded/**" }]
  } }, undefined, target, false);
  assert.equal(fs.readFileSync(join(target, "nested/b.json"), "utf8"), "{}");
  assert.equal(fs.existsSync(join(target, "excluded/c.json")), false);
  const controller = new AbortController();
  let reads = 0;
  const hookedFs = { ...fs, readdir(path, options, callback) {
    reads++;
    fs.readdir(path, options, (error, entries) => { controller.abort(); callback(error, entries); });
  } };
  await assert.rejects(glob.glob("**/*", { cwd: directory, fs: hookedFs, signal: controller.signal }), /abort/iu);
  await new Promise((resolve) => setTimeout(resolve, 30));
  assert.equal(reads, 1, "No recursive traversal may continue after the first aborted directory read");
});

test("dependency patches are available before frozen container installation and in canonical release packaging", () => {
  for (const name of ["api", "web"]) {
    const docker = fs.readFileSync(new URL(`../../../deploy/staging/Dockerfile.${name}`, import.meta.url), "utf8");
    assert.ok(docker.indexOf("COPY patches patches") >= 0);
    assert.ok(docker.indexOf("COPY patches patches") < docker.indexOf("RUN pnpm install --frozen-lockfile"));
  }
  const release = fs.readFileSync(new URL("../../../scripts/create-rc1-artifact.mjs", import.meta.url), "utf8");
  assert.match(release, /\["patches", "patches"\]/u);
});
