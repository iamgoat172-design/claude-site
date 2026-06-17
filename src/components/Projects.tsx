"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { projects } from "@/lib/content";
import SectionHeading from "./SectionHeading";

const filters = ["Все", "Газобетон", "Кирпич", "Тёплая керамика", "Клееный брус", "Фахверк"];

export default function Projects() {
  const [filter, setFilter] = useState("Все");
  const reduce = useReducedMotion();

  const shown = useMemo(
    () => (filter === "Все" ? projects : projects.filter((p) => p.tech.includes(filter))),
    [filter],
  );

  return (
    <section id="projects" className="bg-bg py-24 lg:py-32">
      <div className="container-x">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            label="Проекты"
            title="Дома, которые мы уже построили"
            lede="Каждый проект — индивидуальная архитектура под участок и семью. Стоимость указана под ключ, с фиксацией в договоре."
          />
          <div className="flex flex-wrap gap-2">
            {filters.map((f) => {
              const on = f === filter;
              return (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300 ${
                    on
                      ? "border-primary bg-primary text-on-dark"
                      : "border-line text-ink-soft hover:border-primary/40 hover:text-primary"
                  }`}
                >
                  {f}
                </button>
              );
            })}
          </div>
        </div>

        <motion.div layout className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {shown.map((p) => (
              <motion.article
                layout
                key={p.id}
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="group relative overflow-hidden rounded-2xl bg-surface"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.image}
                    alt={p.alt}
                    loading="lazy"
                    className="size-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-900/85 via-primary-900/15 to-transparent" />

                  <span className="absolute left-4 top-4 rounded-full bg-on-dark/15 px-3 py-1 text-xs font-medium text-on-dark backdrop-blur-md">
                    {p.tech}
                  </span>

                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <div className="flex items-end justify-between gap-3">
                      <h3 className="font-display text-2xl text-on-dark">{p.title}</h3>
                      <span className="text-sm font-semibold text-accent">{p.price}</span>
                    </div>
                    <dl className="mt-3 flex gap-4 text-xs text-on-dark-soft">
                      <div>
                        <dt className="sr-only">Площадь</dt>
                        <dd>{p.area}</dd>
                      </div>
                      <div className="border-l border-on-dark/20 pl-4">
                        <dt className="sr-only">Этажность</dt>
                        <dd>{p.floors}</dd>
                      </div>
                      <div className="border-l border-on-dark/20 pl-4">
                        <dt className="sr-only">Срок</dt>
                        <dd>срок {p.term}</dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
