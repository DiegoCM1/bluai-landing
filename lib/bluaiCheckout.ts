import { auth, signInWithBluaiGoogle, type User } from "@/lib/billingClient";
// The server proxy selects the backend; no public URL or secret is required.
export const API_BASE_URL = "";
export async function authorizedFetch(user: User, url: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json");
  headers.set("Authorization", `Bearer ${await user.getIdToken()}`);
  return fetch(url, { ...init, headers });
}
export async function ensureBluaiUser() {
  const user = auth?.currentUser ?? await signInWithBluaiGoogle();
  const response = await authorizedFetch(user, "/api/memberships/account", { method: "POST" });
  if (!response.ok) throw new Error("No se pudo vincular tu cuenta con Bluai.");
  return user;
}
