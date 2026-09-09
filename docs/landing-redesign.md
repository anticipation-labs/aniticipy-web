# Anticipy landing redesign — revision 3

The homepage uses the original Anticipy cream, charcoal, sand and quiet gold palette. The hero identifies Anticipy as an AI pendant and gives concrete jobs: capture a conversation, draft a follow-up, and schedule a next step with approval. The action walkthrough now follows immediately, before the rotating product story, “Keep your head in the real world” photograph, engineering study, privacy, FAQ, pale-stone scene and explicit pre-order module.

## Run and review

- `npm ci` then `npm run dev` serves the full Next.js application.
- `npm run build:design` produces a standalone, server-rendered review build in `dist/`, from the same `AnticipyLanding` component as the Next.js homepage.
- The static review links to the existing purchase, app, privacy, contact and waitlist pages. The Next.js homepage retains the existing `/api/waitlist` form integration.
- The owner-private Sites publication packages only the static review. It does not deploy the repository backend or replace anticipy.ai.

## Purchase journey

The persistent navigation, hero and stone scene lead to one on-page pre-order summary. It groups the $149.99 USD paid-now price, projected $199 launch price, pendant and chain, wireless pad, first year of AI service, estimated Q4 2026 delivery, free US/Canada shipping and full refund before shipment. Its primary button opens the existing purchase flow. The following disclosure explains the separate annual opt-in after the first year, currently projected at $99 USD/year, with no automatic enrollment. These terms were checked against the published pre-order agreement and refund policy on September 8, 2026.

On phones the hero places the product beside the headline and the purchase module places the decision details before the repeated product photograph. Distinct `data-cta-id` values feed the existing analytics handler for navigation, hero, demonstration, stone and checkout intent. This does not imply a measured conversion improvement.

Two existing checkout statements described refunds as discretionary, contradicting the published agreement's full-refund-before-shipment clause. The FAQ and acceptance checkbox now reflect that clause. The agreement itself is unchanged. The destination checkout also discloses the included first year and later annual opt-in, and no longer publishes a past offer-expiry date. These checkout corrections are in the repository PR; the static Site links to the currently deployed checkout.

## Motion implementation

The opening grows dotted rings and tangent controls, then overlaps the construction drawing with the physical pendant. It is localized to the product half so the headline is immediately readable. It exits after 1.3 seconds, with a CSS safety exit, a mobile bypass and reduced-motion bypass.

`PendantScene` lazy-loads Three.js near the product sections. `pendant-renderer` creates a continuous closed curved enclosure, an aperture, chain, component board and technical contours. The first native-scroll stage rotates the product through a full turn while benefits and recommendation cards change together. The engineering stage rotates, reveals the board through a transparent X-ray view and returns to the solid everyday view. The casing stays closed throughout, with no layer separation or seam line. A rectangular inspection frame and annotation cards move between chapters. All stages are reversible and directly selectable.

The renderer draws only on scroll, resize or visibility changes, pauses offscreen, caps pixel ratio and disposes its GPU resources. A photograph remains if WebGL initialization fails. The heavy renderer is a separate ES-module chunk.

Phones retain the product stages, with adjusted framing. Below 680px viewport height, these stages become normal-flow selectable chapters so copy cannot be pinned outside the visible screen. Reduced motion does the same and preserves direct chapter selection. The OS preference is authoritative; the footer also offers a motion toggle. The three-step action walkthrough is selectable and scroll-driven on suitable desktops. Its approval example is illustrative and sends no email.

The menu uses a native dialog with focus containment, Escape dismissal and destination focus. FAQ items are native disclosures. Native page scrolling is retained. The pre-existing discount popup remains suppressed only on this homepage.

## Reference decisions

- [Pocket](https://heypocket.com/pages/pocket): explicit product category and outcome, a consistent purchase destination, input-to-output explanation, and offer details beside the purchase decision. Eight desktop states were captured; mobile behavior was inspected in served CSS and DOM. No conversion analytics were available.
- [Oryzo](https://oryzo.ai/): timed construction-to-material overlap and continuous product emphasis, adapted to keep the purchase message visible.
- [Sensiq](https://sensiq.co/): central rotating product, left benefit copy, right recommendation, continuous bent hairline and pale stone composition.
- [Mira](https://trymira.com/): actual viewpoint changes, solid/technical stages, moving rectangular frame, annotation cards and chapter rail. The latest closed-casing direction replaces the earlier exploded treatment.
- [Floema](https://floema.com/en): photographic scale, spare typography and clear image boundaries.
- [Fine](https://fine-n7vljkp34f.peachworlds.com/): persistent sculptural object and quiet pacing.
- [Komma](https://kommakomma.is/): displaced-page menu and editorial scale.
- [Alexandre Araujo](https://alexandre-araujo.com/): restrained navigation and hairline structure.

The earlier study includes 57 captured reference states, including timed Oryzo opening samples. These are sampled observations, not a claim to have inspected every encoded frame or recovered original animation curves.

## Images, shape and fidelity

All 11 unique supplied pendant photos were inspected; repeat filenames were byte-identical duplicates. Shape decisions emphasize the continuous domed crown, straight middle sides, broad rounded lower end, rolled face and small plain upper aperture. A shared frontal width-to-height target of 1:1.50 guides the hero, stone scene, lifestyle pendant and procedural shell. This is a visual reconstruction; perspective photographs do not establish precise physical dimensions.

Revision 3 removes the apparent lower cap and transverse reflection band. Higgsfield GPT Image 2 was selected after Seedream and Nano Banana edits retained the unwanted ridge. The hero master guides the stone and on-body pendant edits. The warm scoop-neck lifestyle composition is retained while the pendant is corrected to the same proportions and closed casing. Assets are optimized WebP files.

The 3D shell is a visual reconstruction, not measured CAD. The board layout is conceptual and labeled on the page. Generated imagery and the procedural model are design visualizations rather than engineering verification. Source prototype photos are not committed. Locally hosted DM Sans retains its SIL Open Font License in `public/redesign/fonts/OFL.txt`.

## Verification

- TypeScript and static review build checks are run for each delivered revision.
- Browser checks cover desktop and phone layouts, product framing, menu navigation, FAQ and service disclosure, reverse scrolling, direct hardware chapters, reduced motion, image loading, and horizontal overflow. Purchase links are verified without submitting an order.
- The previous full Next.js compilation/type validation passed, but prerendering the existing `/admin/offers` route requires the project's missing Supabase configuration (`supabaseUrl is required`). This remains an environment limitation; no substitute credentials were introduced.
- No real purchases, waitlist submissions or email actions were performed during verification.
