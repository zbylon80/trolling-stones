// The owner approved the concert changes and the reviewed gallery for production.
// Gallery sources are pinned to that review; all other protected sources remain
// pinned to the original baseline. Change the fixture only with explicit approval.
import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = fileURLToPath(new URL("../", import.meta.url));
const baseline = JSON.parse(await readFile(new URL("fixtures/production-baseline.json", import.meta.url), "utf8"));
const normalize = text => text.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n");

test("production preserves the original site outside the approved concerts and pinned gallery", async () => {
  const files = await readdir(path.join(root, "src"), { recursive: true, withFileTypes: true });
  const sources = files.filter(entry => entry.isFile()).map(entry => path.relative(root, path.join(entry.parentPath ?? entry.path, entry.name)).replaceAll("\\", "/"));
  const protectedPaths = sources.filter(source => !baseline.allowedConcertPaths.includes(source)).sort();
  assert.deepEqual(protectedPaths, Object.keys(baseline.protectedSources).sort(), "Unexpected non-concert source added or removed from production");
  for (const [source, expected] of Object.entries(baseline.protectedSources)) {
    const content = normalize(await readFile(path.join(root, source), "utf8"));
    assert.equal(createHash("sha256").update(content).digest("hex"), expected, `${source} differs from the approved production sources`);
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

test("the official gallery has the reviewed photos and captions, without preview paths", async () => {
  const albums = JSON.parse(await readFile(path.join(root, "src", "data", "gallery-albums.json"), "utf8"));
  for (const locale of ["", "en/"]) {
    const html = await readFile(path.join(root, "dist", locale, "galeria", "index.html"), "utf8");
    assert(!/preview-build|\/preview-(redesign|gallery)\/|name="robots" content="noindex/.test(html));
    assert(html.includes("Out Of Control") && html.includes('href="https://lesniczowka.art.pl/o-nas/"'));
    const captions = html.match(/<figcaption\b[^>]*>[\s\S]*?<\/figcaption>/g) ?? [];
    assert.equal(captions.length, 3);
    assert(captions.every(caption => caption.includes("Jaryczewski")));
    const photos = html.match(/<a class="album-photo\b[^>]*>/g) ?? [];
    assert.equal(photos.length, 428);
    const highlights = html.match(/<a class="mosaic-shot\b[^>]*>/g) ?? [];
    assert.equal(highlights.length, 5);
    assert(highlights.every(link => link.includes("data-lightbox-hide-caption")));
    assert(highlights[0].includes('href="/images/gallery/scena-i-publicznosc/024.webp"'));
    assert(html.includes(locale ? "Live in Rumia" : "Koncert w Rumii"));
    const zoomWithCaption = photos.filter(link => !link.includes("data-lightbox-hide-caption"));
    assert.deepEqual(zoomWithCaption.map(link => link.match(/href="([^"]+)"/)?.[1]), ["004", "007", "010"]
      .map(file => `/images/gallery/czerwona-scena/${file}.webp`));
    for (const album of albums) {
      for (const { file, assetAlbum } of album.photos) {
        const asset = `images/gallery/${assetAlbum ?? album.id}`;
        assert(html.includes(`href="/${asset}/${file}"`));
        assert(html.includes(`src="/${asset}/thumbs/${file}"`));
        if (locale) continue;
        for (const version of ["", "thumbs/"]) {
          const image = await readFile(path.join(root, "dist", asset, version + file));
          assert.equal(image.toString("ascii", 8, 12), "WEBP");
        }
      }
    }
  }
});
