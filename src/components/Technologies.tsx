"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { technologies } from "@/lib/content";
import SectionHeading from "./SectionHeading";
import { IconArrow } from "./icons";

export default function Technologies() {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const tech = technologies[active];

  return (
    <section id="technologies" className="bg-surface py-24 lg:py-32">
      <div className="container-x">
        <SectionHeading
          label="Технологии"
          title="Четыре материала — один стандарт качества"
          lede="Выбираете технологию под бюджет, климат и образ жизни. За любой из них — одинаково строгий инженерный контроль и фиксированная смета."
        />

        <div className="mt-14 grid gap-10 lg:mt-16 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
          {/* Selector */}
          <div className="flex flex-col">
            {technologies.map((t, i) => {
              const on = i === active;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActive(i)}
                  className="group relative border-b border-line py-6 text-left transition-colors first:border-t"
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <span
                      className={`font-display text-2xl transition-colors duration-300 lg:text-3xl ${
                        on ? "text-primary" : "text-ink group-hover:text-primary-700"
                      }`}
                    >
                      {t.name}
                    </span>
                    <span
                      className={`text-sm font-medium transition-colors ${
                        on ? "text-accent-deep" : "text-muted"
                      }`}
                    >
                      {t.priceFrom}
                    </span>
                  </div>
                  <AnimatePresence initial={false}>
                    {on && (
                      <motion.p
                        initial={reduce ? undefined : { height: 0, opacity: 0 }}
                        animate={reduce ? undefined : { height: "auto", opacity: 1 }}
                        exit={reduce ? undefined : { height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden text-sm leading-relaxed text-ink-soft"
                      >
                        <span className="block pt-3">{t.short} — {t.description}</span>
                      </motion.p>
                    )}
                  </AnimatePresence>
                  {/* active marker */}
                  <span
                    className="absolute -left-4 top-1/2 h-0 w-[2px] -translate-y-1/2 bg-accent transition-[height] duration-300"
                    style={{ height: on ? "calc(100% - 2rem)" : "0" }}
                  />
                </button>
              );
            })}
          </div>

          {/* Preview */}
          <div className="relative">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-surface-2 shadow-xl shadow-primary-900/5">
              <AnimatePresence mode="wait">
                <motion.div
                  key={tech.id}
                  initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={tech.image} alt={tech.alt} className="size-full object-cover" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-900/55 to-transparent" />
                </motion.div>
              </AnimatePresence>

              <div className="absolute inset-x-0 bottom-0 p-6 lg:p-8">
                <AnimatePresence mode="wait">
                  <motion.ul
                    key={tech.id}
                    initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-wrap gap-2"
                  >
                    {tech.features.map((f) => (
                      <li
                        key={f}
                        className="rounded-full bg-on-dark/15 px-3.5 py-1.5 text-xs font-medium text-on-dark backdrop-blur-md"
                      >
                        {f}
                      </li>
                    ))}
                  </motion.ul>
                </AnimatePresence>
              </div>
            </div>

            <a
              href="#contact"
              className="group mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-accent-deep"
            >
              Подобрать технологию под мой участок
              <IconArrow className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
