# Hero material fidelity

The hero retains revision 15's outer housing geometry, 1.58 × 2.37 × 0.72 relative dimensions, camera, screen scale, placement, finish state and full scroll choreography. No existing product photo or video was modified. The left typography, compact swatches, price-free hero and Buy Now links remain unchanged.

## Surface changes

- One reference-conditioned GPT Image 2 texture replaces the hero's coarse procedural grain. Higgsfield job `2aec842d-de7d-416c-b511-90e67a7b0860` returned a 2880 × 2880 image. It is encoded as a 2048 × 2048 WebP (1,298,006 bytes) at `public/redesign/hero-titanium-grain.webp`.
- The image is scalar material data, not a replacement product photograph. It drives subtle height, roughness and reflectance variation without transferring its color to the silver or gold finish. Mirrored wrapping avoids a visible image-edge seam. Wrapped surface coordinates keep the side brushing from compressing into ridges.
- A feathered studio lighting rig replaces the hero's hard rectangular reflections. Half-float textures preserve light intensity without depending on optional 32-bit float linear filtering.
- The existing upper aperture is cut out in the front material at the exact same radius and position. A flush bevel, shadowed inner bore and dark recessed floor supply depth and parallax. The rear stays closed. No shell perimeter seam, raised ring or new external hardware is added.
- Material loading retains the existing valid maps until the new texture succeeds; a failed load keeps the fallback. All four shell materials update together. Rendering continues to sleep at rest, and texture, cavity and lighting resources dispose with the scene.
- Static preview JS/CSS references include content hashes to prevent stale cached renderers during updates.

This remains an interactive artistic reconstruction with a photographic surface. It is not a measured scan or footage of a manufactured unit.

## Validation

TypeScript, static build and whitespace checks pass. A source comparison confirms the complete outer geometry generation, pendant specification, hero pose formulas and MotionHero controller are unchanged. All pre-existing product images and videos match the preceding commit byte for byte, including the protected lifestyle image. An independent renderer review checked shader-hook chaining, separate twin front/rear materials, half-float compatibility, texture fallback and resource cleanup.

Browser checks cover silver and gold, front and side views, the paired reveal, compact layout, motion off, Buy Now navigation and finish propagation. The hero contains no video, price, shipping offer or em dash. Purchase still opens with both finishes together. No checkout transaction was submitted.
