# Anticipy landing redesign — revision 2

The homepage uses the original Anticipy cream, charcoal, sand and quiet gold palette. A construction drawing resolves into the pendant hero, followed by a rotating product story, the preserved “Keep your head in the real world” photograph, a four-part engineering study, the interactive action walkthrough, privacy, FAQ and a pale-stone product scene.

## Run and review

- `npm ci` then `npm run dev` serves the full Next.js application.
- `npm run build:design` produces a standalone, server-rendered review build in `dist/`, from the same `AnticipyLanding` component as the Next.js homepage.
- The static review links to the existing purchase, app, privacy, contact and waitlist pages. The Next.js homepage retains the existing `/api/waitlist` form integration.
- The owner-private Sites publication packages only the static review. It does not deploy the repository backend or replace anticipy.ai.

## Motion implementation

The opening grows dotted rings and tangent controls, then overlaps the construction drawing with the physical pendant. It exits after 2.3 seconds, with a CSS safety exit and reduced-motion bypass.

`PendantScene` lazy-loads Three.js near the product sections. `pendant-renderer` creates curved front/rear shells, an aperture, chain, seams, component board and technical contours. The first native-scroll stage rotates the product through a full turn while benefits and recommendation cards change together. The engineering stage rotates, separates the shell/board layers, fades to contours, and reassembles; a rectangular inspection frame and annotation cards move between chapters. All stages are reversible and directly selectable.

The renderer draws only on scroll, resize or visibility changes, pauses offscreen, caps pixel ratio and disposes its GPU resources. A photograph remains if WebGL initialization fails. The heavy renderer is a separate ES-module chunk. Superseded exploded-image and video assets have been removed.

Phones retain the product stages, with adjusted framing. Below 680px viewport height, these stages become normal-flow selectable chapters so copy cannot be pinned outside the visible screen. Reduced motion does the same and preserves direct chapter selection. The OS preference is authoritative; the footer also offers a motion toggle. The original three-step action walkthrough remains selectable and scroll-driven on suitable desktops. Its approval example is illustrative and sends no email.

The menu uses a native dialog with focus containment, Escape dismissal and destination focus. FAQ items are native disclosures. Native page scrolling is retained. The pre-existing discount popup remains suppressed only on this homepage.

## Reference decisions

- [Oryzo](https://oryzo.ai/): timed construction-to-material overlap, expansive wordmark and continuous product emphasis.
- [Sensiq](https://sensiq.co/): central rotating product, left benefit copy, right recommendation, continuous bent hairline and pale stone composition.
- [Mira](https://trymira.com/): actual viewpoint changes, solid/technical/exploded stages, moving rectangular frame, annotation cards and chapter rail.
- [Floema](https://floema.com/en): photographic scale, spare typography and clear image boundaries.
- [Fine](https://fine-n7vljkp34f.peachworlds.com/): persistent sculptural object and quiet pacing.
- [Komma](https://kommakomma.is/): displaced-page menu and editorial scale.
- [Alexandre Araujo](https://alexandre-araujo.com/): restrained navigation and hairline structure.

The revised study includes 57 captured reference states, including timed Oryzo opening samples. These are sampled observations, not a claim to have inspected every encoded frame or recovered original animation curves.

## Images, shape and fidelity

All 11 unique supplied pendant photos were inspected; repeat filenames were byte-identical duplicates. Shape decisions emphasize the continuous domed crown, straight middle sides, broad rounded lower cap, rolled face and small plain upper aperture. Perspective photographs do not establish precise physical dimensions.

Higgsfield Nano Banana Pro and Seedream 5.0 Pro were compared using actual prototype references. Seedream produced the selected hero and stone scene; Higgsfield background removal produced the hero transparency. The original GPT Image 2 scoop-neck lifestyle image and its section composition were restored exactly as requested, without regenerating the person or necklace. Assets are optimized WebP files.

The 3D shell is a visual reconstruction, not measured CAD. The board layout is conceptual and labeled on the page. Generated imagery and the procedural model are design visualizations rather than engineering verification. Source prototype photos are not committed. Locally hosted DM Sans retains its SIL Open Font License in `public/redesign/fonts/OFL.txt`.

## Verification

- `npx tsc --noEmit` and `npm run build:design` pass.
- Browser checks cover desktop at 1406×755 and 1440×900, phone at 390×844, and compact landscape at 667×375; full product framing, menu navigation, FAQ disclosure, reverse scrolling, direct hardware chapters, reduced motion, image loading and horizontal overflow were checked.
- No browser runtime errors or warnings were observed in the checked preview.
- The previous full Next.js compilation/type validation passed, but prerendering the existing `/admin/offers` route requires the project's missing Supabase configuration (`supabaseUrl is required`). This remains an environment limitation; no substitute credentials were introduced.
- No real purchases, waitlist submissions or email actions were performed during verification.
