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
  // фотореальная стройка (один двор, один ракурс); stage-8 — финал-мечта,
  // сгенерён цепочкой от stage-7 (та же геометрия двора, сумерки + LED)
  'stage-1': { url: `${CDN}/hf_20260706_023029_3d279d08-9eb4-4cb4-904d-b71a080dd191_min.webp`, local: '/assets/stage-1.webp' },
  'stage-2': { url: `${CDN}/hf_20260706_004446_13c88a5e-a600-40b3-be74-a75493d811bd_min.webp`, local: '/assets/stage-2.webp' },
  'stage-3': { url: `${CDN}/hf_20260706_004617_1521c2f5-87ab-4c65-a3ba-7f5d06047ee0_min.webp`, local: '/assets/stage-3.webp' },
  'stage-4': { url: `${CDN}/hf_20260706_004757_c28072b9-10ad-424a-956d-6bff00d45030_min.webp`, local: '/assets/stage-4.webp' },
  'stage-5': { url: `${CDN}/hf_20260706_004903_375844fe-b559-40f3-aafe-a82ec2a3f7f9_min.webp`, local: '/assets/stage-5.webp' },
  'stage-6': { url: `${CDN}/hf_20260706_005147_40148b08-426c-42b7-9f52-642195ae6b66_min.webp`, local: '/assets/stage-6.webp' },
  'stage-7': { url: `${CDN}/hf_20260706_005619_de2639e8-025e-400b-91ef-b3b4cd15f71a_min.webp`, local: '/assets/stage-7.webp' },
  'stage-8': { url: `${CDN}/hf_20260706_030502_7e33da65-ccbc-4d1d-9001-3282119693b7_min.webp`, local: '/assets/stage-8.webp' },
  // видео-морфы этапов (Kling 3.0 pro, start→end frame): скраб по скроллу
  'clip-1': { url: `${CDN}/hf_20260706_023245_b133fe02-fa47-4223-89a2-38098af32482.mp4`, local: '/assets/clips/clip-1.mp4' },
  'clip-2': { url: `${CDN}/hf_20260706_014009_bb8cda63-957d-4003-9e2b-b2914f81593d.mp4`, local: '/assets/clips/clip-2.mp4' },
  'clip-3': { url: `${CDN}/hf_20260706_014024_14db626b-ddbc-4c2c-bb54-5f44051e2d4b.mp4`, local: '/assets/clips/clip-3.mp4' },
  'clip-4': { url: `${CDN}/hf_20260706_014031_81251c2e-b2e0-4847-810b-aedb67907595.mp4`, local: '/assets/clips/clip-4.mp4' },
  'clip-5': { url: `${CDN}/hf_20260706_014048_ef50cfe0-d3f4-4b45-b18e-be79efd66b7e.mp4`, local: '/assets/clips/clip-5.mp4' },
  'clip-6': { url: `${CDN}/hf_20260706_014054_eeb813f0-02f8-4df8-bdea-9a6ec401546c.mp4`, local: '/assets/clips/clip-6.mp4' },
  'clip-7': { url: `${CDN}/hf_20260706_030624_d52ec698-6561-4c7e-a9de-5e3784a3e9b6.mp4`, local: '/assets/clips/clip-7.mp4' },
  // фото моделей каталога (карточки + модалка деталей)
  'model-luxor': { url: `${CDN}/hf_20260706_031540_cf58036b-e062-49f4-86dc-87b033906682_min.webp`, local: '/assets/model-luxor.webp' },
  'model-minipool': { url: `${CDN}/hf_20260706_031543_12d06282-fdcf-4e0a-a0a3-7ba7e93b84b2_min.webp`, local: '/assets/model-minipool.webp' },
  'model-classic': { url: `${CDN}/hf_20260706_031545_f7002c61-0e39-4097-ada9-2630d9f8a4d6_min.webp`, local: '/assets/model-classic.webp' },
  'model-rio': { url: `${CDN}/hf_20260706_031548_8f78e328-a7e4-4b04-8b9b-8b212abf53fe_min.webp`, local: '/assets/model-rio.webp' },
  'model-quick': { url: `${CDN}/hf_20260706_031550_56bef3cb-b9ee-4932-956e-d3bd78a0e794_min.webp`, local: '/assets/model-quick.webp' },
  'model-spa': { url: `${CDN}/hf_20260706_031552_cf1c0b5f-e8d3-4d46-a1d8-3da2eb77c114_min.webp`, local: '/assets/model-spa.webp' },
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
