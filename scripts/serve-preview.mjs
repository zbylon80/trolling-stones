import { createServer } from "node:http";
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { resolve, sep, extname } from "node:path";
import { fileURLToPath } from "node:url";
import { previewBase } from "./prepare-preview.mjs";

const directory = fileURLToPath(new URL("../dist/", import.meta.url));
const base = previewBase(process.env.PREVIEW_BASE_PATH || "/preview-redesign/");
const port = Number(process.env.PREVIEW_PORT || 4323);
const types = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".svg": "image/svg+xml", ".jpg": "image/jpeg", ".png": "image/png", ".webp": "image/webp", ".ico": "image/x-icon", ".mp4": "video/mp4", ".pdf": "application/pdf", ".txt": "text/plain", ".xml": "application/xml" };
createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
    if (pathname === base.slice(0, -1)) { response.writeHead(302, { Location: base }).end(); return; }
    if (!pathname.startsWith(base)) { response.writeHead(404).end(); return; }
    let path = resolve(directory, pathname.slice(base.length));
    if (path !== resolve(directory) && !path.startsWith(resolve(directory) + sep)) { response.writeHead(403).end(); return; }
    if ((await stat(path)).isDirectory()) path = resolve(path, "index.html");
    response.writeHead(200, { "Content-Type": types[extname(path)] || "application/octet-stream", "X-Robots-Tag": "noindex, nofollow" });
    createReadStream(path).pipe(response);
  } catch { response.writeHead(404).end(); }
}).listen(port, "127.0.0.1", () => console.log(`Preview build: http://localhost:${port}${base}`));
