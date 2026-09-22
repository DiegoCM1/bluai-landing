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
      <p className="text-sm text-white/70">Las membresías corresponden al servicio de producción. El APK de pruebas disponible en Descargas usa un entorno independiente y no recibe estas compras.</p>
      <MembershipCheckout initialPlan={plan === "guard" ? "guard" : "safe"} />
      <p className="text-sm text-white/70"><Link href="/terminos" className="underline">Términos de servicio</Link> · <Link href="/aviso-de-privacidad" className="underline">Aviso de privacidad</Link></p>
    </div>
  </main>;
}
