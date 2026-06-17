import { company, nav, technologies } from "@/lib/content";
import Logo from "./Logo";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-[oklch(0.17_0.022_208)] py-16 text-on-dark-soft">
      <div className="container-x">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <Logo dark />
            <p className="mt-5 max-w-xs leading-relaxed">
              Строим частные дома под ключ в Санкт-Петербурге и Ленинградской области
              с 2012 года. Дома, которые остаются в семье.
            </p>
          </div>

          <nav className="flex flex-col gap-3">
            <p className="mb-1 text-sm font-semibold text-on-dark">Разделы</p>
            {nav.map((n) => (
              <a key={n.href} href={n.href} className="transition-colors hover:text-accent">
                {n.label}
              </a>
            ))}
          </nav>

          <div className="flex flex-col gap-3">
            <p className="mb-1 text-sm font-semibold text-on-dark">Технологии</p>
            {technologies.map((t) => (
              <a key={t.id} href="#technologies" className="transition-colors hover:text-accent">
                {t.name}
              </a>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            <p className="mb-1 text-sm font-semibold text-on-dark">Контакты</p>
            <a href={company.phoneHref} className="text-lg font-semibold text-on-dark transition-colors hover:text-accent">
              {company.phone}
            </a>
            <a href={`mailto:${company.email}`} className="transition-colors hover:text-accent">
              {company.email}
            </a>
            <p className="leading-snug">{company.address}</p>
            <div className="mt-2 flex gap-3">
              <a href={company.whatsapp} className="transition-colors hover:text-accent">WhatsApp</a>
              <a href={company.telegram} className="transition-colors hover:text-accent">Telegram</a>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-on-dark/10 pt-7 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} СК «Династия». Все права защищены.</p>
          <p className="text-on-dark-soft/70">
            Информация на сайте не является публичной офертой.
          </p>
        </div>
      </div>
    </footer>
  );
}
