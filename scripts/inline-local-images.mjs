// Вшивает локальные /images/* во все dist/**/*.html как data-URI,
// чтобы автономный HTML открывался двойным кликом (file://) с картинками.
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const dist = 'dist';
const mime = { webp: 'image/webp', png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', svg: 'image/svg+xml', avif: 'image/avif' };
const cache = new Map();

const htmlFiles = [];
const walk = (dir) => { for (const e of readdirSync(dir)) { const f = join(dir, e); statSync(f).isDirectory() ? walk(f) : f.endsWith('.html') && htmlFiles.push(f); } };
walk(dist);

for (const file of htmlFiles) {
  let html = readFileSync(file, 'utf8');
  const paths = [...new Set([...html.matchAll(/\/images\/[^"'`)\s]+?\.(?:webp|png|jpe?g|svg|avif)/g)].map((m) => m[0]))];
  let inlined = 0;
  for (const p of paths) {
    const fsPath = join(dist, p);
    if (!existsSync(fsPath)) { console.warn('missing', p); continue; }
    let uri = cache.get(p);
    if (!uri) {
      const ext = p.split('.').pop().toLowerCase();
      uri = `data:${mime[ext] || 'application/octet-stream'};base64,${readFileSync(fsPath).toString('base64')}`;
      cache.set(p, uri);
    }
    html = html.split(p).join(uri); inlined++;
  }
  writeFileSync(file, html);
  console.log(`${file}: inlined ${inlined}`);
}
