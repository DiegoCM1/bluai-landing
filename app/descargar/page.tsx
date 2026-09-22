import type { Metadata } from "next";
import Link from "next/link";
import { ANDROID_TEST_BUILD } from "@/lib/downloads";

export const metadata: Metadata = {
  title: "Descargar Bluai para Android — Versión de pruebas",
  description: "Descarga el APK de pruebas de Bluai para Android ARM64.",
};

export default function DownloadPage() {
  return (
    <main className="min-h-screen bg-navy-950 px-5 py-10 text-white sm:py-16">
      <div className="mx-auto max-w-2xl">
        <Link href="/" className="text-sm text-accent-cyan hover:underline">
          ← Volver a Bluai
        </Link>
        <section className="mt-8 rounded-3xl border border-white/15 bg-white/5 p-6 sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-widest text-accent-orange">
            Versión de pruebas
          </p>
          <h1 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
            Prueba Bluai en Android
          </h1>
          <p className="mt-5 leading-relaxed text-white/80">
            Esta versión se conecta al entorno de pruebas de Bluai. Está destinada
            a probar la app y sus funciones; no es la versión de producción.
          </p>
          <dl className="mt-7 grid grid-cols-2 gap-5 text-sm sm:grid-cols-3">
            <div><dt className="text-white/60">Versión</dt><dd className="mt-1 font-semibold">{ANDROID_TEST_BUILD.version}</dd></div>
            <div><dt className="text-white/60">Tamaño</dt><dd className="mt-1 font-semibold">{ANDROID_TEST_BUILD.size}</dd></div>
            <div><dt className="text-white/60">Compatible con</dt><dd className="mt-1 font-semibold">Android {ANDROID_TEST_BUILD.architecture}</dd></div>
          </dl>
          <a
            href={ANDROID_TEST_BUILD.url}
            className="mt-8 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-accent-cyan px-5 py-3 text-center font-bold text-navy-950 transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-cyan"
          >
            Descargar APK de pruebas
          </a>
          <p className="mt-3 text-center text-xs text-white/60">
            Descarga directa desde GitHub. No necesitas Expo Go para abrirla.
          </p>
          <h2 className="mt-10 text-xl font-bold">Cómo instalarla</h2>
          <ol className="mt-4 list-decimal space-y-3 pl-5 text-white/80">
            <li>Descarga el APK desde tu teléfono Android.</li>
            <li>Abre el archivo y, si Android lo solicita, permite la instalación desde tu navegador.</li>
            <li>Instala Bluai y abre la app para comenzar las pruebas.</li>
          </ol>
          <details className="mt-8 border-t border-white/10 pt-5 text-sm text-white/65">
            <summary className="cursor-pointer">Verificar el archivo (SHA-256)</summary>
            <code className="mt-3 block break-all text-xs">{ANDROID_TEST_BUILD.sha256}</code>
          </details>
        </section>
      </div>
    </main>
  );
}
