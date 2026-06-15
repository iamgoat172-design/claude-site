// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://xn--80ahclcogc6ci4a.xn--p1ai', // вологодскоезодчество.рф (заглушка для посадочной)
  vite: {
    plugins: [tailwindcss()],
  },
});
