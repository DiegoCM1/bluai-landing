import Link from "next/link";
import MembershipCheckout from "./MembershipCheckout";

export const metadata = { title: "Membresías | Bluai", description: "Consulta y administra tu membresía Bluai." };

export default async function MembershipPage({ searchParams }: { searchParams: Promise<{ plan?: string }> }) {
  const { plan } = await searchParams;
  return <main className="min-h-screen bg-[#070b1c] px-6 py-12 text-white">
    <div className="mx-auto max-w-2xl space-y-8">
      <nav className="flex justify-between"><Link href="/">← Bluai</Link><Link href="/descargar">Descargar Android</Link></nav>
      <h1 className="text-4xl font-bold">Tu membresía Bluai</h1>
      <p>Usa la misma cuenta con la que entras a la app para vincular tu membresía.</p>
      {process.env.BLUAI_PAYMENT_MODE === "test" ? <p className="rounded-xl border border-amber-400 p-4 text-amber-200">Entorno de pruebas: usa únicamente tarjetas de prueba de Stripe. Las compras de aquí se reflejan en la app de staging.</p> : <p className="text-sm text-white/70">Las membresías de producción no se activan en el APK de pruebas.</p>}
      <MembershipCheckout initialPlan={plan === "guard" ? "guard" : "safe"} />
      <a href="blueye://subscription" className="inline-block rounded-xl border border-white/30 px-5 py-3">Volver a la app Bluai</a>
      <p className="text-sm text-white/70"><Link href="/terminos" className="underline">Términos de servicio</Link> · <Link href="/aviso-de-privacidad" className="underline">Aviso de privacidad</Link></p>
    </div>
  </main>;
}
