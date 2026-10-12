import { API_BASE_URL, authorizedFetch } from "@/lib/bluaiCheckout";
import type { User } from "@/lib/billingClient";

export type FiscalProfile = {
  rfc: string;
  legal_name: string;
  postal_code: string;
  tax_regime: string;
  cfdi_use: string;
};

export type BillingCapabilities = {
  fiscal_profile_available: boolean;
  invoice_issuance_available: boolean;
  status: string;
};

async function billingRequest<T>(user: User, path: string, init?: RequestInit): Promise<T> {
  const response = await authorizedFetch(user, `${API_BASE_URL}/api/v1/billing/${path}`, {
    ...init,
    cache: "no-store",
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    if (response.status === 404 || response.status === 503) {
      throw new Error("La configuración de facturación todavía no está disponible. Intenta más tarde.");
    }
    if (response.status === 422) {
      throw new Error("Revisa el RFC, nombre, código postal, régimen fiscal y uso del CFDI.");
    }
    throw new Error(typeof data?.detail === "string" ? data.detail : "No se pudieron consultar o guardar tus datos fiscales.");
  }
  return data as T;
}

export function loadBilling(user: User) {
  return Promise.all([
    billingRequest<BillingCapabilities>(user, "capabilities"),
    billingRequest<FiscalProfile | null>(user, "profile"),
  ]);
}

export function saveFiscalProfile(user: User, profile: FiscalProfile) {
  return billingRequest<FiscalProfile>(user, "profile", {
    method: "PUT",
    body: JSON.stringify(profile),
  });
}
