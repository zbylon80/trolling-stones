import test from "node:test";
import assert from "node:assert/strict";
import { previewBase, rewritePreviewHtml } from "../scripts/prepare-preview.mjs";

test("preview cannot target the production root or parent directories", () => {
  for (const value of ["/", "", "/../", "/preview/../", "preview", "/preview/nested/"]) assert.throws(() => previewBase(value));
  assert.equal(previewBase(), "/preview-redesign/");
});

test("root links, image sets, videos and full-size photos stay inside preview", () => {
  const source = '<html lang="pl"><head></head><body><a href="/">Home</a><a href="/en/galeria">EN</a><img src="/_astro/image.webp" srcset="/_astro/small.webp 400w, /_astro/big.webp 800w"><video poster="/images/blues.jpg"><source src="/videos/pool-party.mp4"></video><a href="/images/full.jpg" data-full="/images/full.jpg">Photo</a><script src="/_astro/app.js"></script></body></html>';
  const result = rewritePreviewHtml(source);
  for (const path of ["/en/galeria", "/_astro/image.webp", "/_astro/small.webp", "/_astro/big.webp", "/images/blues.jpg", "/videos/pool-party.mp4", "/images/full.jpg", "/_astro/app.js"]) assert(result.includes("/preview-redesign" + path), path);
  assert(result.includes('href="/preview-redesign/"'));
  assert(result.includes('name="robots" content="noindex, nofollow"'));
  assert(result.includes("Wersja testowa"));
});

test("external contacts, media and same-page anchors are not changed", () => {
  const source = '<html lang="en"><head></head><body><a href="https://www.youtube.com/watch?v=test">YouTube</a><a href="mailto:booking@trollingstones.pl">Mail</a><a href="tel:+48509243245">Phone</a><a href="#main-content">Skip</a><img src="//example.com/image.jpg"></body></html>';
  const result = rewritePreviewHtml(source);
  for (const url of ["https://www.youtube.com/watch?v=test", "mailto:booking@trollingstones.pl", "tel:+48509243245", "#main-content", "//example.com/image.jpg"]) assert(result.includes(url));
  assert(result.includes("Test version"));
});

test("preparing the same HTML twice does not duplicate prefixes or notices", () => {
  const once = rewritePreviewHtml('<html lang="pl"><head></head><body><a href="/kontakt">Contact</a></body></html>');
  assert.equal(rewritePreviewHtml(once), once);
});
