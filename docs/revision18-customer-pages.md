# Customer page design system

Revision 18 extends the accepted landing page to the public purchase, waitlist, confirmation, booking, policy, editorial, careers, investor, app and device setup pages.

## Design

- Shared CustomerFrame navigation and footer, DM Sans typography, white surfaces, near-black buttons, bronze focus and finish accents.
- Purchase begins with both finishes, followed by five existing approved product/lifestyle photographs. Compact swatches select the finish. The complete image column stays together when scrolling.
- Purchase and waitlist retain their real API submissions and validation. Required purchase consent remains separate from optional product updates.
- Success content requires a verified paid Stripe session with the expected product metadata. Missing or invalid sessions show a neutral verification message.
- Supporting public pages use the same palette and typography while preserving their functional controls and content. Staff tools remain outside the customer styling.
- Landing animation, pendant geometry and approved image files are unchanged. Next.js purchase and waitlist links remain on localhost; the standalone design preview keeps its production destination.

## Local preview

Run from this repository:

```sh
WATCHPACK_POLLING=true npm run dev -- --hostname 127.0.0.1 --port 3002
```

- Purchase: http://127.0.0.1:3002/pre-orders/purchase
- Waitlist: http://127.0.0.1:3002/waitlist
- Homepage: http://127.0.0.1:3002/

The local checkout, waitlist and account flows need the existing development Stripe/Supabase configuration. No mock transactions or signup success states were added.

## Validation

- `npm run build` passes, including compilation, type validation, all 92 static pages and build traces. The admin offers page now displays a configuration message when Supabase settings are missing instead of throwing during prerendering.
- The production server passed 37 route checks (36 public routes plus admin offers) and 75 referenced asset checks. `/engine` and `/engine/extension` retain their existing redirect to `/app`. Optimized Next.js images were verified with GET.
- `node tests/pendant-finish.mjs` passes: both finishes, checkout/cancellation metadata, fulfillment confirmations, invalid values, legacy default and unpaid-session guard. Adapters are mocked, with no external requests.
- Desktop and 390 px mobile purchase layouts inspected; no horizontal page overflow on mobile.
- Purchase and waitlist reject empty email input before submission.
- Gold query selection and canceled-checkout notice checked.
- Gallery selection, zoom and Escape focus restoration checked.
- Customer menu Escape restores toggle focus.
- Invalid success link remains unconfirmed.
- Audio setup instructions and investor CTAs were corrected for light-surface contrast. The demo iframe occupies the viewport below the responsive customer header.
- The protected lifestyle asset hash remains `c887ad44d06fc22965933696fdb2cdf41d76e840`.
- `git diff --check` passes; no credentials or generated build files are included.
- No real payment, account creation or waitlist email was submitted. Live integrations still require the existing Stripe and Supabase configuration.

## Release

The full customer migration must use the Next.js production build. `build:design` produces a standalone landing preview only.

The production domain uses the Cloudflare Worker `anticipy-site`. See [Cloudflare release setup](cloudflare-release.md) for the repository, build commands and required build-time configuration. The previous Vercel account restriction does not describe the current production serving path.

The migration is split into meaningful commits for shared foundations, purchasing, public information pages, app/device surfaces, and release readiness. No history was rewritten.
