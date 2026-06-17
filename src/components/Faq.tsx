"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { faqs } from "@/lib/content";
import SectionHeading from "./SectionHeading";
import { IconPlus } from "./icons";

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  const reduce = useReducedMotion();

  return (
    <section className="bg-bg py-24 lg:py-32">
      <div className="container-x grid gap-12 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] lg:gap-20">
        <SectionHeading
          label="Вопросы"
          title="Коротко о главном"
          lede="Не нашли ответ? Позвоните нам — расскажем без воды и навязывания."
        />

        <div>
          {faqs.map((f, i) => {
            const on = open === i;
            return (
              <div key={f.q} className="border-b border-line first:border-t">
                <button
                  type="button"
                  onClick={() => setOpen(on ? null : i)}
                  aria-expanded={on}
                  className="flex w-full items-center justify-between gap-6 py-6 text-left"
                >
                  <span
                    className={`font-display text-xl transition-colors duration-300 lg:text-2xl ${
                      on ? "text-primary" : "text-ink"
                    }`}
                  >
                    {f.q}
                  </span>
                  <IconPlus
                    className="size-5 shrink-0 text-accent-deep transition-transform duration-300"
                    style={{ transform: on ? "rotate(45deg)" : "none" }}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {on && (
                    <motion.div
                      initial={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                      animate={reduce ? { opacity: 1 } : { height: "auto", opacity: 1 }}
                      exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-prose pb-6 leading-relaxed text-ink-soft">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
