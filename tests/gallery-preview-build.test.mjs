import test from "node:test";
import assert from "node:assert/strict";
import { readFile, readdir, stat } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const dist = fileURLToPath(new URL("../dist/", import.meta.url));
const base = "/preview-gallery/";
const albums = JSON.parse(await readFile(new URL("../src/data/gallery-albums.json", import.meta.url), "utf8"));

test("all HTML is a gallery preview, with no links or assets escaping the preview path", async () => {
  const pages = (await readdir(dist, { recursive: true })).filter(file => file.endsWith(".html"));
  assert.equal(pages.length, 15);
  for (const page of pages) {
    const html = await readFile(join(dist, page), "utf8");
    assert(html.includes('name="preview-build" content="gallery"'), page);
    assert(html.includes('name="robots" content="noindex, nofollow"'), page);
    assert(!html.includes("/preview-redesign/"), page);
    for (const [, , value] of html.matchAll(/\b(?:href|src|srcset|poster|data-full|action)=(["'])(.*?)\1/gs)) {
      for (const [, url] of value.matchAll(/(?:^|[\s,])(\/(?!\/)[^\s,]*)/g)) {
        assert(url.startsWith(base), `${page}: ${url} escapes the gallery preview`);
      }
    }
  }
  const home = await readFile(join(dist, "index.html"), "utf8");
  assert(home.includes(`src="${base}images/hero.jpg"`));
  assert(home.includes('id="yt-container"'));
  const headers = await readFile(join(dist, ".htaccess"), "utf8");
  assert(headers.includes('Header set X-Robots-Tag "noindex, nofollow"'));
  await assert.rejects(stat(join(dist, "images/send")), { code: "ENOENT" });
});

test("both gallery pages contain the new layout, and every photo is packaged in both sizes", async () => {
  for (const page of ["galeria/index.html", "en/galeria/index.html"]) {
    const html = await readFile(join(dist, page), "utf8");
    const sections = ["gallery-main", "gallery-promotional", "gallery-concerts"].map(id => html.indexOf(`id="${id}"`));
    assert(sections[0] >= 0 && sections[0] < sections[1] && sections[1] < sections[2], page);
    assert(html.includes("Paula Szczepkowska"), page);
    assert(html.includes("Jaryczewski"), page);
    assert(html.includes('datetime="2025-12-06"'), page);
    assert.equal((html.match(/class="album-photo/g) ?? []).length, 428, page);
    for (const album of albums) {
      for (const { file } of album.photos) {
        const asset = `images/gallery/${album.id}`;
        assert(html.includes(`href="${base}${asset}/${file}"`), `${page}: ${file}`);
        assert(html.includes(`src="${base}${asset}/thumbs/${file}"`), `${page}: ${file}`);
        if (page.startsWith("en/")) continue;
        for (const version of ["", "thumbs/"]) {
          const image = await readFile(join(dist, asset, version + file));
          assert.equal(image.toString("ascii", 8, 12), "WEBP", `${asset}/${version}${file}`);
        }
      }
    }
  }
});
