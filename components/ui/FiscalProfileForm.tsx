"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { auth, onAuthStateChanged, type User } from "@/lib/billingClient";
import { ensureBluaiUser } from "@/lib/bluaiCheckout";
import { loadBilling, saveFiscalProfile, type FiscalProfile } from "@/lib/bluaiBilling";

const emptyProfile: FiscalProfile = { rfc: "", legal_name: "", postal_code: "", tax_regime: "", cfdi_use: "" };
const fields: { key: keyof FiscalProfile; label: string; hint: string; maxLength: number; pattern?: string }[] = [
  { key: "rfc", label: "RFC", hint: "12 o 13 caracteres", maxLength: 13, pattern: "[A-ZÑ&]{3,4}[0-9]{6}[A-Z0-9]{3}" },
  { key: "legal_name", label: "Nombre o razón social", hint: "Tal como está registrado ante el SAT", maxLength: 255 },
  { key: "postal_code", label: "Código postal fiscal", hint: "5 dígitos del domicilio fiscal", maxLength: 5, pattern: "[0-9]{5}" },
  { key: "tax_regime", label: "Clave de régimen fiscal", hint: "La clave de 3 dígitos de tu régimen", maxLength: 3, pattern: "[0-9]{3}" },
  { key: "cfdi_use", label: "Clave de uso del CFDI", hint: "La clave que corresponda a tu régimen y al uso de la factura", maxLength: 3, pattern: "[A-Z][0-9]{2}" },
];

export default function FiscalProfileForm() {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [profile, setProfile] = useState<FiscalProfile>(emptyProfile);
  const [loading, setLoading] = useState(false);
  const [signingIn, setSigningIn] = useState(false);
  const [saving, setSaving] = useState(false);
  const [available, setAvailable] = useState(false);
  const [testMode, setTestMode] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [reload, setReload] = useState(0);

  useEffect(() => auth ? onAuthStateChanged(auth, (nextUser) => {
    setUser(nextUser);
    setAuthReady(true);
    setProfile(emptyProfile);
    setAvailable(false);
    setTestMode(false);
    setError("");
    setMessage("");
  }) : undefined, []);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    setLoading(true);
    setAvailable(false);
    setTestMode(false);
    setError("");
    loadBilling(user).then(([capabilities, saved]) => {
      if (cancelled) return;
      setAvailable(capabilities.fiscal_profile_available);
      setTestMode(capabilities.status === "local_test");
      setProfile(saved ?? emptyProfile);
    }).catch((err: unknown) => {
      if (!cancelled) setError(err instanceof Error ? err.message : "No se pudieron cargar tus datos fiscales.");
    }).finally(() => {
      if (!cancelled) setLoading(false);
    });
    return () => { cancelled = true; };
  }, [user, reload]);

  async function signIn() {
    setSigningIn(true);
    setError("");
    try {
      await ensureBluaiUser();
      setReload((value) => value + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo iniciar sesión.");
    } finally {
      setSigningIn(false);
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user || !available || saving || signingIn) return;
    const owner = user.uid;
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const saved = await saveFiscalProfile(user, profile);
      if (auth?.currentUser?.uid === owner) {
        setProfile(saved);
        setMessage("Datos fiscales guardados. Todavía no se ha emitido una factura.");
      }
    } catch (err) {
      if (auth?.currentUser?.uid === owner) setError(err instanceof Error ? err.message : "No se pudieron guardar los datos.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      {testMode && <p role="status" className="rounded-xl border border-accent-cyan/40 bg-accent-cyan/10 p-4 text-sm">Modo de prueba: usa datos ficticios. Se guardan temporalmente y se borran al reiniciar el servidor. No se realizan cobros. Los documentos de demostración se generan por separado en el panel inferior.</p>}
      <div className="rounded-2xl border border-accent-orange/40 bg-accent-orange/10 p-5" role="note">
        <p className="font-semibold text-white">Facturación real pendiente de habilitar</p>
        <p className="mt-2 text-sm">Guarda tus datos fiscales. Puedes probar la generación y descarga de XML y PDF en el panel inferior cuando se configure el servicio gratuito de pruebas. La emisión con validez fiscal sigue pendiente.</p>
      </div>
      {!authReady ? <p role="status">Verificando tu sesión…</p> : !user ? (
        <div className="rounded-2xl border border-white/15 p-6">
          <p className="mb-4">Inicia sesión con el mismo correo que usas para comprar tu membresía.</p>
          <button type="button" onClick={signIn} disabled={signingIn} className="rounded-xl bg-accent-purple px-5 py-3 font-semibold text-white disabled:opacity-50">
            {signingIn ? "Iniciando sesión…" : "Continuar con Google"}
          </button>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-5 rounded-2xl border border-white/15 p-6" aria-busy={loading || saving}>
          <p className="break-all text-sm">Cuenta: <strong>{user.email}</strong></p>
          {loading && <p role="status">Cargando datos fiscales…</p>}
          <fieldset disabled={!available || loading || saving || signingIn} className="grid gap-5 sm:grid-cols-2 disabled:opacity-60">
            <legend className="sr-only">Datos fiscales del comprador</legend>
            {fields.map((field) => (
              <div key={field.key} className={field.key === "legal_name" ? "sm:col-span-2" : ""}>
                <label htmlFor={field.key} className="mb-2 block text-sm font-semibold text-white">{field.label}</label>
                <input id={field.key} name={field.key} value={profile[field.key]} required maxLength={field.maxLength} pattern={field.pattern}
                  inputMode={field.key === "postal_code" || field.key === "tax_regime" ? "numeric" : "text"}
                  aria-describedby={`${field.key}-hint`} autoCapitalize="characters"
                  onChange={(event) => {
                    setMessage("");
                    setProfile((current) => ({ ...current, [field.key]: event.target.value.toUpperCase() }));
                  }}
                  className="w-full rounded-xl border border-white/20 bg-navy-950 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-accent-cyan" />
                <p id={`${field.key}-hint`} className="mt-1 text-xs text-white/60">{field.hint}</p>
              </div>
            ))}
            <button type="submit" className="rounded-xl bg-accent-purple px-5 py-3 font-semibold text-white sm:col-span-2">
              {saving ? "Guardando…" : "Guardar datos fiscales"}
            </button>
          </fieldset>
          <p className="text-xs text-white/60">Guardar estos datos no confirma su validación ante el SAT. No necesitas subir tu Constancia de Situación Fiscal.</p>
          {!loading && !available && <button type="button" onClick={() => setReload((value) => value + 1)} className="text-sm underline">Volver a intentar</button>}
        </form>
      )}
      {error && <p role="alert" className="text-sm text-red-300">{error}</p>}
      {message && <p role="status" className="text-sm text-accent-green">{message}</p>}
      <p className="text-sm"><Link href="/aviso-de-privacidad">Aviso de privacidad</Link> · <Link href="/#membresias">Volver a membresías</Link></p>
    </div>
  );
}
