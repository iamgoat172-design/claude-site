"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { company, img } from "@/lib/content";
import { IconArrow } from "./icons";

const ease = [0.16, 1, 0.3, 1] as const;

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yImg = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "14%"]);
  const scaleImg = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 1.12]);
  const yText = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "-30%"]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
  };
  const item = {
    hidden: { opacity: 0, y: reduce ? 0 : 28 },
    show: { opacity: 1, y: 0, transition: { duration: 1, ease } },
  };

  return (
    <section ref={ref} id="top" className="relative min-h-[100svh] overflow-hidden bg-primary-900">
      {/* Background image with parallax + slow zoom */}
      <motion.div className="absolute inset-0" style={{ y: yImg, scale: scaleImg }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={img.hero}
          alt="Премиальный частный дом из газобетона и кирпича в пригороде Санкт-Петербурга на закате"
          className="size-full object-cover"
          fetchPriority="high"
        />
      </motion.div>

      {/* Legibility overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary-900 via-primary-900/55 to-primary-900/35" />
      <div className="absolute inset-0 bg-gradient-to-r from-primary-900/70 to-transparent" />
      {/* header scrim for logo/nav over lighter parts of the photo */}
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-primary-900/60 to-transparent" />

      <motion.div
        className="relative z-10 flex min-h-[100svh] items-end pb-16 pt-32"
        style={{ y: yText, opacity: fade }}
      >
        <div className="container-x w-full">
          <motion.div variants={container} initial="hidden" animate="show" className="max-w-3xl">
            <motion.p
              variants={item}
              className="eyebrow flex items-center gap-3 text-on-dark-soft"
            >
              <span className="h-px w-8 bg-accent" />
              {company.region}
            </motion.p>

            <motion.h1
              variants={item}
              className="display-xl mt-6 text-on-dark"
            >
              Дома, которые<br />
              остаются <span className="italic text-accent">в семье</span>
            </motion.h1>

            <motion.p
              variants={item}
              className="measure mt-7 text-lg leading-relaxed text-on-dark-soft"
            >
              Проектируем и строим частные дома под ключ — из газобетона, кирпича,
              тёплой керамики и клееного бруса. Фиксированная смета, отдельный договор
              на каждый этап и гарантия 25 лет.
            </motion.p>

            <motion.div variants={item} className="mt-10 flex flex-wrap items-center gap-4">
              <a
                href="#contact"
                className="group inline-flex items-center gap-2.5 rounded-full bg-accent px-7 py-4 text-base font-semibold text-primary-900 shadow-lg transition-all duration-300 hover:bg-on-dark hover:shadow-xl"
              >
                Рассчитать стоимость
                <IconArrow className="size-5 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
              <a
                href="#projects"
                className="inline-flex items-center gap-2.5 rounded-full border border-on-dark/30 px-7 py-4 text-base font-semibold text-on-dark backdrop-blur-sm transition-colors duration-300 hover:bg-on-dark/10"
              >
                Смотреть проекты
              </a>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        style={{ opacity: fade }}
        className="absolute bottom-7 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex"
      >
        <span className="text-[0.65rem] uppercase tracking-[0.2em] text-on-dark-soft">Листайте</span>
        <span className="relative block h-9 w-px overflow-hidden bg-on-dark/30">
          <motion.span
            className="absolute inset-x-0 top-0 h-3 bg-accent"
            animate={reduce ? {} : { y: [-12, 36] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </motion.div>
    </section>
  );
}
