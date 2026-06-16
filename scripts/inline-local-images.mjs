// Вшивает локальные /images/* в dist/index.html как data-URI,
// чтобы автономный HTML открывался двойным кликом (file://) с картинками.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const dist = 'dist';
const file = join(dist, 'index.html');
let html = readFileSync(file, 'utf8');

const mime = { webp: 'image/webp', png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', svg: 'image/svg+xml', avif: 'image/avif' };
const paths = [...new Set([...html.matchAll(/\/images\/[^"'`)\s]+?\.(?:webp|png|jpe?g|svg|avif)/g)].map(m => m[0]))];

let inlined = 0, missing = 0;
for (const p of paths) {
  const fsPath = join(dist, p);
  if (!existsSync(fsPath)) { missing++; console.warn('missing', p); continue; }
  const ext = p.split('.').pop().toLowerCase();
  const b64 = readFileSync(fsPath).toString('base64');
  const uri = `data:${mime[ext] || 'application/octet-stream'};base64,${b64}`;
  html = html.split(p).join(uri);
  inlined++;
}
writeFileSync(file, html);
console.log(`inlined ${inlined} local image(s), ${missing} missing`);
