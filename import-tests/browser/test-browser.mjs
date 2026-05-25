import { chromium } from "playwright";
import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import { join, extname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

const MIME = { ".html": "text/html", ".js": "application/javascript" };

const server = createServer((req, res) => {
  const filePath = join(__dirname, req.url === "/" ? "index.html" : req.url);
  try {
    const content = readFileSync(filePath);
    res.writeHead(200, { "Content-Type": MIME[extname(filePath)] || "text/plain" });
    res.end(content);
  } catch {
    res.writeHead(404);
    res.end("Not found");
  }
});

await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const port = server.address().port;

const PAGES = ["test-full.html", "test-core.html"];

let pass = 0;
let fail = 0;

const browser = await chromium.launch();

for (const page of PAGES) {
  const url = `http://127.0.0.1:${port}/${page}`;
  const ctx = await browser.newContext();
  const tab = await ctx.newPage();

  try {
    await tab.goto(url, { waitUntil: "networkidle" });

    const results = await tab.evaluate(() => window.__TEST_RESULTS__);

    if (!results || results.length === 0) {
      console.log(`FAIL browser ${page} — no test results (module may have failed to load)`);
      fail++;
      continue;
    }

    for (const r of results) {
      if (r.ok) {
        console.log(`PASS browser ${r.test}`);
        pass++;
      } else {
        console.log(`FAIL browser ${r.test}${r.error ? " — " + r.error : ""}`);
        fail++;
      }
    }
  } catch (e) {
    console.log(`FAIL browser ${page} — ${e.message}`);
    fail++;
  } finally {
    await ctx.close();
  }
}

await browser.close();
server.close();

console.log(`BROWSER_PASS=${pass}`);
console.log(`BROWSER_FAIL=${fail}`);

if (fail > 0) {
  process.exit(1);
}
