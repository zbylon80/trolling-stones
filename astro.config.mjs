import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  site: 'https://example.com', // TODO: podmień na swoją domenę po podpięciu
  integrations: [tailwind({ applyBaseStyles: true })],
  output: 'static',
  alias: {
    '@components': './src/components',
    '@styles': './src/styles',
  }
});
