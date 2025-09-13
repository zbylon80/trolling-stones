import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import { fileURLToPath } from 'node:url';

// https://astro.build/config
export default defineConfig({
  site: 'https://example.com', // TODO: podmień na swoją domenę po podpięciu
  integrations: [tailwind({ applyBaseStyles: true }), sitemap()],
  output: 'static',
  // Podgląd w LAN podczas developmentu/preview
  server: {
    host: true,
    port: 4321,
  },
  alias: {
    '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
    '@styles': fileURLToPath(new URL('./src/styles', import.meta.url)),
  },
  site: 'https://trollingstones.pl'
});
