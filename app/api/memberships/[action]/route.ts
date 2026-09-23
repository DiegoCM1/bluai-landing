import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
const routes: Record<string, { method: string; path: string; auth: boolean }> = {
  plans: { method: "GET", path: "/payments/web/plans", auth: false },
  account: { method: "POST", path: "/users/me", auth: true },
  subscription: { method: "GET", path: "/payments/subscription", auth: true },
  checkout: { method: "POST", path: "/payments/web/checkout", auth: true },
  cancel: { method: "POST", path: "/payments/subscription/cancel", auth: true },
};

async function handle(request: NextRequest, context: { params: Promise<{ action: string }> }) {
  const { action } = await context.params;
  const route = routes[action];
  const headers = { "Cache-Control": "no-store" };
  const fail = (message: string, status: number) => NextResponse.json({ error: message }, { status, headers });
  if (!route || route.method !== request.method) return fail("Solicitud no disponible.", 404);
  const base = process.env.BLUAI_API_URL;
  if (!base) return fail("Las membresías todavía no están disponibles.", 503);
  // A server-only deployment setting; never accept a target URL from the browser.
  let origin: URL;
  try { origin = new URL(base); } catch { return fail("Las membresías todavía no están disponibles.", 503); }
  if (origin.protocol !== "https:" || origin.username || origin.password || origin.search || origin.hash || origin.pathname !== "/") {
    return fail("Las membresías todavía no están disponibles.", 503);
  }
  if (request.method === "POST" && request.headers.get("origin") !== request.nextUrl.origin) {
    return fail("Solicitud no permitida.", 403);
  }
  const authorization = request.headers.get("authorization") || "";
  if (route.auth && !/^Bearer \S+$/.test(authorization)) return fail("Inicia sesión para continuar.", 401);
  try {
    let body: string | undefined;
    if (action === "checkout") {
      const input = await request.json();
      if (!["safe", "guard"].includes(input.plan_slug) || !["monthly", "annual"].includes(input.billing_period) || typeof input.price_id !== "string") {
        return fail("Selecciona un plan y periodo válidos.", 400);
      }
      body = JSON.stringify({ plan_slug: input.plan_slug, billing_period: input.billing_period, price_id: input.price_id });
    }
    const upstream = await fetch(`${origin.origin}/api/v1${route.path}`, {
      method: route.method, cache: "no-store", redirect: "error", signal: AbortSignal.timeout(25000),
      headers: { "Content-Type": "application/json", ...(route.auth ? { Authorization: authorization } : {}) }, body,
    });
    const data = await upstream.json();
    if (!upstream.ok) {
      const message = upstream.status === 401 ? "Tu sesión venció. Vuelve a iniciar sesión."
        : upstream.status === 409 && typeof data.detail === "string" ? data.detail
        : "No pudimos completar la solicitud. Intenta nuevamente más tarde.";
      return fail(message, upstream.status);
    }
    if (action === "checkout") {
      const checkout = new URL(data.checkout_url);
      if (checkout.protocol !== "https:" || checkout.hostname !== "checkout.stripe.com" || checkout.username || checkout.password) return fail("No se pudo abrir el pago seguro.", 502);
    }
    return NextResponse.json(data, { headers });
  } catch {
    return fail("No pudimos contactar al servicio. Intenta nuevamente.", 503);
  }
}

export { handle as GET, handle as POST };
