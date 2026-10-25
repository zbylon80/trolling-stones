// The owner approved only concert changes on production. The redesign stays on
// its separate preview branch. Change this baseline only with explicit approval
// for a broader production scope; it is independent of Git's checkout depth.
import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = fileURLToPath(new URL("../", import.meta.url));
const baseline = JSON.parse(await readFile(new URL("fixtures/production-baseline.json", import.meta.url), "utf8"));
const normalize = text => text.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n");

test("production preserves every non-concert source from the approved previous site", async () => {
  const files = await readdir(path.join(root, "src"), { recursive: true, withFileTypes: true });
  const sources = files.filter(entry => entry.isFile()).map(entry => path.relative(root, path.join(entry.parentPath ?? entry.path, entry.name)).replaceAll("\\", "/"));
  const protectedPaths = sources.filter(source => !baseline.allowedConcertPaths.includes(source)).sort();
  assert.deepEqual(protectedPaths, Object.keys(baseline.protectedSources).sort(), "Unexpected non-concert source added or removed from production");
  for (const [source, expected] of Object.entries(baseline.protectedSources)) {
    const content = normalize(await readFile(path.join(root, source), "utf8"));
    assert.equal(createHash("sha256").update(content).digest("hex"), expected, `${source} differs from approved production ${baseline.baseline}`);
  }
});

for (const locale of ["", "en/"]) {
  test(`built homepage retains the original hero, header and video carousel: ${locale || "pl"}`, async () => {
    const html = await readFile(path.join(root, "dist", locale, "index.html"), "utf8");
    assert(html.includes('src="/images/hero.jpg"'));
    assert(html.includes('src="/images/logo.jpg"'));
    assert(html.includes('id="yt-container"'));
    assert(!html.includes("Bez hamulców."));
    assert(!html.includes("Full throttle."));
    assert(!html.includes("preview-redesign/"));
    assert(!html.includes("preview-build"));
    assert(!html.includes('name="robots" content="noindex'));
  });
}
