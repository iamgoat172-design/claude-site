"use client";

import { useState } from "react";
import { company, technologies } from "@/lib/content";
import { IconPhone, IconPin, IconClock, IconArrow } from "./icons";
import Reveal from "./Reveal";

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", tech: "", comment: "" });

  const valid = form.name.trim().length > 1 && form.phone.replace(/\D/g, "").length >= 10;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) return;
    // Демо-обработка: реальную интеграцию (CRM / e-mail / Telegram-бот) подключим позже.
    setSent(true);
  };

  return (
    <section id="contact" className="noise bg-primary-900 py-24 text-on-dark lg:py-32">
      <div className="container-x grid gap-14 lg:grid-cols-2 lg:gap-20">
        {/* Info */}
        <div>
          <span className="inline-flex items-center gap-3 text-sm font-semibold text-on-dark-soft">
            <span className="h-px w-8 bg-accent" />
            Контакты
          </span>
          <h2 className="display-lg mt-5 text-on-dark">
            Рассчитаем ваш дом <span className="italic text-accent">бесплатно</span>
          </h2>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-on-dark-soft">
            Оставьте заявку — инженер свяжется в течение рабочего дня, ответит на вопросы
            и подготовит предварительную смету. Выезд на участок для замеров — бесплатно.
          </p>

          <div className="mt-10 space-y-5">
            <a href={company.phoneHref} className="group flex items-center gap-4">
              <span className="flex size-11 items-center justify-center rounded-full border border-on-dark/20 transition-colors group-hover:border-accent">
                <IconPhone className="size-5 text-accent" />
              </span>
              <span>
                <span className="block text-lg font-semibold">{company.phone}</span>
                <span className="text-sm text-on-dark-soft">{company.workHours}</span>
              </span>
            </a>
            <div className="flex items-center gap-4">
              <span className="flex size-11 items-center justify-center rounded-full border border-on-dark/20">
                <IconPin className="size-5 text-accent" />
              </span>
              <span className="max-w-xs leading-snug text-on-dark-soft">{company.address}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="flex size-11 items-center justify-center rounded-full border border-on-dark/20">
                <IconClock className="size-5 text-accent" />
              </span>
              <span className="text-on-dark-soft">{company.workHours}</span>
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            <a
              href={company.whatsapp}
              className="rounded-full border border-on-dark/25 px-5 py-2.5 text-sm font-semibold transition-colors hover:border-accent hover:text-accent"
            >
              WhatsApp
            </a>
            <a
              href={company.telegram}
              className="rounded-full border border-on-dark/25 px-5 py-2.5 text-sm font-semibold transition-colors hover:border-accent hover:text-accent"
            >
              Telegram
            </a>
          </div>
        </div>

        {/* Form */}
        <Reveal>
          <div className="rounded-3xl bg-on-dark p-7 text-ink sm:p-10">
            {sent ? (
              <div className="flex h-full min-h-[24rem] flex-col items-center justify-center text-center">
                <span className="flex size-16 items-center justify-center rounded-full bg-primary/10">
                  <svg className="size-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                    <path d="m5 12 4 4L19 6" />
                  </svg>
                </span>
                <h3 className="mt-6 font-display text-2xl text-ink">Заявка отправлена</h3>
                <p className="mt-3 max-w-sm text-ink-soft">
                  Спасибо, {form.name.split(" ")[0] || "вы"} нам написали. Инженер свяжется
                  с вами по номеру {form.phone} в ближайшее рабочее время.
                </p>
              </div>
            ) : (
              <form onSubmit={submit} className="flex flex-col gap-5" noValidate>
                <h3 className="font-display text-2xl text-ink">Заявка на расчёт</h3>

                <Field label="Как вас зовут" htmlFor="name">
                  <input
                    id="name"
                    type="text"
                    autoComplete="name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Имя"
                    className="form-input"
                  />
                </Field>

                <Field label="Телефон" htmlFor="phone">
                  <input
                    id="phone"
                    type="tel"
                    autoComplete="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+7 (___) ___-__-__"
                    className="form-input"
                  />
                </Field>

                <Field label="Технология (необязательно)" htmlFor="tech">
                  <select
                    id="tech"
                    value={form.tech}
                    onChange={(e) => setForm({ ...form, tech: e.target.value })}
                    className="form-input"
                  >
                    <option value="">Ещё не выбрал(а)</option>
                    {technologies.map((t) => (
                      <option key={t.id} value={t.name}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Комментарий (необязательно)" htmlFor="comment">
                  <textarea
                    id="comment"
                    rows={3}
                    value={form.comment}
                    onChange={(e) => setForm({ ...form, comment: e.target.value })}
                    placeholder="Участок, площадь, пожелания…"
                    className="form-input resize-none"
                  />
                </Field>

                <button
                  type="submit"
                  disabled={!valid}
                  className="group mt-1 inline-flex items-center justify-center gap-2.5 rounded-full bg-primary px-7 py-4 font-semibold text-on-dark transition-all duration-300 enabled:hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Получить расчёт
                  <IconArrow className="size-5 transition-transform duration-300 group-enabled:group-hover:translate-x-1" />
                </button>
                <p className="text-xs leading-relaxed text-muted">
                  Нажимая кнопку, вы соглашаетесь с обработкой персональных данных.
                </p>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="flex flex-col gap-2">
      <span className="text-sm font-medium text-ink-soft">{label}</span>
      {children}
    </label>
  );
}
