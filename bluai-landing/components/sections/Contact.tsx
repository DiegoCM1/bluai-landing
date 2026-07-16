"use client";

import { FormEvent, useState } from "react";
import dynamic from "next/dynamic";
import Reveal from "@/components/fx/Reveal";
import TitleReveal from "@/components/fx/TitleReveal";

// WebGL background is client-only and lazily loaded.
const LiquidGradient = dynamic(() => import("@/components/fx/LiquidGradient"), {
  ssr: false,
});

interface Fields {
  name: string;
  reason: string;
  email: string;
  message: string;
}

const EMPTY: Fields = { name: "", reason: "", email: "", message: "" };

// Contact reasons for the dropdown (from the client's "SITE textos" document).
const REASONS = [
  "Información General (Plan gratuito)",
  "Membresía Familiar Blu Safe",
  "Soluciones Corporativas/Gobierno (Blu Guard)",
  "Prensa y Medios (Acceso a Kit de Prensa)",
  "Alianzas Estratégicas y Donativos",
];

/** Shared glass styling for the form controls. */
const fieldClass =
  "w-full bg-white/10 backdrop-blur-md border border-white/30 text-white placeholder-white/60 " +
  "outline-none focus:border-white/70 focus:bg-white/15 transition-colors";

export default function Contact() {
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Partial<Fields>>({});
  const [accepted, setAccepted] = useState(false);
  const [acceptError, setAcceptError] = useState(false);
  const [sent, setSent] = useState(false);

  const update = (key: keyof Fields) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    setFields((f) => ({ ...f, [key]: e.target.value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
    setSent(false);
  };

  // Front-end validation only (no backend wired up yet).
  const validate = () => {
    const next: Partial<Fields> = {};
    if (!fields.name.trim()) next.name = "Ingresa tu nombre.";
    if (!fields.reason.trim()) next.reason = "Indica el motivo.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) next.email = "Correo no válido.";
    if (!fields.message.trim()) next.message = "Escribe tu mensaje.";
    setErrors(next);
    setAcceptError(!accepted);
    return Object.keys(next).length === 0 && accepted;
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    // TODO: connect to the contact endpoint / email service when available.
    setSent(true);
    setFields(EMPTY);
    setAccepted(false);
  };

  return (
    <section id="contacto" className="relative overflow-hidden">
      {/* Animated liquid gradient backdrop */}
      <LiquidGradient variant="primary" className="absolute inset-0 h-full w-full" />
      <div className="absolute inset-0 bg-navy-950/15" aria-hidden />

      <div className="shell relative py-20">
        <TitleReveal
          as="h2"
          text="Contáctanos"
          className="font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl"
        />
        <Reveal delay={160}>
          <p className="mt-1 text-xl font-bold text-white sm:text-2xl">Saber qué hacer, lo cambia todo</p>
        </Reveal>

        <Reveal delay={140} className="mt-10">
        <form onSubmit={onSubmit} noValidate className="grid grid-cols-1 gap-x-10 gap-y-6 md:grid-cols-2">
          {/* Left column: short fields */}
          <div className="space-y-5">
            <div>
              <label htmlFor="name" className="mb-1 block text-base text-white">
                Nombre completo:
              </label>
              <input
                id="name"
                value={fields.name}
                onChange={update("name")}
                className={`${fieldClass} rounded-full px-5 py-3`}
              />
              {errors.name && <p className="mt-1 text-xs text-white/90">{errors.name}</p>}
            </div>
            <div>
              <label htmlFor="reason" className="mb-1 block text-base text-white">
                Motivo de contacto:
              </label>
              <select
                id="reason"
                value={fields.reason}
                onChange={update("reason")}
                className={`${fieldClass} appearance-none rounded-full bg-[length:1.1rem] bg-[right_1.25rem_center] bg-no-repeat px-5 py-3 ${
                  fields.reason ? "text-white" : "text-white/60"
                }`}
                style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")",
                }}
              >
                <option value="" disabled className="text-navy-950">
                  Selecciona una opción
                </option>
                {REASONS.map((r) => (
                  <option key={r} value={r} className="text-navy-950">
                    {r}
                  </option>
                ))}
              </select>
              {errors.reason && <p className="mt-1 text-xs text-white/90">{errors.reason}</p>}
            </div>
            <div>
              <label htmlFor="email" className="mb-1 block text-base text-white">
                Correo electrónico:
              </label>
              <input
                id="email"
                type="email"
                value={fields.email}
                onChange={update("email")}
                className={`${fieldClass} rounded-full px-5 py-3`}
              />
              {errors.email && <p className="mt-1 text-xs text-white/90">{errors.email}</p>}
            </div>
          </div>

          {/* Right column: message + submit */}
          <div className="flex flex-col">
            <label htmlFor="message" className="mb-1 block text-base text-white">
              Mensaje
            </label>
            <textarea
              id="message"
              value={fields.message}
              onChange={update("message")}
              rows={6}
              className={`${fieldClass} flex-1 resize-none rounded-2xl px-5 py-4`}
            />
            {errors.message && <p className="mt-1 text-xs text-white/90">{errors.message}</p>}

            {/* Required privacy consent */}
            <div className="mt-4">
              <label htmlFor="privacy" className="flex items-start gap-2.5 text-sm text-white">
                <input
                  id="privacy"
                  type="checkbox"
                  checked={accepted}
                  onChange={(e) => {
                    setAccepted(e.target.checked);
                    setAcceptError(false);
                    setSent(false);
                  }}
                  className="mt-0.5 h-4 w-4 shrink-0 accent-accent-cyan"
                />
                <span>
                  He leído y acepto el{" "}
                  <a href="/aviso-de-privacidad" className="font-semibold underline">
                    Aviso de Privacidad
                  </a>
                </span>
              </label>
              {acceptError && (
                <p className="mt-1 text-xs text-white/90">Debes aceptar el Aviso de Privacidad.</p>
              )}
            </div>

            <div className="mt-5 flex items-center justify-end gap-4">
              {sent && (
                <span className="text-sm font-semibold text-white" role="status">
                  ¡Mensaje enviado! Te contactaremos pronto.
                </span>
              )}
              <button
                type="submit"
                className="rounded-full bg-gradient-to-r from-brand-royal to-accent-purple px-7 py-3 text-sm font-bold uppercase tracking-wide text-white shadow-lg transition-transform hover:-translate-y-0.5"
              >
                Enviar mensaje
              </button>
            </div>
          </div>
        </form>
        </Reveal>
      </div>
    </section>
  );
}
