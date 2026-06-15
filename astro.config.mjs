// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// База задаётся переменной PAGES_BASE только в GitHub Actions (проектная
// страница вида /claude-site). Локально (npm run dev / build) — корень "/".
const base = process.env.PAGES_BASE || '/';

// https://astro.build/config
export default defineConfig({
  site: 'https://iamgoat172-design.github.io',
  base,
  vite: {
    plugins: [tailwindcss()],
  },
});
