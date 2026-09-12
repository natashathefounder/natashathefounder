// Nitro bundles PGlite beside its JS chunks; retain the companion runtime assets.
// PostgreSQL deployments do not use these, but local production previews do.
import { copyFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const root = fileURLToPath(new URL("../", import.meta.url));
const packageDir = dirname(fileURLToPath(import.meta.resolve("@electric-sql/pglite")));
const output = join(root, ".vercel/output/functions/__server.func/_libs");
await mkdir(output, { recursive: true });
for (const file of ["pglite.data", "pglite.wasm", "initdb.wasm"])
  await copyFile(join(packageDir, file), join(output, file));
console.log("[build] PGlite runtime assets included.");
