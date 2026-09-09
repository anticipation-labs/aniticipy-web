# Revision 17: consistent renderer loading

Both live 3D sections previously rendered a photographic cutout in the initial HTML. The hero hid it only after loading its renderer; the technical scene marked itself ready immediately after construction, before its first frame. Slow or uncached loads exposed those photographs and their crossfades.

Both wrappers now render a small inline SVG contour from the same housing perimeter before JavaScript or WebGL arrives. They contain no photographic placeholder. The hero reveals its canvas only after rendering at least one contour segment. The technical scene submits the current finish and chapter progress before its first scheduled draw and signals readiness after that draw. Loading outlines fade out over 160 ms. Context loss restores the outline; controls and purchase content remain available when WebGL cannot start. Accessible product descriptions remain on the visual wrappers.

No housing geometry, materials, camera, scale, scroll timing, photographs, videos, copy or purchase behavior changed. The inline outline is a temporary loading presentation. It does not replace or resize the approved 3D model.

## Verification

- Static build for both routes, TypeScript and whitespace checks.
- Desktop browser reloads with an eight-second renderer-chunk delay and caching disabled: both wrappers contain zero image elements while pending and once ready.
- Initial hero and technical loading screenshots show the outline; completed screenshots show the existing 3D scene.
- Independent loading-lifecycle audit covers delayed imports, stored finish/progress, effect cleanup, reduced motion and context loss.
- Existing media and the protected lifestyle image remain unchanged.

The eight-second delay exists only in an external local QA server, never in the application or published build.
