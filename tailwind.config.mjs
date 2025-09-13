/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fdf3f3',
          100: '#fde3e3',
          200: '#fccccc',
          300: '#faa5a5',
          400: '#f67474',
          500: '#eb4b4b',
          600: '#d33232',
          700: '#b12828',
          800: '#922626',
          900: '#7a2626',
        },
      },
    },
  },
  plugins: [],
};

