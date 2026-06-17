"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { stages, img } from "@/lib/content";
import SectionHeading from "./SectionHeading";

export default function Process() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 60%", "end 70%"],
  });
  const spine = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="process" className="noise bg-primary-900 py-24 lg:py-32">
      <div className="container-x">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-20">
          {/* Sticky intro */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeading
              tone="dark"
              label="Как мы строим"
              title="9 этапов. На каждый — отдельный договор"
              lede="Прозрачный процесс без серых зон: вы платите за следующий шаг только после того, как примете предыдущий."
            />
            <div className="mt-10 overflow-hidden rounded-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.detail}
                alt="Точная кладка газобетонных блоков на строительной площадке"
                loading="lazy"
                className="aspect-[3/2] w-full object-cover"
              />
            </div>
          </div>

          {/* Timeline */}
          <div ref={ref} className="relative pl-10 sm:pl-14">
            {/* spine track */}
            <span className="absolute left-[7px] top-2 h-full w-px bg-on-dark/15 sm:left-[11px]" />
            {/* spine fill */}
            <motion.span
              className="absolute left-[7px] top-2 w-px origin-top bg-accent sm:left-[11px]"
              style={{ height: reduce ? "100%" : spine }}
            />

            <ol className="space-y-12">
              {stages.map((s) => (
                <motion.li
                  key={s.n}
                  initial={reduce ? { opacity: 0 } : { opacity: 0, x: 18 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="relative"
                >
                  <span className="absolute -left-10 top-1 flex size-4 items-center justify-center sm:-left-14">
                    <span className="size-4 rounded-full border-2 border-accent bg-primary-900" />
                  </span>
                  <div className="flex items-baseline gap-4">
                    <span className="font-display text-sm font-semibold text-accent">{s.n}</span>
                    <h3 className="font-display text-xl text-on-dark lg:text-2xl">{s.title}</h3>
                  </div>
                  <p className="mt-2 max-w-prose leading-relaxed text-on-dark-soft">{s.text}</p>
                </motion.li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
