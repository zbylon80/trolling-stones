TRolling Stones — band website (Astro + Tailwind)

Local development
- Requirements: Node.js 20+
- Install dependencies: `npm install`
- Start dev server: `npm run dev` (http://localhost:4321)
- Build for production: `npm run build` (outputs to `dist/`)

Tech stack
- Framework: Astro (static output)
- Styling: Tailwind CSS
- Interactive media: `src/components/YouTubeCarousel.astro`, `YouTubeEmbed.astro`, `Lightbox.astro`
- Hosting: Hostinger (FTP/FTPS)
- CI/CD: GitHub Actions + SamKirkland/FTP-Deploy-Action

Site map
- Polish routes: `/`, `/koncerty`, `/galeria`, `/aktualnosci`, `/bio`, `/sklad`, `/kontakt`
- English routes: `/en`, `/en/koncerty`, `/en/galeria`, `/en/aktualnosci`, `/en/bio`, `/en/sklad`, `/en/kontakt`
- Error page: `/404`

Repository structure
- `src/pages/` — Astro pages for both language versions
- `src/components/` — shared UI (layout, carousels, lightbox, cookie banner)
- `src/styles/global.css` — Tailwind entry point and global tweaks
- `public/` — static assets (images, videos, PDFs, favicons)

Hostinger deployment
1. Configure repository secrets (Settings → Secrets and variables → Actions). Preferred keys: `TS_FTP_HOST`, `TS_FTP_USERNAME`, `TS_FTP_PASSWORD`, `TS_FTP_DIR` (the workflow still falls back to `FTP_*` and `EI_FTP_*` if present).
2. Ensure the target directory matches your domain docroot (e.g. `/public_html/` or `/domains/your-domain/public_html/`).
3. Pushing to the `main` branch runs `npm run build` and deploys the `dist/` folder via FTPS.

Operational notes
- Update `site` in `astro.config.mjs` to the canonical production URL (e.g. `https://trolling-stones.pl`).
- Replace the placeholder YouTube IDs in `src/components/YouTubeCarousel.astro` (and related CTAs) with live performances when ready.
- Tailwind configuration lives in `tailwind.config.mjs`; adjust colours or fonts there if the visual identity changes.
