// Скачивает CDN-ассеты Higgsfield в public/assets/, чтобы перевести сайт
// на локальные файлы (src/data/assets.js → LOCAL = true).
// Запуск на машине без сетевых ограничений: node scripts/fetch-assets.mjs
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const text = await readFile(join(root, 'src/data/assets.js'), 'utf-8');
const entries = [...text.matchAll(/['"]?([\w-]+)['"]?:\s*\{\s*url:\s*'([^']*)',\s*local:\s*'([^']+)'/g)];

let ok = 0;
for (const [, key, url, local] of entries) {
  if (!url) {
    console.log(`— ${key}: url пуст, пропуск`);
    continue;
  }
  const dest = join(root, 'public', local.replace(/^\//, ''));
  await mkdir(dirname(dest), { recursive: true });
  const res = await fetch(url);
  if (!res.ok) {
    console.error(`✗ ${key}: HTTP ${res.status}`);
    continue;
  }
  await writeFile(dest, Buffer.from(await res.arrayBuffer()));
  console.log(`✓ ${key} → ${dest}`);
  ok++;
}
console.log(`\nГотово: ${ok}/${entries.length}. Теперь в src/data/assets.js поставьте LOCAL = true.`);
