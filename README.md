TRolling Stones — strona zespołu (Astro + Tailwind)

Lokalny rozwój
- Wymagania: Node 20+
- Pierwsza instalacja: `npm install` (generuje `package-lock.json`)
- Dev: `npm run dev` — http://localhost:4321
- Build: `npm run build` — wynik w `dist/`

Stack
- Framework: Astro (static output)
- Styling: Tailwind CSS
- Wideo: komponent `src/components/YouTubeEmbed.astro`
- Hosting: Hostinger (FTP/FTPS)
- CI/CD: GitHub Actions → FTP deploy

Struktura
- `src/pages/` — strony (`/`, `/koncerty`, `/galeria`, `/aktualnosci`, `/epk`, `/kontakt`)
- `src/components/` — `Layout.astro`, `YouTubeEmbed.astro`
- `src/styles/global.css` — Tailwind

Konfiguracja deployu (Hostinger)
1) W repo ustaw sekrety (Settings → Secrets and variables → Actions → New repository secret):
   - `FTP_SERVER` — np. `ftp.twojadomena.pl` lub host z hPanel
   - `FTP_USERNAME` — login FTP
   - `FTP_PASSWORD` — hasło FTP
   - `FTP_SERVER_DIR` — katalog docelowy, np. `/public_html/` lub `/domains/twojadomena.pl/public_html/`
2) Upewnij się, że w Hostinger katalog docelowy wskazuje na docroot Twojej domeny.
3) Push na branch `main` zbuduje i wydeployuje stronę z `dist/`.

Uwaga dot. lockfile
- Jeśli chcesz wrócić do szybszego `npm ci` w CI, wykonaj lokalnie raz `npm install` i dodaj do repo wygenerowany `package-lock.json`. Potem możesz zmienić w workflow `npm install` → `npm ci`.

Uwaga dot. domeny
- W `astro.config.mjs` podmień `site` na pełny URL produkcyjny (np. `https://trolling-stones.pl`).

Pytania/ToDo
- Podmień ID filmu YouTube w `src/pages/index.astro`.
- Dodaj realne treści (teksty, zdjęcia, linki do social mediów).
