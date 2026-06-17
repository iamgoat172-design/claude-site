import type { ReactNode } from "react";
import Reveal from "./Reveal";

type Props = {
  label?: string;
  title: ReactNode;
  lede?: ReactNode;
  align?: "left" | "center";
  tone?: "light" | "dark";
};

export default function SectionHeading({ label, title, lede, align = "left", tone = "light" }: Props) {
  const dark = tone === "dark";
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {label && (
        <Reveal>
          <span
            className={`inline-flex items-center gap-3 text-sm font-semibold ${
              dark ? "text-on-dark-soft" : "text-accent-deep"
            }`}
          >
            <span className="h-px w-8 bg-accent" />
            {label}
          </span>
        </Reveal>
      )}
      <Reveal delay={0.05}>
        <h2 className={`display-lg mt-5 ${dark ? "text-on-dark" : "text-ink"}`}>{title}</h2>
      </Reveal>
      {lede && (
        <Reveal delay={0.1}>
          <p className={`mt-5 text-lg leading-relaxed ${dark ? "text-on-dark-soft" : "text-ink-soft"}`}>
            {lede}
          </p>
        </Reveal>
      )}
    </div>
  );
}
