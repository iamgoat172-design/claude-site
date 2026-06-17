/**
 * Wordmark + monogram. The mark is an abstracted roofline / arch —
 * a quiet heritage stamp rather than a literal house icon.
 */
export default function Logo({ dark = false }: { dark?: boolean }) {
  const ink = dark ? "var(--color-on-dark)" : "var(--color-ink)";
  return (
    <span className="flex items-center gap-2.5">
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden>
        <path
          d="M4 24 14 5l10 19"
          stroke="var(--color-accent-deep)"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M9 24 14 14l5 10" stroke={ink} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="flex flex-col leading-none">
        <span
          className="font-display text-[1.15rem] font-semibold tracking-[0.08em]"
          style={{ color: ink }}
        >
          ДИНАСТИЯ
        </span>
        <span
          className="text-[0.58rem] font-medium tracking-[0.22em] uppercase"
          style={{ color: dark ? "var(--color-on-dark-soft)" : "var(--color-muted)" }}
        >
          Строительная компания
        </span>
      </span>
    </span>
  );
}
