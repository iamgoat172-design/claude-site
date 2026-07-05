// ============ Централизованная карта ассетов ============
// Сгенерированы через Higgsfield (сессия 2026-07-05) и подключаются
// по публичным CDN-URL. Чтобы перевести на локальные файлы: запустите
// node scripts/fetch-assets.mjs (на машине без сетевых ограничений)
// и поставьте LOCAL = true.
const LOCAL = false;

const CDN = 'https://d8j0ntlcm91z4.cloudfront.net/user_32Q9KWTtKxuO9vGsur6JRmOi1Zg';

// url — CDN Higgsfield; local — путь в public/assets/
const map = {
  poolGlb: { url: '', local: '/assets/models/pool.glb' },
  heroPoster: { url: `${CDN}/hf_20260705_184001_6e9356d2-de84-44d4-b978-f68a07e8b9da_min.webp`, local: '/assets/hero_pool_terrace.webp' },
  techEcoclean: { url: `${CDN}/hf_20260705_184003_ec38aa43-a01a-4a42-b544-b6496ec7f7c0_min.webp`, local: '/assets/tech_ecoclean_water.webp' },
  techAquabiography: { url: `${CDN}/hf_20260705_184006_e629e228-a916-457e-a043-f5bf88be21aa_min.webp`, local: '/assets/tech_aquabiography_night.webp' },
  'life-1': { url: `${CDN}/hf_20260705_184014_3d6a2044-cda4-40e3-b5dc-a69b372dc25b_min.webp`, local: '/assets/life-1.webp' },
  'life-2': { url: `${CDN}/hf_20260705_184015_e76028e1-73df-4aa1-aab5-571bdfd3d8d8_min.webp`, local: '/assets/life-2.webp' },
  'life-3': { url: `${CDN}/hf_20260705_184018_183199b5-f501-4589-b931-17ea0c743415_min.webp`, local: '/assets/life-3.webp' },
  'life-4': { url: `${CDN}/hf_20260705_184019_ddccf1a7-400f-4ccf-8395-d6d64ca18395_min.webp`, local: '/assets/life-4.webp' },
  'work-1': { url: `${CDN}/hf_20260705_184032_a3009e33-8b32-4657-95ac-fea80aad7cdf_min.webp`, local: '/assets/work-1.webp' },
  'work-2': { url: `${CDN}/hf_20260705_184033_f8603457-257a-4349-bcbd-3f48aa897195_min.webp`, local: '/assets/work-2.webp' },
  'work-3': { url: `${CDN}/hf_20260705_184035_a2bdd88e-8dfb-4e20-9c24-98319d41d483_min.webp`, local: '/assets/work-3.webp' },
  'work-4': { url: `${CDN}/hf_20260705_184036_6b54e512-dc0b-4347-8a76-33e9d12063d6_min.webp`, local: '/assets/work-4.webp' },
  'work-5': { url: `${CDN}/hf_20260705_184044_a91868fc-2be4-4050-9c7b-1ac4952baa3a_min.webp`, local: '/assets/work-5.webp' },
  'work-6': { url: `${CDN}/hf_20260705_184046_0c66c83e-58b5-408f-a78c-66bc1165b40e_min.webp`, local: '/assets/work-6.webp' },
  'work-7': { url: `${CDN}/hf_20260705_184048_926f17b1-4a98-4b5a-ae04-92b8800aff53_min.webp`, local: '/assets/work-7.webp' },
  'work-8': { url: `${CDN}/hf_20260705_184049_3722c66a-d353-4b16-8ba1-0fa622576460_min.webp`, local: '/assets/work-8.webp' },
};

export function asset(key) {
  const a = map[key];
  if (!a) return '';
  if (LOCAL) return a.local;
  return a.url || '';
}
