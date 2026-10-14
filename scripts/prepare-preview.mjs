import { readdir, readFile, writeFile, stat } from "node:fs/promises";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

export function previewBase(value = "/preview-redesign/") {
  if (!/^\/[a-z0-9-]+\/$/.test(value)) throw new Error("Preview must use one dedicated subdirectory, never the site root.");
  return value;
}

export function rewritePreviewHtml(html, base = "/preview-redesign/") {
  previewBase(base);
  const rewritten = html.replace(/\b(href|src|srcset|poster|data-full|action)=(["'])([\s\S]*?)\2/g, (attribute, name, quote, value) => {
    const prefixed = value.replace(/(^|[\s,])(\/(?!\/)[^\s,]*)/g, (match, separator, url) =>
      separator + (url.startsWith(base) ? url : base + url.slice(1))
    );
    return name + "=" + quote + prefixed + quote;
  });
  if (rewritten.includes('name="preview-build"')) return rewritten;
  const en = /<html[^>]+lang="en"/i.test(rewritten);
  return rewritten
    .replace(/<head(?:\s[^>]*)?>/i, '$&<meta name="robots" content="noindex, nofollow"><meta name="preview-build" content="redesign"><style>.preview-notice{padding:.55rem 1rem;background:#2c1810;color:#efc69a;font:600 12px/1.4 system-ui;text-align:center;border-bottom:1px solid #69412c}</style>')
    .replace(/<body(?:\s[^>]*)?>/i, '$&<div class="preview-notice">' + (en ? "Test version · Let us know what you think." : "Wersja testowa · Daj znać, co sądzisz.") + "</div>");
}

async function htmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(entry => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? htmlFiles(path) : entry.isFile() && entry.name.endsWith(".html") ? [path] : [];
  }));
  return nested.flat();
}

export async function preparePreview() {
  const base = previewBase(process.env.PREVIEW_BASE_PATH || "/preview-redesign/");
  const directory = fileURLToPath(new URL("../dist/", import.meta.url));
  if (!(await stat(directory)).isDirectory()) throw new Error("Build dist first.");
  const files = await htmlFiles(directory);
  if (!files.length) throw new Error("No HTML files found in dist.");
  for (const path of files) await writeFile(path, rewritePreviewHtml(await readFile(path, "utf8"), base));
  await writeFile(join(directory, ".htaccess"), '<IfModule mod_headers.c>\n  Header set X-Robots-Tag "noindex, nofollow"\n</IfModule>\n');
  await writeFile(join(directory, "robots.txt"), "User-agent: *\nDisallow: /\n");
  console.log(`Prepared ${files.length} preview pages at ${base}; production source files unchanged.`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await preparePreview();
}
