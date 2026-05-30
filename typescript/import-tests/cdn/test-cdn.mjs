import { writeFileSync, mkdirSync, rmSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const tmpDir = join(__dirname, ".tmp");

const BUNDLES = [
  {
    name: "jsdelivr full",
    url: "https://cdn.jsdelivr.net/npm/wysiwyv/dist/wysiwyv.min.js",
  },
  {
    name: "jsdelivr core",
    url: "https://cdn.jsdelivr.net/npm/wysiwyv/dist/wysiwyv-core.min.js",
  },
  {
    name: "unpkg full",
    url: "https://unpkg.com/wysiwyv/dist/wysiwyv.min.js",
  },
  {
    name: "unpkg core",
    url: "https://unpkg.com/wysiwyv/dist/wysiwyv-core.min.js",
  },
];

async function testBundle({ name, url }) {
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} from ${url}`);
  }

  const versionFromUrl = res.url.match(/wysiwyv@([^/]+)\//)?.[1];
  const versionFromHeader = res.headers.get("x-jsd-version");
  const version = versionFromUrl ?? versionFromHeader ?? "unknown";

  const js = await res.text();
  if (!js.includes("makeWysiwyv")) {
    throw new Error(`Bundle does not contain makeWysiwyv export`);
  }

  const tmpFile = join(tmpDir, `${name.replace(/\s+/g, "-")}.mjs`);
  writeFileSync(tmpFile, js);

  const mod = await import(pathToFileURL(tmpFile).href);
  if (typeof mod.makeWysiwyv !== "function") {
    throw new Error(
      `makeWysiwyv is ${typeof mod.makeWysiwyv}, expected function`,
    );
  }

  const wyv = mod.makeWysiwyv({ plugins: [] });
  const result = wyv.validate("hello", "hello");
  if (!result.success) {
    throw new Error(`Basic validation failed: ${JSON.stringify(result)}`);
  }

  return { version };
}

mkdirSync(tmpDir, { recursive: true });

let pass = 0;
let fail = 0;

for (const bundle of BUNDLES) {
  try {
    const { version } = await testBundle(bundle);
    bundle.version = version;
    console.log(`PASS cdn ${bundle.name} (v${bundle.version})`);
    pass++;
  } catch (e) {
    console.log(`FAIL cdn ${bundle.name} — ${e.message}`);
    fail++;
  }
}

rmSync(tmpDir, { recursive: true, force: true });

console.log(`CDN_PASS=${pass}`);
console.log(`CDN_FAIL=${fail}`);

if (fail > 0) {
  process.exit(1);
}
