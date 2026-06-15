// Каталог проектов старшей линейки (дома от 250 м²).
// Цены — ориентировочные/«по запросу»; заполняются после согласования.
//
// ⚠️ ИЗОБРАЖЕНИЯ (временно): сейчас ссылаются на сгенерированные кадры
// (Higgsfield CDN) для превью на согласование. Перед продакшеном — локализовать:
// положить оптимизированные AVIF/WebP в /public/images/projects/ и заменить URL
// на локальные пути (см. IMG_BASE ниже). Подробности — в README.
const IMG_BASE =
  "https://d8j0ntlcm91z4.cloudfront.net/user_32Q9KWTtKxuO9vGsur6JRmOi1Zg";

export type Material = "timber" | "ceramic";

export interface Project {
  code: string; // код ВЗ
  name: string;
  material: Material;
  area: number; // м²
  floors: number;
  price: string; // «от X ₽» или «по запросу»
  image: string;
  alt: string;
}

// Hero — кинематографичный кадр 21:9 (вилла из клееного бруса, сумерки).
export const HERO_IMAGE = `${IMG_BASE}/hf_20260615_120714_ccbc9c8f-a2c1-4186-87a9-bd84e8b6c410_min.webp`;

export const materials: Record<
  Material,
  { id: Material; label: string; note: string }
> = {
  timber: {
    id: "timber",
    label: "Клееный брус",
    note: "Тёплый, «дышащий» дом из собственного северного леса",
  },
  ceramic: {
    id: "ceramic",
    label: "Тёплая керамика",
    note: "Поротерм: монолитный комфорт, тишина и инерция тепла",
  },
};

export const projects: Project[] = [
  // — Клееный брус —
  {
    code: "ВЗ-271",
    name: "Сосновый Бор",
    material: "timber",
    area: 268,
    floors: 2,
    price: "от 18,9 млн ₽",
    image: `${IMG_BASE}/hf_20260615_120717_77c26f11-7d7c-4812-9742-197f09cda6b4_min.webp`,
    alt: "Двухэтажный дом из клееного бруса с панорамным остеклением в сосновом лесу",
  },
  {
    code: "ВЗ-312",
    name: "Терраса",
    material: "timber",
    area: 305,
    floors: 2,
    price: "от 23,4 млн ₽",
    image: `${IMG_BASE}/hf_20260615_120718_53831024-c5af-4cbd-bf8b-5cf6e23ff853_min.webp`,
    alt: "Дом из клееного бруса с большой консольной террасой в осеннем лесу",
  },
  {
    code: "ВЗ-258",
    name: "Зимний Шале",
    material: "timber",
    area: 254,
    floors: 2,
    price: "по запросу",
    image: `${IMG_BASE}/hf_20260615_120730_a3de91c4-540d-4433-b467-a83769597f80_min.webp`,
    alt: "Шале из клееного бруса с тёплым светом в окнах зимним утром",
  },
  // — Тёплая керамика —
  {
    code: "ВЗ-289",
    name: "Минимал",
    material: "ceramic",
    area: 289,
    floors: 2,
    price: "от 21,2 млн ₽",
    image: `${IMG_BASE}/hf_20260615_120732_9c7bae64-68f0-4eb5-89ca-472a0a3ab826_min.webp`,
    alt: "Современный дом из тёплой керамики со светлым фасадом и панорамными окнами",
  },
  {
    code: "ВЗ-334",
    name: "Кирпичный Двор",
    material: "ceramic",
    area: 334,
    floors: 2,
    price: "от 26,8 млн ₽",
    image: `${IMG_BASE}/hf_20260615_120735_5fe3d57a-0c74-4800-b7f9-b811d4ce029e_min.webp`,
    alt: "Дом из тёплой керамики с открытой кирпичной кладкой и деревянной террасой",
  },
  {
    code: "ВЗ-262",
    name: "Песчаный Вечер",
    material: "ceramic",
    area: 262,
    floors: 2,
    price: "по запросу",
    image: `${IMG_BASE}/hf_20260615_120737_6fd60113-2961-4d47-96f0-5ea3bf8047a0_min.webp`,
    alt: "Дом из тёплой керамики с тёплым светом в окнах в сумерках",
  },
];
