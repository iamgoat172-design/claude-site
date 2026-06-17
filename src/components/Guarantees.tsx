import { guarantees } from "@/lib/content";
import Reveal from "./Reveal";
import { IconShield } from "./icons";

export default function Guarantees() {
  return (
    <section className="bg-bg pb-24 lg:pb-32">
      <div className="container-x">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-primary px-7 py-14 text-on-dark sm:px-12 lg:px-16 lg:py-20">
            {/* quiet geometric texture */}
            <div className="pointer-events-none absolute inset-0 grid-lines opacity-[0.12]" />
            <div className="pointer-events-none absolute -right-16 -top-16 size-72 rounded-full bg-accent/20 blur-3xl" />

            <div className="relative grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
              <div>
                <IconShield className="size-9 text-accent" />
                <p className="mt-6 flex items-start font-display text-7xl font-semibold leading-none lg:text-8xl">
                  25<span className="ml-2 mt-2 text-2xl font-normal text-on-dark-soft lg:text-3xl">лет</span>
                </p>
                <h2 className="mt-5 font-display text-2xl lg:text-3xl">гарантии на конструктив дома</h2>
                <p className="mt-4 max-w-sm leading-relaxed text-on-dark-soft">
                  Не на словах, а юридически — в договоре. Если что-то пойдёт не так
                  с несущими конструкциями, это наша зона ответственности.
                </p>
              </div>

              <ul className="grid gap-x-8 gap-y-5 self-center sm:grid-cols-2">
                {guarantees.map((g, i) => (
                  <Reveal as="li" key={g} delay={i * 0.06} className="flex items-start gap-3">
                    <svg
                      className="mt-0.5 size-5 shrink-0 text-accent"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.8}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m5 12 4 4L19 6" />
                    </svg>
                    <span className="leading-relaxed text-on-dark">{g}</span>
                  </Reveal>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
