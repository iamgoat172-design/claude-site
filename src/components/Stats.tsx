import { stats } from "@/lib/content";
import CountUp from "./CountUp";
import Reveal from "./Reveal";

export default function Stats() {
  return (
    <section className="border-y border-line bg-bg">
      <div className="container-x grid grid-cols-2 gap-x-6 gap-y-10 py-14 lg:grid-cols-4 lg:py-16">
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.08} className="flex flex-col">
            <div className="flex items-baseline font-display text-5xl font-semibold text-primary lg:text-6xl">
              <CountUp value={s.value} />
              <span className="text-accent-deep">{s.suffix}</span>
            </div>
            <p className="mt-3 max-w-[22ch] text-sm leading-relaxed text-ink-soft">{s.label}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
