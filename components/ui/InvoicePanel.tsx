"use client";

import { useEffect, useState } from "react";
import { auth, onAuthStateChanged, type User } from "@/lib/billingClient";
import { API_BASE_URL, authorizedFetch } from "@/lib/bluaiCheckout";

type Payment = { id: string; amount_cents: number; currency: string; created: number };
type Invoice = { id: string; status: string; mode: string };

async function request<T>(user: User, path: string, body?: object): Promise<T> {
  const response = await authorizedFetch(user, `${API_BASE_URL}/api/v1/billing/${path}`, {
    method: body ? "POST" : "GET", cache: "no-store",
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error(typeof data?.detail === "string" ? data.detail : "No se pudo completar la solicitud de facturación.");
  return data as T;
}

export default function InvoicePanel() {
  const [user, setUser] = useState<User | null>(null);
  const [demo, setDemo] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [paymentId, setPaymentId] = useState("");
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [reload, setReload] = useState(0);

  useEffect(() => auth ? onAuthStateChanged(auth, setUser) : undefined, []);
  useEffect(() => {
    let active = true;
    setInvoice(null);
    setEnabled(false);
    setPayments([]);
    setPaymentId("");
    setError("");
    if (!user) return;
    request<{ status: string; invoice_issuance_available: boolean; demo_invoicing_available: boolean }>(user, "capabilities").then(async caps => {
      if (!active) return;
      const isDemo = caps.status === "local_test";
      setDemo(isDemo);
      setEnabled(isDemo ? caps.demo_invoicing_available : caps.invoice_issuance_available);
      if (!isDemo && caps.invoice_issuance_available) {
        const paid = await request<Payment[]>(user, "payments");
        if (active) { setPayments(paid); setPaymentId(paid[0]?.id ?? ""); }
      }
    }).catch(err => { if (active) setError(err instanceof Error ? err.message : "Servicio de pruebas no disponible."); });
    return () => { active = false; };
  }, [user, reload]);

  async function issue() {
    if (!user) return;
    setBusy(true); setError("");
    const uid = user.uid;
    try {
      const data = await request<Invoice>(user, demo ? "demo-invoice" : "invoices", demo ? {} : { payment_id: paymentId });
      if (auth?.currentUser?.uid === uid) setInvoice(data);
    } catch (err) { if (auth?.currentUser?.uid === uid) setError(err instanceof Error ? err.message : "No se pudo generar el documento."); }
    finally { setBusy(false); }
  }

  async function download(format: "pdf" | "xml") {
    if (!user || !invoice) return;
    setBusy(true); setError("");
    const uid = user.uid;
    try {
      const response = await authorizedFetch(user, `${API_BASE_URL}/api/v1/billing/invoices/${invoice.id}/${format}`, { cache: "no-store" });
      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(typeof data?.detail === "string" ? data.detail : "El documento todavía no está disponible.");
      }
      const blob = await response.blob();
      if (auth?.currentUser?.uid !== uid) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url; link.download = `bluai-prueba.${format}`;
      document.body.appendChild(link); link.click(); link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (err) { if (auth?.currentUser?.uid === uid) setError(err instanceof Error ? err.message : "No se pudo descargar."); }
    finally { setBusy(false); }
  }

  if (!user) return null;
  return <section className="space-y-4 rounded-2xl border border-accent-cyan/30 p-6">
    <h2 className="text-xl font-semibold text-white">Factura de prueba gratuita</h2>
    <p className="text-sm">Los documentos de Facturapi Test no tienen validez fiscal y no se envían al SAT.</p>
    {demo && <p className="text-sm">Demostración con un importe ficticio de 4.99 USD. Este documento no acredita el pago de una membresía.</p>}
    {!enabled && <p className="text-sm">El servicio gratuito de pruebas está pendiente de configurar en el servidor.</p>}
    {enabled && !demo && (payments.length ? <label className="block text-sm">Pago confirmado en Stripe sandbox
      <select value={paymentId} disabled={busy} onChange={event => { setPaymentId(event.target.value); setInvoice(null); }} className="mt-2 w-full rounded-xl bg-navy-950 p-3 ring-1 ring-white/20">
        {payments.map(payment => <option key={payment.id} value={payment.id}>
          {new Date(payment.created * 1000).toLocaleDateString("es-MX")} · {new Intl.NumberFormat("es-MX", { style: "currency", currency: payment.currency }).format(payment.amount_cents / 100)}
        </option>)}
      </select></label> : <p className="text-sm">No hay pagos confirmados de Stripe sandbox en esta cuenta.</p>)}
    <div className="flex flex-wrap gap-3">
      <button type="button" disabled={busy || !enabled || (!demo && !paymentId)} onClick={issue} className="rounded-xl bg-accent-purple px-5 py-3 font-semibold text-white disabled:opacity-50">
        {busy ? "Procesando…" : invoice ? "Consultar factura de prueba" : "Generar factura de prueba"}
      </button>
      <button type="button" disabled={busy} onClick={() => setReload(value => value + 1)} className="rounded-xl border border-white/30 px-4 py-3 disabled:opacity-50">Actualizar disponibilidad</button>
    </div>
    {invoice && <div className="space-y-3">
      <p role="status">{invoice.status === "valid" ? "Documento de prueba generado. Sin validez fiscal." : `Estado del documento: ${invoice.status}. Consulta de nuevo en unos momentos.`}</p>
      <div className="flex gap-3">{(["pdf", "xml"] as const).map(format => <button key={format} type="button" disabled={busy || invoice.status !== "valid"} onClick={() => download(format)} className="rounded-xl border border-white/30 px-4 py-3 disabled:opacity-50">Descargar {format.toUpperCase()}</button>)}</div>
    </div>}
    {error && <p role="alert" className="text-sm text-red-300">{error}</p>}
  </section>;
}
