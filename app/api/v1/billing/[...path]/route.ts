import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
const routes: Record<string, { method: string; path: string; auth: boolean }> = {
  capabilities: { method: "GET", path: "/billing/capabilities", auth: false },
  payments: { method: "GET", path: "/billing/payments", auth: true },
  invoices: { method: "POST", path: "/billing/invoices", auth: true },
  profile: { method: "GET", path: "/billing/profile", auth: true },
};

async function handle(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  const action = path.join("/");
  const download = /^invoices\/[a-fA-F0-9]{24}\/(pdf|xml)$/.test(action);
  const route = download ? { method: "GET", path: `/billing/${action}`, auth: true } : action === "profile" && request.method === "PUT" ? { method: "PUT", path: "/billing/profile", auth: true } : routes[action];
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
  if (request.method !== "GET" && request.headers.get("origin") !== request.nextUrl.origin) {
    return fail("Solicitud no permitida.", 403);
  }
  const authorization = request.headers.get("authorization") || "";
  if (route.auth && !/^Bearer \S+$/.test(authorization)) return fail("Inicia sesión para continuar.", 401);
  try {
    const expectedMode = process.env.BLUAI_PAYMENT_MODE;
    if (!["test", "live"].includes(expectedMode || "") || (process.env.VERCEL_ENV === "production" && expectedMode !== "live")) {
      return fail("El entorno de pagos requiere configuración.", 503);
    }
    const configResponse = await fetch(`${origin.origin}/api/v1/payments/web/config`, { cache: "no-store", redirect: "error", signal: AbortSignal.timeout(10000) });
    if (!configResponse.ok || (await configResponse.json()).mode !== expectedMode) {
      return fail("La web y el servicio de pagos no corresponden al mismo entorno.", 503);
    }
    let body: string | undefined;
    if (action === "profile" && request.method === "PUT") {
      body = JSON.stringify(await request.json());
    }
    if (action === "invoices") {
      const input = await request.json();
      body = JSON.stringify({ payment_id: input.payment_id });
    }
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
    if (download && upstream.ok) {
      const format = path[2];
      return new NextResponse(await upstream.arrayBuffer(), { headers: {
        ...headers, "Content-Type": format === "pdf" ? "application/pdf" : "application/xml",
        "Content-Disposition": `attachment; filename="bluai-prueba.${format}"`,
      } });
    }
    const data = await upstream.json();
    if (!upstream.ok) {
      const message = upstream.status === 422 ? "Revisa tus datos fiscales y su compatibilidad con el uso del CFDI." : upstream.status === 401 ? "Tu sesión venció. Vuelve a iniciar sesión."
        : upstream.status === 409 && typeof data.detail === "string" ? data.detail
        : "No pudimos completar la solicitud. Intenta nuevamente más tarde.";
      return NextResponse.json({ detail: message }, { status: upstream.status, headers });
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

export { handle as GET, handle as PUT, handle as POST };
