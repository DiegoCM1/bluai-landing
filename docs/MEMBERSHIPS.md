# Website memberships

`/membresias` signs in with the existing Bluai Firebase account, obtains prices
from Stripe through the backend, and opens Stripe Checkout for a recurring plan.
The signed Stripe webhook activates access, never the return URL. The page also
shows membership status and allows cancellation of the next renewal.

## Deployment

1. Deploy the companion Bluai backend web-checkout change to production, including
   its startup schema. Deploying only to dev/staging will not enable this website.
2. Confirm commercial prices/currency before configuring the four recurring live
   Stripe Prices (Safe/Guard, monthly/annual). The website has no fallback prices.
3. In Railway production set STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET and the four
   STRIPE_PRICE_{SAFE,GUARD}_{MONTHLY,ANNUAL} identifiers. Enable these signed events
   at `/api/v1/payments/webhook/stripe`: checkout.session.completed,
   customer.subscription.updated, customer.subscription.deleted, invoice.payment_failed.
   Set WEB_PAYMENTS_ORIGIN=https://www.bluai.com.mx and WEB_PAYMENTS_ENABLED=true
   only after configuration and approval of the prices.
4. Set the variables from `.env.example` in Vercel. Firebase public values must
   come from a web app in the same project used by production Bluai. Authorize
   www.bluai.com.mx (and any domain actually serving this page) in Firebase Auth.
   Enable/configure Google and Apple web sign-in, including Apple's service ID
   and Firebase return URL. Never put backend secret keys in Vercel public vars.
5. Deploy the Next server normally, without STATIC_EXPORT. The same-origin API
   routes require a server. Rebuild after changing NEXT_PUBLIC variables.
6. Verify sign-in for an existing app account, live price display, Stripe return,
   webhook activation, reload/status, and cancellation before announcing sales.
   No live charge has been made as part of development verification.

The downloadable APK is explicitly a **staging test build**. It does not share
production memberships. Publish a production APK before advertising it as the
app for website purchases. Do not remove the staging label from the existing APK.

Without configuration, checkout and login remain unavailable instead of simulating
a successful payment. Existing open checkout sessions are reused to avoid double
charges; a different plan must wait for the existing session to expire.

Reference: https://docs.stripe.com/payments/checkout/build-subscriptions
