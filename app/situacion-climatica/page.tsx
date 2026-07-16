import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Reveal from "@/components/fx/Reveal";
import TitleReveal from "@/components/fx/TitleReveal";

export const metadata: Metadata = { title: "Situación Climática — Bluai" };

/** Bold callout following the delivered copy deck's emphasis. */
function B({ children }: { children: React.ReactNode }) {
  return <strong className="font-bold text-navy-950">{children}</strong>;
}

/** Section block with a heading and items, revealed on scroll. */
function Block({
  title,
  intro,
  items,
  delay = 0,
}: {
  title: string;
  intro?: React.ReactNode;
  items?: React.ReactNode[];
  delay?: number;
}) {
  return (
    <Reveal delay={delay} className="border-l-2 border-brand/30 pl-5">
      <h2 className="text-xl font-extrabold text-brand sm:text-2xl">{title}</h2>
      {intro && <p className="mt-2 text-navy-950/70">{intro}</p>}
      {items && (
        <ul className="mt-3 space-y-2">
          {items.map((it, i) => (
            <li key={i} className="flex gap-3 text-navy-950/80">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-cyan" aria-hidden />
              <span>{it}</span>
            </li>
          ))}
        </ul>
      )}
    </Reveal>
  );
}

export default function SituacionClimatica() {
  return (
    <main className="min-h-screen bg-white text-navy-950">
      {/* Brand header bar (keeps the white logo visible) */}
      <header
        className="relative"
        style={{ background: "linear-gradient(110deg, #3900ff 0%, #3167ff 55%, #2ecaff 100%)" }}
      >
        <div className="shell flex items-center justify-between py-5">
          <Link href="/" aria-label="Bluai inicio">
            <Image
              src="/assets/logo-bluai.png"
              alt="Bluai"
              width={120}
              height={26}
              className="w-[112px]"
              style={{ height: "auto" }}
            />
          </Link>
          <Link
            href="/"
            className="text-sm font-semibold text-white/90 transition-opacity hover:opacity-80"
          >
            ← Volver al inicio
          </Link>
        </div>
      </header>

      <article className="shell max-w-3xl py-14">
        <TitleReveal
          as="h1"
          text="Situación Climática"
          className="font-display text-3xl font-extrabold text-accent-purple sm:text-4xl"
        />
        <Reveal delay={160}>
          <p className="mt-3 text-navy-950/60">
            El panorama de los huracanes y su impacto, en cifras.
          </p>
        </Reveal>

        <div className="mt-12 space-y-10">
          <Block
            title="Panorama global"
            intro={<B>National Oceanic and Atmospheric Administration + National Hurricane Center:</B>}
            items={[
              "Temporadas de huracanes dentro o por encima de lo esperado",
              "Eventos más intensos y frecuentes",
            ]}
          />
          <Block
            title="Riesgos reales"
            intro="Según el National Weather Service:"
            items={[
              "Inundaciones: principal causa de muerte",
              "Vientos: daño estructural",
              "Marejadas: altamente letales",
            ]}
          />
          <Block
            title="Contexto clave"
            intro={<B>Más eventos + más intensidad + misma falla de comunicación</B>}
          />
          <Block
            title="A escala global"
            items={[
              <>Actividad global: <B>por encima del promedio</B></>,
              <>Huracanes: <B>menos predecibles, más intensos</B></>,
              <>Impacto económico: <B>cientos de miles de millones USD</B></>,
              <>Impacto humano: <B>cientos de millones afectados</B></>,
            ]}
          />
          <Block
            title="México"
            items={[
              "Impacto anual garantizado",
              "Temporadas más activas",
              "Riesgo creciente",
              "Eventos más violentos y rápidos",
            ]}
          />
          <Block
            title="Cifras de damnificados en México"
            items={[
              <><B>Mínimo:</B> ~100,000 personas/año</>,
              <><B>Típico:</B> cientos de miles</>,
              <><B>Años fuertes: 1–5 millones de personas afectadas</B></>,
            ]}
          />
          <Block
            title="Derrama económica en México"
            items={[
              <><B>Promedio anual: $1B – $5B USD</B></>,
              <><B>Años extremos: hasta $16B USD en un solo evento</B></>,
              <><B>Tendencia:</B> menos predecibles + más costosos</>,
            ]}
          />
          <Block
            title="Muertes en México"
            items={[
              <>Promedio anual: <B>200 – 300 muertes (relacionadas con huracanes/lluvias)</B></>,
              <>Eventos fuertes: <B>50 – 150 muertes por un solo huracán extremo</B></>,
              <>Eventos extremos históricos: aproximadamente <B>3000 muertos en la última década</B></>,
            ]}
          />
          <Block
            title="PIB gracias al turismo en México"
            items={[<>Aporta: <B>~8% del PIB nacional</B></>]}
          />
          <Block
            title="Playas"
            items={[
              <>Representan: <B>70% – 80% de los ingresos del turismo internacional</B></>,
              <>Generan: <B>$20B – $24B USD/año</B></>,
            ]}
          />
          <Reveal className="rounded-2xl bg-mist p-6">
            <B>
              Billones de dólares anualmente se llegan a comprometer debido a la baja de turistas
              posterior a la afectación grave de la infraestructura nacional debido al paso de un
              huracán devastador.
            </B>
          </Reveal>
        </div>
      </article>
    </main>
  );
}
