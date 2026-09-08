# Anticipy landing redesign

The homepage now presents the pendant through a large typographic opening, a three-step action walkthrough, an editorial lifestyle chapter, and a scroll-controlled exploded study. Pale mineral surfaces, forest green, and a restrained lime accent connect the sections. All styles are scoped beneath `ap-site`.

## Run and review

- `npm ci` then `npm run dev` serves the full Next.js application.
- `npm run build:design` produces a standalone, server-rendered review build in `dist/`, using the same `AnticipyLanding` component as the Next.js homepage.
- Serve `dist/` with any static server. The preview uses the existing live purchase, app, privacy, contact, and waitlist pages. It does not simulate a signup or payment backend.
- The Next.js homepage continues to submit its email form to the existing `/api/waitlist` endpoint.

The private Sites configuration packages only the static review build. It does not replace the existing Anticipy production deployment or deploy the repository's backend.

## Motion and interaction

A finite construction-circle opening reveals the hero. A cutout pendant moves subtly with scroll. On tall desktop screens, scrolling drives the three-step walkthrough; the same buttons remain directly selectable. Phones and short screens use an unpinned walkthrough. The approval example is explicitly illustrative and sends no email.

The hardware study animates three clipped regions of one transparent Higgsfield image. The front shell rises, the board appears, and the rear enclosure lowers. The motion is reversible and does not depend on seeking a video decoder. Reduced motion presents the separated layers statically; the footer also provides a motion toggle. An operating-system reduced-motion preference remains authoritative.

The menu uses a native dialog with focus containment, Escape dismissal, and destination focus after section navigation. FAQ items use native disclosure controls. The homepage uses native scrolling and suppresses the pre-existing discount popup so the product story stays uninterrupted. Other routes retain their existing behavior.

## Visual references

- [Oryzo](https://oryzo.ai/): construction geometry, oversized opening wordmark, persistent product choreography, engineering and material chapters.
- [Sensiq](https://sensiq.co/): synchronized scroll chapters, quiet technical metadata, lime progress accents.
- [Komma](https://kommakomma.is/): page displacement when the menu opens and confident editorial scale.
- [Mira](https://trymira.com/): dark/light chapter contrast, focus brackets, engineering imagery.
- [Floema](https://floema.com/en): spacious typography and a full-bleed photographic chapter.
- [Alexandre Araujo](https://alexandre-araujo.com/): hairline rows, restrained navigation, active-state hierarchy.
- [Fine](https://fine-n7vljkp34f.peachworlds.com/): a persistent sculptural object and a calm atmospheric pace.

Reference research sampled rendered opening, scrolling, and interactive states. It did not recover source animation curves or inspect every encoded frame.

## Asset provenance and limits

Higgsfield GPT Image 2 product-photoshoot generated the hero, lifestyle, and exploded images from supplied pendant and board references at 2K/high quality. Higgsfield background removal produced the two transparent images used by the page. Seedance 2.0 generated an eight-second, 1080p concept film; its separate watch link uses a compressed 1600px encode.

The film contains a temporary extra-shell artifact during disassembly and is not used to drive the scroll study. The refined lifestyle image follows the broad capsule silhouette more closely than the first generation; the exploded board/enclosure arrangement is still interpretive. These are design visualizations, not engineering verification or final production photographs. Replace them with approved photography/CAD renders before a public product launch. Original private reference photos and board screenshots are not included in the source change.

DM Sans is locally hosted under the SIL Open Font License in `public/redesign/fonts/OFL.txt`.

## Verification

- TypeScript: `npx tsc --noEmit` passes.
- Standalone production preview: `npm run build:design` passes.
- Full Next.js production compilation and type validation pass, but prerendering the existing `/admin/offers` route fails without the project's Supabase environment configuration (`supabaseUrl is required`). No substitute credentials were introduced.
- Browser checks cover 1440×900 desktop, 390×844 phone, and 1020×650 short-screen layouts; section navigation; menu dismissal and focus; all walkthrough stages; the illustrative approval receipt; FAQ disclosures; motion-off mode; and image loading/overflow.
- No real purchases, waitlist submissions, or production email actions were performed during verification.
