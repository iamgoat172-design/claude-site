// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

// База задаётся переменной PAGES_BASE только в GitHub Actions (проектная
// страница вида /claude-site). Локально (npm run dev / build) — корень "/".
const base = process.env.PAGES_BASE || '/';

// SINGLEFILE=1 — собрать один автономный HTML (стили и скрипты вшиты внутрь),
// который открывается двойным кликом. Обычная сборка этим не затрагивается.
const singleFile = process.env.SINGLEFILE === '1';

// https://astro.build/config
export default defineConfig({
  site: 'https://iamgoat172-design.github.io',
  base,
  build: singleFile ? { inlineStylesheets: 'always', assets: '_astro' } : {},
  vite: {
    plugins: singleFile ? [tailwindcss(), viteSingleFile()] : [tailwindcss()],
  },
});
