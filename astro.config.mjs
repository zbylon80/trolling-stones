import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import { fileURLToPath } from 'node:url';

// https://astro.build/config
export default defineConfig({
  site: 'https://example.com', // TODO: podmień na swoją domenę po podpięciu
  integrations: [tailwind({ applyBaseStyles: true })],
  output: 'static',
  alias: {
    '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
    '@styles': fileURLToPath(new URL('./src/styles', import.meta.url)),
  }
});
