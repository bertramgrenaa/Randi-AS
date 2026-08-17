import { useId } from "react";
import type { FinishFamily, HandleSilhouette } from "@/data/randi-real-products";

/**
 * Original line-art illustrations of each real handle's silhouette, tinted by its real finish.
 * We don't have a verified licence to embed randi.dk's product photography in this prototype,
 * so every product is rendered here instead — geometry keyed to the source descriptions
 * (Nordic's straight birch-bark insert, Wing's tapered aircraft-wing curve, Komé's faceted
 * angled profile, 1060's heavier 16 mm solid rod, 1021's slender hollow tube).
 *
 * Uses React's `useId()` (not a hand-rolled counter) so gradient ids stay stable between the
 * server-rendered HTML and the client hydration pass — a module-level counter increments
 * differently on each render pass and causes hydration mismatches.
 */

const FINISH_GRADIENTS: Record<FinishFamily, [string, string]> = {
  steel: ["#e2ded2", "#a39c8c"],
  "black-pvd": ["#4a453c", "#211e19"],
  "brass-pvd": ["#d3ab68", "#96723a"],
  "copper-pvd": ["#c17e4e", "#8a4f28"],
  "polished-brass": ["#ecd08a", "#b5893f"],
};

const BIRCH_BARK: [string, string] = ["#d8c7a1", "#a98a5c"];

interface HandleIllustrationProps {
  silhouette: HandleSilhouette;
  finishFamily: FinishFamily;
  hasBirchInsert?: boolean;
  className?: string;
}

export default function HandleIllustration({
  silhouette,
  finishFamily,
  hasBirchInsert,
  className,
}: HandleIllustrationProps) {
  const id = useId();
  const gradId = `${id}-metal`;
  const barkId = `${id}-bark`;
  const [c1, c2] = FINISH_GRADIENTS[finishFamily];
  const [b1, b2] = BIRCH_BARK;

  return (
    <svg viewBox="0 0 100 100" className={className} role="img" aria-hidden="true">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={c1} />
          <stop offset="100%" stopColor={c2} />
        </linearGradient>
        <linearGradient id={barkId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={b1} />
          <stop offset="100%" stopColor={b2} />
        </linearGradient>
      </defs>
      {renderSilhouette(silhouette, gradId, hasBirchInsert ? barkId : undefined)}
    </svg>
  );
}

function renderSilhouette(silhouette: HandleSilhouette, gradId: string, barkId?: string) {
  switch (silhouette) {
    case "nordic-straight":
      return (
        <>
          <rect x="44" y="12" width="8" height="48" rx="4" fill={`url(#${gradId})`} />
          <rect x="44" y="12" width="34" height="8" rx="4" fill={`url(#${gradId})`} />
          {barkId && <rect x="44" y="30" width="8" height="16" rx="3" fill={`url(#${barkId})`} />}
          <circle cx="48" cy="70" r="2.5" fill="currentColor" opacity="0.25" />
        </>
      );
    case "wing":
      return (
        <path
          d="M46 12 C40 12 38 18 38 24 C38 34 46 36 56 40 C68 45 78 48 82 54 C85 58 84 62 80 63 C74 65 66 60 58 54"
          fill="none"
          stroke={`url(#${gradId})`}
          strokeWidth="8"
          strokeLinecap="round"
        />
      );
    case "kome":
      return (
        <path
          d="M46 12 L54 12 L54 34 L80 46 L84 56 L78 62 L52 50 L46 50 Z"
          fill={`url(#${gradId})`}
          stroke="none"
        />
      );
    case "solid-16mm":
      return (
        <>
          <rect x="42" y="10" width="12" height="50" rx="5" fill={`url(#${gradId})`} />
          <rect x="42" y="10" width="38" height="12" rx="5" fill={`url(#${gradId})`} />
        </>
      );
    case "classic-hollow":
      return (
        <>
          <rect
            x="45"
            y="12"
            width="6"
            height="46"
            rx="3"
            fill="none"
            stroke={`url(#${gradId})`}
            strokeWidth="2.4"
          />
          <rect
            x="45"
            y="12"
            width="30"
            height="6"
            rx="3"
            fill="none"
            stroke={`url(#${gradId})`}
            strokeWidth="2.4"
          />
        </>
      );
    default:
      return null;
  }
}
