"use client";

import { useEffect, useState } from "react";
import { GoogleAuthProvider, OAuthProvider, onAuthStateChanged, signInWithPopup, signOut, type User } from "firebase/auth";
import { membershipAuth } from "@/lib/firebase-client";

type Price = { plan_slug: "safe" | "guard"; billing_period: "monthly" | "annual"; price_id: string; amount: number; currency: string };
type Subscription = { plan_slug: string; status: string; cancel_at_period_end: boolean; current_period_end: string | null; payment_provider: string | null };
const button = "rounded-xl border border-white/30 px-5 py-3 disabled:opacity-40 disabled:cursor-not-allowed";

async function api(action: string, user?: User | null, body?: object) {
  const response = await fetch(`/api/memberships/${action}`, {
    method: ["account", "checkout", "cancel"].includes(action) ? "POST" : "GET", cache: "no-store",
    headers: { "Content-Type": "application/json", ...(user ? { Authorization: `Bearer ${await user.getIdToken()}` } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "No se pudo completar la solicitud.");
  return data;
}

export default function MembershipCheckout({ initialPlan }: { initialPlan: "safe" | "guard" }) {
  const [user, setUser] = useState<User | null>(null);
  const [prices, setPrices] = useState<Price[]>([]);
  const [plan, setPlan] = useState<string>(initialPlan);
  const [period, setPeriod] = useState("monthly");
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [message, setMessage] = useState("Cargando membresías…");
  const [busy, setBusy] = useState(false);
  const [ready, setReady] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const auth = membershipAuth();
    let active = true;
    api("plans").then(data => {
      if (!active) return;
      setPrices(data);
      setMessage(query.get("checkout") === "success" ? "Recibimos tu regreso del pago. Consulta el estado; la activación depende de la confirmación de Stripe."
        : query.get("checkout") === "cancelled" ? "Saliste del pago. Puedes volver a abrirlo para continuar." : "");
    }).catch(() => { if (active) setMessage("Los pagos todavía no están disponibles. Vuelve más tarde."); });
    const unsubscribe = auth ? onAuthStateChanged(auth, async current => {
      setReady(true);
      setUser(current);
      setSubscription(null);
      if (!current) return;
      try {
        await api("account", current);
        const value = await api("subscription", current);
        if (active && auth.currentUser?.uid === current.uid) setSubscription(value);
      } catch { if (active) setMessage("No pudimos consultar tu cuenta. Actualiza el estado antes de pagar."); }
    }) : () => {};
    return () => { active = false; unsubscribe(); };
  }, []);

  async function run(action: () => Promise<void>) {
    setBusy(true);
    try { await action(); } catch (error) { setMessage(error instanceof Error ? error.message : "Ocurrió un error. Intenta nuevamente."); }
    finally { setBusy(false); }
  }

  async function login(provider: "google" | "apple") {
    const auth = membershipAuth();
    if (!auth) return;
    try { await signInWithPopup(auth, provider === "google" ? new GoogleAuthProvider() : new OAuthProvider("apple.com")); }
    catch { throw new Error("No se pudo iniciar sesión. Revisa que tu navegador permita la ventana de acceso e intenta nuevamente."); }
  }

  const selected = prices.find(price => price.plan_slug === plan && price.billing_period === period);
  const ownsPlan = subscription && ["safe", "guard"].includes(subscription.plan_slug) && subscription.status !== "canceled";
  return <section className="space-y-6 rounded-2xl border border-white/15 p-6">
    <p role="status" aria-live="polite">{message}</p>
    {!user ? <div className="space-y-3">
      <p>Inicia sesión para contratar o administrar tu membresía.</p>
      <div className="flex flex-wrap gap-3">
        <button className={button} disabled={!ready || busy} onClick={() => run(() => login("google"))}>Entrar con Google</button>
        <button className={button} disabled={!ready || busy} onClick={() => run(() => login("apple"))}>Entrar con Apple</button>
      </div>
      {!ready && <p>El acceso a cuentas estará disponible próximamente.</p>}
    </div> : <div className="space-y-3">
      <p>Cuenta: {user.email || user.displayName}</p>
      {subscription && <p>Plan: {subscription.plan_slug} · {subscription.status === "active" ? "Activo" : subscription.status === "canceled" ? "Cancelado" : "Pendiente o inactivo"}
        {subscription.current_period_end && ` · Fin del periodo: ${new Date(subscription.current_period_end).toLocaleDateString("es-MX")}`}
        {subscription.cancel_at_period_end && " · Renovación cancelada"}</p>}
      <div className="flex flex-wrap gap-3">
        <button className={button} disabled={busy} onClick={() => run(async () => { await api("account", user); setSubscription(await api("subscription", user)); setMessage("Estado actualizado."); })}>Actualizar estado</button>
        <button className={button} disabled={busy} onClick={() => run(async () => { const auth = membershipAuth(); if (auth) await signOut(auth); })}>Cerrar sesión</button>
      </div>
      {ownsPlan && subscription.payment_provider === "stripe" && !subscription.cancel_at_period_end && <div>
        {!confirmCancel ? <button className={button} disabled={busy} onClick={() => setConfirmCancel(true)}>Cancelar renovación</button> : <div className="space-y-3">
          <p>Conservarás tu membresía hasta terminar el periodo pagado. ¿Quieres cancelar la siguiente renovación?</p>
          <button className={button} disabled={busy} onClick={() => run(async () => { setSubscription(await api("cancel", user)); setConfirmCancel(false); setMessage("La renovación fue cancelada."); })}>Sí, cancelar renovación</button>
          <button className={button} disabled={busy} onClick={() => setConfirmCancel(false)}>Conservar renovación</button>
        </div>}
      </div>}
    </div>}
    {!ownsPlan && <div className="space-y-4">
      <label className="block">Plan<select className="ml-3 rounded bg-slate-800 p-2" value={plan} disabled={busy} onChange={event => { setPlan(event.target.value); setAccepted(false); }}><option value="safe">Bluai Safe</option><option value="guard">Blu Guard</option></select></label>
      <label className="block">Periodo<select className="ml-3 rounded bg-slate-800 p-2" value={period} disabled={busy} onChange={event => { setPeriod(event.target.value); setAccepted(false); }}><option value="monthly">Mensual</option><option value="annual">Anual</option></select></label>
      {selected && <p className="text-xl font-bold">{new Intl.NumberFormat("es-MX", { style: "currency", currency: selected.currency, currencyDisplay: "code" }).format(selected.amount / 100)} / {period === "annual" ? "año" : "mes"}</p>}
      <p>El pago se completa en Stripe. Revisa el importe total antes de confirmar. La suscripción se renueva automáticamente cada {period === "annual" ? "año" : "mes"}; puedes cancelar la renovación desde esta página.</p>
      <label className="flex gap-3"><input type="checkbox" checked={accepted} disabled={busy} onChange={event => setAccepted(event.target.checked)} />Acepto los términos de servicio y el cobro recurrente del plan y periodo seleccionados.</label>
      <button className={`${button} bg-violet-700`} disabled={busy || !user || !subscription || !selected || !accepted} onClick={() => run(async () => {
        const result = await api("checkout", user, { plan_slug: plan, billing_period: period, price_id: selected?.price_id });
        window.location.assign(result.checkout_url);
      })}>{busy ? "Procesando…" : "Continuar al pago seguro"}</button>
    </div>}
  </section>;
}
