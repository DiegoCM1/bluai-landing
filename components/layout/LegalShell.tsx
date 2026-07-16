import Link from "next/link";
import Image from "next/image";
import { ReactNode } from "react";

/**
 * Simple shell for the standalone legal / press pages: a slim top bar with the
 * logo and a back link, then a readable content column on a dark background.
 */
export default function LegalShell({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <main className="page-transition min-h-screen bg-navy-950 text-white">
      <header className="border-b border-white/10">
        <div className="shell flex items-center justify-between py-5">
          <Link href="/" aria-label="Bluai inicio">
            <Image
              src="/assets/logo-bluai.png"
              alt="Bluai"
              width={120}
              height={26}
              className="w-[110px]"
              style={{ height: "auto" }}
            />
          </Link>
          <Link
            href="/"
            className="text-sm font-semibold text-white/80 transition-colors hover:text-accent-cyan"
          >
            ← Volver al inicio
          </Link>
        </div>
      </header>

      <article className="shell max-w-3xl py-14">
        <h1 className="font-display text-3xl font-extrabold text-brand sm:text-4xl">{title}</h1>
        <div className="mt-8 space-y-5 leading-relaxed text-white/80 [&_a]:text-accent-cyan [&_h2]:mt-10 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-white [&_li]:ml-5 [&_li]:list-disc [&_strong]:text-white [&_ul]:space-y-1.5">
          {children}
        </div>
      </article>
    </main>
  );
}
