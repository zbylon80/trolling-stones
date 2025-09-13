import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import { fileURLToPath } from 'node:url';

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind({ applyBaseStyles: true }), sitemap()],
  output: 'static',
  // LAN preview during development/preview
  server: {
    host: true,
    port: 4321,
  },
  alias: {
    '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
    '@styles': fileURLToPath(new URL('./src/styles', import.meta.url)),
  },
  site: 'https://trollingstones.pl',
});

