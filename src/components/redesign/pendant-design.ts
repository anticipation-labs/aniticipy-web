/** One visual specification for both finishes and every interactive view.
 * Relative units reconstructed from photographs; not a manufacturing specification.
 */
export const PENDANT = {
  width: 1.58,
  height: 2.37,
  halfDepth: 0.18,
  apertureRadius: 0.067,
  apertureY: 0.6,
} as const;

export type { PendantFinish } from "../../lib/pendant-finish";
export const FINISHES = {
  silver: {
    label: "Titanium silver",
    color: 0xa7a69f,
    chain: 0xbebdb7,
    image: "/redesign/pendant-cutout-closed.webp",
    stone: "/redesign/pendant-stone-closed.webp",
  },
  gold: {
    label: "Gold",
    color: 0xc9aa72,
    chain: 0xd2b67b,
    image: "/redesign/pendant-cutout-gold.webp",
    stone: "/redesign/pendant-stone-gold.webp",
  },
} as const;
