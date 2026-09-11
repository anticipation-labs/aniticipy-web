# Cloudflare release setup

The customer redesign lives in `anticipation-labs/aniticipy-web`. This is a different repository from `anticipation-labs/Anticipy`, the backend repository. The existing website Worker is `anticipy-site`.

This integration combines the redesign on `main` with the previously deployed OpenNext adapter and runtime fixes on `cloudflare`. It preserves the Stripe fetch transport and timeout, referral redirect handling, Cloudflare geo headers, static Apple icon and `/app` routing workaround. The `/enter` alias now shares the redesigned customer frame. Product geometry, photography, animation and purchase consent are unchanged.

## Workers Builds configuration

Apply after this integration is merged into `main`:

| Setting | Value |
| --- | --- |
| Git repository | `anticipation-labs/aniticipy-web` |
| Production branch | `main` |
| Root directory | `/` |
| Build command | `npm run cf:build` |
| Deploy command | `npm run cf:deploy` |
| Non-production version command | `npm run cf:upload` |

`npm run build` alone produces Next.js output, but does not produce `.open-next/worker.js`. `build:design` is only a standalone landing-page preview and cannot deploy the purchase or API routes.

Keep the existing Worker and custom domains. `keep_vars: true` preserves dashboard-managed variables such as the Stripe product and price IDs. Runtime secrets remain managed in Cloudflare, never committed to Git.

## Configuration before deployment

Workers Builds has a separate environment from Worker runtime secrets. Supply the existing production `NEXT_PUBLIC_*` values used by this application to the build environment, particularly `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SITE_URL` and the configured engine, analytics and asset URLs. These values are embedded in browser code during `next build`; adding them only as runtime secrets does not populate the browser bundle.

Preserve existing server-side Stripe, Supabase, mail and gate secrets on `anticipy-site`. Do not put server credentials in a `NEXT_PUBLIC_*` variable. The local verification used no production credentials, so it does not verify live payments, email delivery or authenticated accounts.

Two existing operational details remain outside this design integration: referral handlers default to the Railway origin while HQ rewrites default to the Cloudflare API, so confirm the intended `FELLOWSHIP_ORIGIN` and referral attribution before changing either; and `vercel.json` cron entries do not create Cloudflare cron triggers. The observed Worker has no cron triggers.

## Verification

- Clean dependency installation and `npm run cf:build` pass, including compilation, type checking and OpenNext Worker bundling.
- `node tests/pendant-finish.mjs` passes with mocked external adapters for silver/gold checkout, cancellation, metadata, fulfillment, invalid values and the unpaid-session guard.
- `wrangler deploy --dry-run` successfully packages the Worker; this command does not deploy.
- Local `npm run cf:preview -- --port 3003` serves the redesigned homepage, gold purchase, waitlist, app/download, privacy, terms, booking, careers and neutral order-confirmation pages.
- `/app?view=download` and `/enter` render the application inside the customer frame. Unauthenticated `/internal` returns 401.
- All 27 homepage-referenced asset requests pass. The protected lifestyle asset hash remains `c887ad44d06fc22965933696fdb2cdf41d76e840`.
- The purchase page was visually inspected in the Worker preview: both pendants appear in the first image and the gold query selects Gold.

After a successful production build, verify the active deployment's commit matches the merged integration, then inspect `https://www.anticipy.ai/` and the purchase, waitlist and app routes. A Git connection by itself does not replace the currently active deployment. Retain the preceding Worker version for rollback.

References: [OpenNext deployment](https://opennext.js.org/cloudflare/howtos/dev-deploy), [build and runtime environments](https://opennext.js.org/cloudflare/howtos/env-vars), [Wrangler configuration](https://developers.cloudflare.com/workers/wrangler/configuration/).
