import { reviews } from "@/lib/content";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";

export default function Reviews() {
  return (
    <section className="bg-surface py-24 lg:py-32">
      <div className="container-x">
        <SectionHeading
          label="Отзывы"
          title="Семьи, которые нам доверились"
          lede="Лучшая рекомендация — это ключи, переданные в срок, и тёплый дом зимой."
        />

        <div className="mt-14 grid gap-px overflow-hidden rounded-2xl bg-line md:grid-cols-3">
          {reviews.map((r, i) => (
            <Reveal key={r.name} delay={i * 0.1} className="flex flex-col bg-bg p-8 lg:p-10">
              <span className="font-display text-5xl leading-none text-accent" aria-hidden>
                “
              </span>
              <p className="mt-4 grow leading-relaxed text-ink-soft">{r.text}</p>
              <div className="mt-8 border-t border-line pt-5">
                <p className="font-display text-lg text-ink">{r.name}</p>
                <p className="mt-1 text-sm text-muted">{r.project}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
