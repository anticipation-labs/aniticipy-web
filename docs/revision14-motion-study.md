# Hero motion study and implementation

All eight supplied sites were revisited on September 9, 2026. The study inspected 298 fresh sequential screenshot samples across intro and early-scroll sequences, with actual capture start/end timestamps and contact sheets. These are sampled states, not every rendered frame or exact measurements of authored easing. A headless recording attempt failed before page creation; the successful evidence comes from separate CUA research tabs. Invalid scroll-focus attempts were excluded and recaptured.

## Observed mechanisms

| Source | Fresh observation | Translation into Anticipy |
| --- | --- | --- |
| [Sensiq](https://sensiq.co/) | Product, headline, support and CTA establish successive beats, with headline visible around 0.65s and CTA around 1.8s in the sampled reload. | Product appears first; message resolves early; support and CTA follow closely. |
| [Komma](https://kommakomma.is/) | Quote pieces assemble before a rising curtain uncovers the photograph; scroll replaces words through masks. | A decisive image wipe and masked text entry, without a blocking brand loader. |
| [Mira](https://trymira.com/) | A 5.96-second product film changes angle and material detail beneath stable typography. Later heading lines appear through rectangular wipes. | Actual photographic turns reveal thickness and reflections while settled type remains still. |
| [Floema](https://floema.com/en) | A stable sentence is surrounded by an expanding, drifting image field with different scales and opacities. | A coordinated close-up-to-rest camera move establishes depth around a stable reading area. |
| [Alexandre Araujo](https://alexandre-araujo.com/) | Media rises around 0.75–1.04s; the wordwise title is partial at 1.25s and settled by 1.50s. | Media and staggered masked headline have distinct but coordinated entrance timing. |
| [Fine](https://fine-n7vljkp34f.peachworlds.com/) | After its opening, the object reorients beneath fixed copy. Across the first scroll, it persists and enlarges as copy changes. | The same pendant remains present through its photographic turn and native-scroll exit. |
| [Oryzo](https://oryzo.ai/) | Construction geometry expands and fills; its contours remain registered with the physical material during the handoff around 2.6s. | Preserve spatial continuity. The pendant stays photographic, without another CAD construction intro. |
| [Pocket](https://heypocket.com/pages/pocket) | Film shows attachment, a control/material macro and multiple finishes beneath a stable headline. The fresh load included a loading overlay. | Use a meaningful first-frame poster and genuinely changing product views and finishes. No loading overlay is introduced. |

The observations inform art direction, not measured conversion claims. A continuous Pocket pullback between its sampled macro and group shots was not established. Anticipy's camera pullback is a newly authored CSS composition around actual moving photographic footage.

## Implemented sequence

The hero is an asymmetric white stage with oversized black typography and a large portrait crop of the pendant film. Pricing, shipping details, AI offer details and price comparison are confined to the purchase section. Navigation and Buy Now remain available immediately.

- The camera reveals through a horizontal mask and pulls from a close-up into the complete pendant over 2.2 seconds.
- The lead line and two main headline lines rise through masks with 0.16, 0.30 and 0.47-second starting offsets. Their easing reaches a readable state early, then settles.
- Supporting copy and Buy Now follow at 0.8 seconds. A thin footer rule and film control establish the final stage.
- The 14.5-second photographic loop turns from front to side and back, then dissolves between silver and gold while the headline remains still.
- Native scrolling moves image and copy at slightly different rates. There is no scroll lock or forced loading sequence.

## Film provenance and delivery

`public/redesign/pendant-hero-film.mp4` derives from the existing accepted silver and gold photographic turns, with no new geometry or image generation. The silent 1600×900 H264 film runs at 24fps, has fast-start metadata and is 3,201,020 bytes. Front-facing dissolves occur at 6.50–7.25s and 13.75–14.50s; the loop returns to the matching silver boundary. The companion poster is `pendant-hero-poster.webp`.

The film loads only when its section intersects the viewport and pauses outside it or in a hidden document. It has a visible pause/play control. System reduced-motion preference and the page motion toggle show the static poster with resolved text and no video request. A media error leaves the poster and removes the unusable play control. All listeners, media resources and observers clean up when the component unmounts.

## Verification

Eighteen fresh desktop samples cover the implemented opening and full finish loop. The product is visible by the 0.30–0.35s capture; the main message is readable at 0.80–0.86s; the support and buying action are visible by 1.25–1.37s; the composition is resolved at 2.20–2.29s. Later samples show real angle changes, gold, and the return to silver. Capture intervals include browser and screenshot latency.

Desktop 1440×900 and mobile 390×844 were visually inspected. Film play/pause, offscreen pause, reduced motion, hero-to-order navigation, the paired initial gallery photo and retained purchase pricing were verified. No price, currency, offer terms or em dash appears in the hero. TypeScript, static build and whitespace checks pass. This is an owner-private preview; the production store/backend are unchanged.
