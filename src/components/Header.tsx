"use client";

import { useEffect, useState } from "react";
import { company, nav } from "@/lib/content";
import { IconPhone } from "./icons";
import Logo from "./Logo";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 transition-[background,box-shadow,backdrop-filter] duration-500"
      style={{
        background: scrolled ? "color-mix(in oklch, var(--color-bg) 86%, transparent)" : "transparent",
        backdropFilter: scrolled ? "blur(14px) saturate(1.4)" : "none",
        boxShadow: scrolled ? "0 1px 0 var(--color-line)" : "none",
      }}
    >
      <div className="container-x flex h-[72px] items-center justify-between gap-6">
        <a href="#top" aria-label="СК Династия — на главную" className="shrink-0">
          <Logo dark={!scrolled} />
        </a>

        <nav className="hidden items-center gap-8 lg:flex">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-ink-soft transition-colors hover:text-primary"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={company.phoneHref}
            className="hidden items-center gap-2 text-sm font-semibold text-ink transition-colors hover:text-primary md:flex"
          >
            <IconPhone className="size-4 text-accent-deep" />
            {company.phone}
          </a>
          <a
            href="#contact"
            className="hidden rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-on-dark shadow-sm transition-all duration-300 hover:bg-primary-700 hover:shadow-md sm:inline-flex"
          >
            Рассчитать дом
          </a>

          <button
            type="button"
            aria-label="Меню"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="relative flex size-10 items-center justify-center rounded-full border border-line bg-bg/60 lg:hidden"
          >
            <span className="sr-only">Открыть меню</span>
            <div className="flex flex-col gap-1.5">
              <span
                className="h-px w-5 bg-ink transition-transform duration-300"
                style={{ transform: open ? "translateY(4px) rotate(45deg)" : "none" }}
              />
              <span
                className="h-px w-5 bg-ink transition-opacity duration-300"
                style={{ opacity: open ? 0 : 1 }}
              />
              <span
                className="h-px w-5 bg-ink transition-transform duration-300"
                style={{ transform: open ? "translateY(-4px) rotate(-45deg)" : "none" }}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile sheet */}
      <div
        className="fixed inset-0 top-[72px] z-40 bg-bg transition-[opacity,transform] duration-300 lg:hidden"
        style={{
          opacity: open ? 1 : 0,
          transform: open ? "translateY(0)" : "translateY(-8px)",
          pointerEvents: open ? "auto" : "none",
        }}
      >
        <div className="container-x flex flex-col gap-1 py-8">
          {nav.map((item, i) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="border-b border-line py-4 font-display text-2xl text-ink"
              style={{ transitionDelay: `${i * 30}ms` }}
            >
              {item.label}
            </a>
          ))}
          <a
            href={company.phoneHref}
            className="mt-6 flex items-center gap-3 text-lg font-semibold text-ink"
          >
            <IconPhone className="size-5 text-accent-deep" />
            {company.phone}
          </a>
          <a
            href="#contact"
            onClick={() => setOpen(false)}
            className="mt-4 inline-flex justify-center rounded-full bg-primary px-6 py-4 font-semibold text-on-dark"
          >
            Рассчитать дом
          </a>
        </div>
      </div>
    </header>
  );
}
