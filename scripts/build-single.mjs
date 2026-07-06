// Сборка самодостаточного одностраничного riverpools.html:
// vite build (один JS-чанк) + инлайн CSS/JS + favicon в data-uri.
// Запуск: node scripts/build-single.mjs [outDir]
import { execSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = process.argv[2] || join(tmpdir(), 'riverpools-single');
const work = mkdtempSync(join(tmpdir(), 'rp-single-'));

const config = `export default {
  root: ${JSON.stringify(root)},
  base: './',
  build: {
    target: 'es2019',
    outDir: ${JSON.stringify(join(work, 'dist'))},
    emptyOutDir: true,
    cssCodeSplit: false,
    rollupOptions: {
      input: ${JSON.stringify(join(root, 'index.html'))},
      output: { inlineDynamicImports: true, manualChunks: undefined },
    },
  },
};\n`;
const cfgPath = join(work, 'vite.single.config.js');
writeFileSync(cfgPath, config);
execSync(`node ${JSON.stringify(join(root, 'node_modules/vite/bin/vite.js'))} build --config ${JSON.stringify(cfgPath)}`, {
  stdio: 'inherit',
});

const dist = join(work, 'dist');
let html = readFileSync(join(dist, 'index.html'), 'utf-8');

html = html.replace(/<link rel="stylesheet"[^>]*href="\.\/(assets\/[^"]+\.css)"[^>]*>/g, (_, p) =>
  '<style>' + readFileSync(join(dist, p), 'utf-8') + '</style>'
);
html = html.replace(/<script type="module"[^>]*src="\.\/(assets\/[^"]+\.js)"[^>]*><\/script>/g, (_, p) =>
  '<script type="module">' + readFileSync(join(dist, p), 'utf-8').replaceAll('</script>', '<\\/script>') + '</script>'
);
const logo = readFileSync(join(root, 'public/assets/logo-light.svg'));
html = html.replace(/<link rel="icon"[^>]*>/,
  `<link rel="icon" href="data:image/svg+xml;base64,${logo.toString('base64')}" type="image/svg+xml" />`
);

// локальные реальные фото (/assets/real/…) → data-uri, чтобы одностраничник
// работал через file:// без папки ассетов. Пути встречаются в HTML и в
// инлайновом JS (карта ассетов).
html = html.replace(/\/assets\/real\/[^"'`)\s\\]+\.webp/g, (m) => {
  try {
    const buf = readFileSync(join(root, 'public', m));
    return `data:image/webp;base64,${buf.toString('base64')}`;
  } catch {
    return m;
  }
});

execSync(`mkdir -p ${JSON.stringify(outDir)}`);
const out = join(outDir, 'riverpools.html');
writeFileSync(out, html);
console.log('✓', out, `(${(html.length / 1024).toFixed(0)} КБ)`);
