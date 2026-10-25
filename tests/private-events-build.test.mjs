// Run after npm run build or npm run build:preview.
import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

for (const page of ["koncerty", "en/koncerty"]) {
  test(`private shows and their illustrations are present in the published build: ${page}`, async () => {
    const html = await readFile(new URL(`../dist/${page}/index.html`, import.meta.url), "utf8");
    assert(!html.includes("data-demo-concert"));
    assert(!html.includes("Wpis testowy"));
    assert(!html.includes("Sample entry"));
    for (const date of ["2026-10-02", "2026-08-22", "2026-03-13", "2026-01-17", "2025-10-10", "2025-08-23", "2025-06-20", "2025-03-15"]) {
      assert(html.includes(`datetime="${date}"`), `private-show date ${date} is missing from ${page}`);
    }
    assert.equal((html.match(/class="memory-card concert-entry"/g) ?? []).length, 23);
    assert.equal((html.match(/class="older-concert concert-entry"/g) ?? []).length, 7);
    const disclosure = html.match(/<details\b[^>]*class="older-shows"[^>]*>/)?.[0];
    assert(disclosure, "native older-shows disclosure is missing");
    assert(!/\sopen(?:\s|=|>)/.test(disclosure), "older shows should be collapsed initially");
    assert(html.includes(page.startsWith("en/") ? "Older shows" : "Starsze koncerty"));
    assert.equal((html.match(/data-private-concert="true"/g) ?? []).length, 8);
    assert.equal((html.match(/class="private-event-thumbnail"/g) ?? []).length, 8);
    // Owner-supplied private entries remain separate from source-verified MusicEvent records.
    const metadata = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)]
      .filter((match) => match[1].includes('"@graph"'))
      .map((match) => JSON.parse(match[1])).find((data) => data["@graph"]);
    assert.equal(metadata["@graph"].length, 23);
    assert(html.includes("2026-07-11"));
    assert(html.includes("2026-12-05T19:30:00+01:00"));
    assert(html.includes('href="https://www.bluesclub.pl/project/trolling-stones-out-of-control-tour-2024/"'));
    assert.equal(metadata["@graph"][0].offers.url, "https://www.bluesclub.pl/project/trolling-stones-out-of-control-tour-2024/");
  });
}
