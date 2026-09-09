# Anticipy landing redesign — revision 5

The homepage leads with “Not a note taker. An action taker.” The visible explanation identifies an AI pendant and email, calendar and task actions. Three repetitive introductory sections have been replaced by one interactive workflow with distinct scheduling, email and renewal-reminder examples. Each has a concrete request, an application preview, an approval step and a replayable outcome. All examples are clearly identified as demonstrations and create no external actions. The optional `/action-taker/` campaign uses the same approved positioning.

## Run and publication boundary

- `npm ci` then `npm run dev` serves the Next.js application.
- `npm run build:design` produces the server-rendered static review in `dist/`, including both `/` and `/action-taker/`, using the same components as Next.js.
- The owner-private Sites publication hosts this static review. It does not deploy the backend or replace anticipy.ai.
- Static preview purchase, waitlist, app, contact and policy links point to the existing production site. The production checkout will honor the new finish selection after this PR is deployed there. The Next.js homepage retains its existing waitlist API integration.

## Positioning and reference decisions

Pocket's explicit category, outcome story, grouped privacy assurances, categorized FAQ and adjacent buying information informed the layout. Anticipy uses its own copy and assets. Mira informed the rotating solid/interior/detail/everyday sequence and moving inspection frames. Sensiq informed the central product, recommendation cards and pale stone composition. Oryzo informed the construction-to-material transition; Floema and Fine informed image scale and pacing.

The latest official Plaud One and Pocket pages already market actions through connected tools. This implementation makes no first-to-market or named-competitor-only-transcribes claim. The interactive workflows are examples, not evidence of a shipped integration. No reviews, customer counts, scarcity timers or measured conversion gains were invented. The founder confirmed individual use of early prototypes by founders of YC-backed companies and people who have worked at Mentra and Open Door Law. A readable text statement describes that relationship and explicitly excludes organizational endorsement. No logo permission was supplied, so no logos are displayed.

The approved lifestyle photograph defines the site palette: ivory #F8F7F4, warm white #FEFDFB, linen #EFEDE8, sand #E3DFD7, charcoal #2D2B27, taupe #65615A and restrained bronze #705D48. Primary actions use dark charcoal; text, checkmarks and visible warm outlines reinforce state. Cool blue backgrounds and accents are removed. The UI uses light tints of the photograph’s hue family rather than reproducing its darker shadow pixels. This is a design hypothesis, not a universal claim about color psychology. The research brief separately recommends testing message comprehension, trust and qualified pre-orders, with separate tests for comprehension and purchase behavior. Revision 5 reduces yellow chroma in large surfaces and uses charcoal/white application previews for stronger content differentiation. Saturation research is context dependent; these tokens are art direction, not a universal conversion formula. See [research notes](revision-5-research.md).

## Pendant geometry and images

`pendant-design.ts` is the shared visual specification for both finishes. Relative dimensions are width 1.58, height 2.37 and depth 0.60; the width:height ratio is 1:1.50. The procedural shell, aperture, technical contours and drawing derive from these values. Changing silver to gold changes material color, not geometry, camera progress or layout. All static images show a continuous closed enclosure; the whole shell separates only inside the rotating technical sequence and rejoins for the everyday view. There is no transverse lower-cap split. The technical opening now moves the front and rear shells in directions that expose the central board instead of occluding it; uniform scene scaling preserves relative component dimensions.

The hero construction guide is a pendant-shaped rounded oblong, dissolving into the material image. On narrow screens the product is immediately visible beside the headline. The warm scoop-neck lifestyle composition and “Keep your head in the real world” treatment remain in place. The gold cutout and stone images were generated with GPT Image 2 using the accepted silver master as a reference, then optimized as WebP assets.

The supplied photographs and PCB screenshots support visual reconstruction, not physical measurements. Generated images are not guaranteed geometrically identical to a CAD model. The procedural model and internal board are design studies, not manufacturing CAD or Blender deliverables; the interior is labeled conceptual. No dimensioned mechanical source was supplied for this revision. Source prototype photographs and temporary generation artifacts are not committed.

## Motion, accessibility and performance

The renderer is lazy-loaded near each product section, uses on-demand rendering, pauses offscreen, caps pixel ratio and disposes GPU resources. An image remains if WebGL fails. Native scroll drives reversible chapters, also available through direct buttons. Low-height screens and reduced-motion mode use selectable normal-flow chapters. The OS reduced-motion setting is honored; a footer control also disables animation. The campaign immediately exposes its result in reduced motion.

The native-dialog menu contains focus and closes with Escape. FAQ disclosures are native `details` elements. Finish controls use labeled fieldsets and pressed state; example selection resets the walkthrough, while a status region announces the proposed action and outcome. Timers stop offscreen, on example change, and under reduced motion. The walkthrough uses normal document flow at every width, so it has no fixed-height clipping. A scoped campaign header background preserves navigation contrast. No extra image or animation framework was added. Approximately 19 KB of unreferenced CSS from the removed walkthroughs was deleted.

## Purchase and fulfillment

The offer shows $149.99 USD charged today, projected $199 launch price, estimated Q4 2026 shipping, included chain/charging pad/first year of AI service, free US/Canada delivery and full refunds before shipment. The projected price difference is correctly $49.01. Continued cloud AI after the first year requires a separate annual opt-in, currently projected at $99 USD/year, with no automatic enrollment. The projected later service cost and smartphone dependency appear beside the purchase information. Finish thumbnails provide direct silver/gold previews. Published agreement/refund terms were checked September 8, 2026.

Silver/gold selection is allowlisted at the purchase page and checkout API. The selected finish is stored in Stripe Checkout and PaymentIntent metadata, retained in the cancellation URL, copied to existing order JSON metadata by the paid webhook, and displayed on success and customer/owner confirmations. Missing finish defaults to silver for existing checkout clients; malformed values are rejected before Stripe. Existing pricing, eligible discounts, consents and fulfillment guards remain. No database migration is needed.

## Verification

- Static build, TypeScript and `git diff --check` pass.
- `node tests/pendant-finish.mjs` passes mocked route-to-fulfillment contract checks for silver/gold, cancellation, metadata, confirmations, malformed inputs, legacy default and unpaid guard. It makes no external requests.
- Revision 5 browser checks cover 1440px desktop and 820px, 390px and 320px layouts. All three examples complete and replay; silver/gold selection updates the purchase link; the navigation dialog, reduced motion, technical opening and optional campaign work. The new walkthrough has equal client/scroll dimensions, with no clipped panels. No horizontal page overflow or broken loaded images was found at tested widths, and the final browser session had no console errors.
- A bounded solid-background text audit checked 155 rendered text elements with no failures after darkening the projected-price label. Photographic/gradient backgrounds were excluded; this is not a full accessibility certification.
- The protected lifestyle asset is byte-identical to the previous revision.
- Full Next.js prerendering still requires the project's existing Supabase configuration at `/admin/offers`; no placeholder credentials were introduced.
- No real purchases, waitlist entries or email sends were performed. No conversion lift has been measured.
