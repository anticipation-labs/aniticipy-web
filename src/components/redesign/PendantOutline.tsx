import { PENDANT } from "./pendant-design";

// The same Bezier perimeter as capsuleShape(), available before Three.js loads.
const top = PENDANT.width * 0.485;
const bottom = PENDANT.width * 0.5;
const shoulder = PENDANT.height * 0.2;
const crown = PENDANT.height / 2;
const curve = PENDANT.height * 0.3 * 0.5522848;
const k = 0.5522848;
const outline = `M 0 ${crown} C ${top * k} ${crown} ${top} ${shoulder + curve} ${top} ${shoulder} L ${bottom} ${-shoulder} C ${bottom} ${-shoulder - curve} ${bottom * k} ${-crown} 0 ${-crown} C ${-bottom * k} ${-crown} ${-bottom} ${-shoulder - curve} ${-bottom} ${-shoulder} L ${-top} ${shoulder} C ${-top} ${shoulder + curve} ${-top * k} ${crown} 0 ${crown} Z`;

/** A server-rendered contour, never an unrelated product photograph. */
export function PendantOutline({ className }: { className: string }) {
  return (
    <svg
      className={className}
      viewBox={`${-PENDANT.width / 2 - 0.04} ${-crown - 0.04} ${PENDANT.width + 0.08} ${PENDANT.height + 0.08}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="0.012"
      aria-hidden="true"
      focusable="false"
    >
      <g transform="scale(1 -1)">
        <path d={outline} />
        <circle cx="0" cy={PENDANT.apertureY} r={PENDANT.apertureRadius} />
      </g>
    </svg>
  );
}
