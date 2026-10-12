import Link from "next/link";
import FiscalProfileForm from "@/components/ui/FiscalProfileForm";
export const metadata = { title: "Facturación de membresías | Bluai" };
export default function BillingPage() {
  return <main className="min-h-screen bg-[#070b1c] px-6 py-12 text-white">
    <div className="mx-auto max-w-3xl space-y-8">
      <nav className="flex justify-between"><Link href="/">← Bluai</Link><Link href="/membresias">Membresías</Link></nav>
      <h1 className="text-4xl font-bold">Facturación de membresías</h1>
      <p>Usa la cuenta con la que compras tu membresía.</p>
      <FiscalProfileForm />
    </div>
  </main>;
}
