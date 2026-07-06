// ============ Централизованная карта ассетов ============
// Сгенерированы через Higgsfield (сессия 2026-07-05) и подключаются
// по публичным CDN-URL. Чтобы перевести на локальные файлы: запустите
// node scripts/fetch-assets.mjs (на машине без сетевых ограничений)
// и поставьте LOCAL = true.
const LOCAL = false;

const CDN = 'https://d8j0ntlcm91z4.cloudfront.net/user_32Q9KWTtKxuO9vGsur6JRmOi1Zg';

// url — CDN Higgsfield; local — путь в public/assets/
const map = {
  poolGlb: { url: 'https://d3u0tzju9qaucj.cloudfront.net/7d051b5a-7bfe-49fe-a484-24e7b3a9458a/e8c8db88-ef52-49e1-8eda-d9128f7e40cc.glb', local: '/assets/models/pool.glb' },
  heroPoster: { url: `${CDN}/hf_20260705_184001_6e9356d2-de84-44d4-b978-f68a07e8b9da_min.webp`, local: '/assets/hero_pool_terrace.webp' },
  // фон hero (вариант A; вариант B: hf_20260705_235710_bfb01944-…)
  heroBg: { url: `${CDN}/hf_20260705_235710_c92d87ee-e5d6-4bdd-b374-0da5ec671752_min.webp`, local: '/assets/hero-bg.webp' },
  // вода: фон тёмных секций (tech, life)
  waterBg: { url: `${CDN}/hf_20260706_002219_4b5976c2-0b6d-4713-8762-77f4a8cf2a26_min.webp`, local: '/assets/water-bg.webp' },
  // фотореальная стройка (один двор, один ракурс); stage-8 = heroBg (финал = мечта)
  'stage-1': { url: `${CDN}/hf_20260706_004238_881c2613-f738-424c-9a0c-9b165b9fd9cf_min.webp`, local: '/assets/stage-1.webp' },
  'stage-2': { url: `${CDN}/hf_20260706_004446_13c88a5e-a600-40b3-be74-a75493d811bd_min.webp`, local: '/assets/stage-2.webp' },
  'stage-3': { url: `${CDN}/hf_20260706_004617_1521c2f5-87ab-4c65-a3ba-7f5d06047ee0_min.webp`, local: '/assets/stage-3.webp' },
  'stage-4': { url: `${CDN}/hf_20260706_004757_c28072b9-10ad-424a-956d-6bff00d45030_min.webp`, local: '/assets/stage-4.webp' },
  'stage-5': { url: '', local: '/assets/stage-5.webp' },
  'stage-6': { url: '', local: '/assets/stage-6.webp' },
  'stage-7': { url: '', local: '/assets/stage-7.webp' },
  'stage-8': { url: `${CDN}/hf_20260705_235710_c92d87ee-e5d6-4bdd-b374-0da5ec671752_min.webp`, local: '/assets/hero-bg.webp' },
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
