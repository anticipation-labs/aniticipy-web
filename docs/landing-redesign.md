# Anticipy landing redesign

The hero now uses a full-screen asymmetric composition with a large photographic pendant film and masked typography. “Not a note taker. An action taker.” resolves in stages while the pendant pulls back, turns and changes between silver and gold. The hero has a Buy Now action, with pricing and offer details kept in the purchase section. The rejected simulated conversation/calendar/email walkthrough has been removed. Its replacement, “Turn words into action,” uses open typography, three capability descriptions and a purchase anchor. It contains no fake application interface or simulated completion states.

## Visual direction

The latest user request supersedes the cream page palette. White #FFFFFF now dominates page space, black #111111 anchors text and buttons, and #626262 supports secondary copy. Pale neutral grey is confined to product display surfaces. Anticipy's bronze #705D48 remains in selected states, icons and thin lines; silver/gold product imagery and the warm lifestyle photograph retain their color. The footer uses black. Fine's open white Services section informed spacing and typography: https://fine-n7vljkp34f.peachworlds.com/.

The approved scoop-neck necklace image and its “Keep your head in the real world” composition remain unchanged. No conversion lift has been measured. Earlier research and source qualifications remain in revision-5-research.md; its cream palette and interactive-demo recommendations are superseded here.

## Hero reference synthesis

All eight supplied reference heroes were freshly sampled and inspected. See [revision14-motion-study.md](revision14-motion-study.md) for observed motion, source links, implementation timing, film provenance and evidence limits. The current hero replaces the previous centered still-photo layout. It uses the accepted photographic turns in a 14.5-second silent loop, a meaningful poster, staged line masks, a close-up-to-rest entrance and native-scroll parallax. The page remains white and black, with metal finishes supplying color. Pricing and purchase terms remain in the order section.

## Photographic pendant story

The “Wear it. Get on with your day.” scene now uses reference-based Higgsfield MCP video, replacing its procedural renderer. Both finishes have a continuous closed body, a fine chain and a small upper aperture. The gold version derives from the silver motion so the silhouette and turn are consistent. A candidate with a visible casing seam was rejected. White-background edits allow the photographic visualization to sit in the new page palette.

These are AI-generated photographic visualizations, not footage of a physical unit or measured 3D scans. The separate rotating technical/exploded scene remains a labeled concept study, as previously requested. The shared relative specification is width 1.58, height 2.37, depth 0.72; photographs are not guaranteed dimensionally identical to a procedural model. No manufacturing CAD/Blender file is created.

Accepted Higgsfield jobs:

- Silver reference turn: ef964d60-28c6-4c7e-8bdb-0919a827310c; final white-background edit: fddaee27-55c0-4afc-bf89-2778066e708a.
- Gold finish edit of that turn: 467a3f1a-3255-4ff0-9371-c2481bc97870; final white-background edit: 73537ef2-16b8-4b8e-b6f9-83daa20db229.
- Models: Seedance 2.0 for the reference turn, Seedance 2.5 for finish/background edits.

The final eight-second videos are encoded at 1600×900, 24fps with frequent keyframes for seeking. Silver is approximately 2.2 MiB; gold is 1.9 MiB. Only the selected finish loads when the scene approaches the viewport. Scroll and chapter buttons seek the paused video; there is no autoplay loop. Progress persists across loading and finish changes. A WebP poster covers loading/error states. Reduced motion renders only the poster, without fetching video. Event listeners, observers and animation frames clean up on unmount.

## Consistent product geometry and motion

The technical renderer preserves the accepted 1.58×2.37 front outline and uses a 0.72 relative depth. Independent longitudinal and transverse curvature maintains a broad face and full rounded shoulders. Surface depth follows `z=0.36*sqrt((1-|y/B|^4.5)*(1-|x/widthAtY|^4))`, so the photographic outline does not collapse into a tapering lens. Both halves share the same rim normals and join without a casing gap. The original rotation, X-ray, opening and reassembly timing are retained.

The small upper aperture follows the new dome with an eight-ring tessellated surface, preventing a flat disc from clipping into the curved body. Technical contours are derived from the same volume. The front outline is retained from the accepted photographic reconstruction; depth is art direction from those references, not a manufacturing measurement.

Both finish variants use the same mesh with an anisotropic physical metal material, deterministic 1024px longitudinal grain, mipmapped bump/roughness texture and broad neutral studio reflections. Existing scroll rotation, X-ray timing, front/rear opening, reassembly, color state, on-demand rendering and resource cleanup remain. Closed shell normals meet at the rim. Scroll anchoring is disabled within the landing page to prevent keyed text changes from moving the viewport away from a selected chapter.

The purchase area uses compact silver/gold swatch controls for choosing the order finish. A separate five-photo gallery supports thumbnails, previous/next navigation, horizontal swipe and native-dialog enlargement. The initial photograph shows both finishes together. Changing the selected finish preserves that paired view; when viewing a finish-specific image, choosing a different finish opens its corresponding worn photograph. The selection also updates checkout metadata. Browsing other gallery images does not change the chosen order finish.

The FAQ displays the existing silver and gold photographic cutouts together at identical scale, staggered diagonally. Both remain visible on mobile. The stone photographs were retouched through Higgsfield GPT Image 2 to remove the perimeter assembly line while retaining the scene and pendant silhouette. Accepted edits: silver `7f12063b-d0b4-41c4-a867-5c658d616be8`; gold `3390ef25-02b8-4e23-8d66-3a2d530bd2e0`.

Static headings, descriptive copy and primary actions enter once with an 800ms opacity/14px rise, using a restrained 70ms stagger capped at 210ms. Dynamic product-chapter copy and opened FAQ answers use the same curve. Reduced-motion preferences and the page toggle keep text visible without animation; the server-rendered/no-JS content remains visible. The protected lifestyle composition keeps its existing treatment.

## Purchase gallery and offer

The buying section places the photographic gallery beside a literal product title, concise purpose, clearly labeled $149.99 USD price, projected launch comparison, first-year inclusion, compact finish controls and a full-width Buy Now button. Shipping, charge timing, refund terms and optional AI cost remain visible by the purchase action. Detailed service and purchase terms expand below. The underlying purchase route and future shipping terms are unchanged; the CTA does not imply immediate shipment. Mobile uses the same five visible thumbnails, with the purchase information immediately after the gallery. The replaced context heading is “The meaning behind your words.”

This structure draws from [Pocket's purchase block](https://heypocket.com/pages/pocket), [Baymard's visible-thumbnail guidance](https://baymard.com/blog/truncating-product-gallery-thumbnails), [product scale research](https://baymard.com/blog/current-state-ecommerce-product-page-ux) and [shipping information placement](https://baymard.com/blog/avoid-banners-only-free-shipping). These informed implementation choices; no Anticipy conversion improvement has yet been measured. No unverified reviews, bundles, payment badges, warranty or countdown were added.

Five new reference-guided Higgsfield photographs were generated at 2048×2048, visually checked and encoded as 1600×1600 WebP at quality 88. The gallery totals approximately 831 KiB. All retain a compact brushed capsule, one upper aperture, fine shoulder chain and continuously closed casing. They are generated visualizations, not photos of manufactured units.

| Local asset under public/redesign | Composition | Higgsfield generation ID |
| --- | --- | --- |
| purchase-silver-worn.webp | Silver worn outdoors with a white T-shirt | 831dadb2-0d30-4b3b-9386-1d482b7b1636 |
| purchase-gold-worn.webp | Gold worn with a black top in window light | ad25e714-6b3c-4781-b716-d7c807cfce17 |
| purchase-both-finishes.webp | Silver and gold together on pale surfaces | dbe0d56f-8aea-47b3-8a9a-1b478bd18542 |
| purchase-silver-hand.webp | Silver resting in cupped adult hands | 7c0f7223-54b6-42a1-b743-9ce603a33df8 |
| purchase-gold-detail.webp | Gold at an oblique angle on an architectural ledge | 904ddfae-88ef-4ba8-a5b8-a2c76b600da4 |

The product-photoshoot workflow requested Nano Banana Pro at 2k; terminal job metadata reports `nano_banana_2`. Original silver, gold, lifestyle scale and seamless stone generation references were supplied. Format-only optimization preserves the full square composition. The existing lifestyle asset and interactive geometry are unchanged by this purchase revision.

## Content, purchase and publication boundaries

Pocket informed explicit positioning, grouped privacy information, categorized FAQs and adjacent purchase terms; Mira and Sensiq informed product scale and technical storytelling. Original Anticipy copy and assets are used. No first-to-market claim, fabricated review, customer count, scarcity timer or corporate logo endorsement is displayed. The founder-confirmed prototype-user statement describes individual use by YC-backed founders and people who have worked at Mentra and Open Door Law, with a readable non-endorsement clarification.

The offer remains $149.99 USD charged today, projected $199 launch price, estimated Q4 2026 shipping, chain/charging pad/first year of AI service, free US/Canada delivery and full refunds before shipment. Projected optional later AI service is $99/year with no automatic enrollment. Existing silver/gold checkout metadata and confirmation handling remain intact. No real purchase, waitlist or email action was performed.

- `npm run build:design` builds the static private review, including `/` and `/action-taker/`, from the same React components as Next.js.
- The existing owner-private Site hosts that review; anticipy.ai and the backend are not deployed here.
- Static review checkout, waitlist and policy links retain the existing production destinations. Finish selection will be honored there when this PR is deployed to that application.
- Full Next.js prerendering requires the existing Supabase configuration at `/admin/offers`; no placeholder credentials were added.

## Verification

TypeScript, static build and whitespace checks pass. Browser inspection covers the new editorial section at 1440px and 390px, white surface/black heading computed colors, and no horizontal overflow at those sizes. The new photographic scene loads correctly; native scroll and chapter controls seek forward and backward. The final lifestyle asset hash matches the prior commit exactly. The previous mocked finish-to-fulfillment contract tests remain unchanged; no backend changes were made in revision 9.

Revision 9 verification: TypeScript, the static build and whitespace checks pass. A numerical audit checks 25,440 housing triangles and 720 aperture triangles: no degenerate triangles, reversed winding, non-finite coordinates or reversed normals. All 1,161 aperture samples clear the actual shell mesh by 0.000979–0.001022 units. Browser inspection covers the domed front, near-side angle (progress 0.889), both finishes, open shells and reassembly. The finish swatches and accepted photographic assets are unchanged. Browser error logs are empty. The protected lifestyle image retains Git blob `c887ad44d06fc22965933696fdb2cdf41d76e840`.

Purchase revision verification: TypeScript, static build and whitespace checks pass. Browser inspection at 1275px and 390px found no horizontal overflow. All five images load. Thumbnail navigation, wraparound, swipe, Enter after swiping, dialog arrow keys, Escape, focus restoration, finish-to-gallery synchronization and checkout metadata were exercised. Purchase disclosures expand, browser error logs are empty, and both static routes and their JavaScript contain no em dashes or rejected Friday/Alex copy. The protected lifestyle hash remains unchanged.

Current hero verification: TypeScript, static build and whitespace checks pass. Desktop at 1440×900 and mobile at 390×844 show the new composition without horizontal overflow. Eighteen successive local screenshots cover its staged opening and full film loop. Film pause/resume, offscreen pause, reduced motion and Buy Now navigation were exercised. No price or offer details appear in the hero. The purchase gallery still opens with the paired image. An independent code review identified a failed-media control issue, which was fixed by retaining the poster and hiding the unavailable film control.
