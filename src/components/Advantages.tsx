import { advantages } from "@/lib/content";
import { advantageIcons } from "./icons";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";

export default function Advantages() {
  return (
    <section id="advantages" className="bg-bg py-24 lg:py-32">
      <div className="container-x">
        <SectionHeading
          label="Почему «Династия»"
          title="Доверие, закреплённое договором"
          lede="Мы убрали из стройки то, чего боятся клиенты: размытые сметы, исчезающих прорабов и оплату «вперёд за всё»."
        />

        <div className="mt-14 grid border-t border-l border-line sm:grid-cols-2 lg:grid-cols-3">
          {advantages.map((a, i) => {
            const Icon = advantageIcons[i % advantageIcons.length];
            return (
              <Reveal
                key={a.title}
                delay={(i % 3) * 0.08}
                className="group relative border-b border-r border-line p-8 transition-colors duration-300 hover:bg-surface lg:p-10"
              >
                <Icon className="size-7 text-primary transition-colors duration-300 group-hover:text-accent-deep" />
                <h3 className="mt-6 font-display text-xl text-ink">{a.title}</h3>
                <p className="mt-3 leading-relaxed text-ink-soft">{a.text}</p>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
