import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = join(fileURLToPath(new URL("..", import.meta.url)));

const rewrites = [
  {
    file: "dist/index.js",
    replacements: [
      ['"./json-master-format"', '"./json-master-format/index.js"'],
      ['"./configuration"', '"./configuration.js"'],
      ['"./errors"', '"./errors.js"'],
      ["'./json-master-format'", "'./json-master-format/index.js'"],
      ["'./configuration'", "'./configuration.js'"],
      ["'./errors'", "'./errors.js'"],
      ['"./language-policy"', '"./language-policy.js"'],
      ['"./localization"', '"./localization.js"'],
      ['"./structured-logging"', '"./structured-logging.js"'],
      ['"./canonical-data"', '"./canonical-data.js"'],
      ['"./editorial-core"', '"./editorial-core.js"'],
      ['"./unified-library"', '"./unified-library.js"'],
      ['"./publishing-engine"', '"./publishing-engine.js"'],
      ['"./distribution-commerce"', '"./distribution-commerce.js"'],
      ['"./multimedia-production"', '"./multimedia-production.js"'],
      ["'./language-policy'", "'./language-policy.js'"],
      ["'./localization'", "'./localization.js'"],
      ["'./structured-logging'", "'./structured-logging.js'"],
      ["'./canonical-data'", "'./canonical-data.js'"],
      ["'./editorial-core'", "'./editorial-core.js'"],
      ["'./unified-library'", "'./unified-library.js'"],
      ["'./publishing-engine'", "'./publishing-engine.js'"],
      ["'./distribution-commerce'", "'./distribution-commerce.js'"],
      ["'./multimedia-production'", "'./multimedia-production.js'"]
    ]
  },
  {
    file: "dist/json-master-format/index.js",
    replacements: [
      ['"./schema"', '"./schema.js"'],
      ['"./types"', '"./types.js"'],
      ['"./validation"', '"./validation.js"'],
      ["'./schema'", "'./schema.js'"],
      ["'./types'", "'./types.js'"],
      ["'./validation'", "'./validation.js'"]
    ]
  },
  {
    file: "dist/json-master-format/schema.js",
    replacements: [
      ['"./types"', '"./types.js"'],
      ["'./types'", "'./types.js'"]
    ]
  },
  {
    file: "dist/json-master-format/validation.js",
    replacements: [
      ['"./types"', '"./types.js"'],
      ["'./types'", "'./types.js'"]
    ]
  }
];

for (const rewrite of rewrites) {
  const filePath = join(packageRoot, rewrite.file);
  let content = await readFile(filePath, "utf8");

  for (const [before, after] of rewrite.replacements) {
    content = content.replaceAll(before, after);
  }

  await writeFile(filePath, content);
}
