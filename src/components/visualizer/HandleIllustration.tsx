import { useId } from "react";
import type { FinishFamily, HandleSilhouette } from "@/data/randi-real-products";

/**
 * Realistic rosette + lever illustration of each real handle, tinted by its real finish.
 * We don't have a verified licence to embed randi.dk's product photography in this prototype,
 * so every product is rendered here instead — a shaded rosette/backplate plus a curved,
 * cylindrically-shaded lever (geometry keyed to the source descriptions: Nordic's straight
 * birch-bark insert, Wing's tapered aircraft-wing curve, Komé's faceted angled profile, 1060's
 * heavier 16 mm solid rod, 1021's slender hollow tube), so it actually reads as door hardware
 * rather than an abstract line icon.
 *
 * Uses React's `useId()` (not a hand-rolled counter) so gradient ids stay stable between the
 * server-rendered HTML and the client hydration pass — a module-level counter increments
 * differently on each render pass and causes hydration mismatches.
 */

const FINISH_GRADIENTS: Record<FinishFamily, [string, string]> = {
  steel: ["#d7dade", "#8b9096"],
  "black-pvd": ["#4a4b4f", "#1c1d20"],
  "brass-pvd": ["#d3ab68", "#8f6a34"],
  "copper-pvd": ["#c17e4e", "#7c4522"],
  "polished-brass": ["#f0d28c", "#b3862f"],
};

const BIRCH_BARK: [string, string] = ["#e2cea3", "#a9825a"];

const LEVER_PATHS: Record<HandleSilhouette, string> = {
  "nordic-straight": "M54,98 C 95,93 138,89 176,87",
  wing: "M54,98 C 92,80 124,66 170,49",
  kome: "M54,98 L120,98 L174,68",
  "solid-16mm": "M54,98 C 95,93 138,89 176,87",
  "classic-hollow": "M54,98 C 95,93 138,89 176,87",
};

const LEVER_WIDTH: Record<HandleSilhouette, number> = {
  "nordic-straight": 16,
  wing: 15,
  kome: 16,
  "solid-16mm": 21,
  "classic-hollow": 10,
};

function shade(hex: string, amt: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + amt));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + amt));
  const b = Math.min(255, Math.max(0, (num & 0xff) + amt));
  return "#" + (0x1000000 + r * 0x10000 + g * 0x100 + b).toString(16).slice(1);
}

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
  const rosetteId = `${id}-r`;
  const leverId = `${id}-m`;
  const barkId = `${id}-b`;
  const shadowId = `${id}-s`;

  const [c0, c1] = FINISH_GRADIENTS[finishFamily];
  const light = shade(c0, 42);
  const dark = shade(c1, -20);
  const leverD = LEVER_PATHS[silhouette] ?? LEVER_PATHS["nordic-straight"];
  const leverW = LEVER_WIDTH[silhouette] ?? 16;
  const showBirch = Boolean(hasBirchInsert);
  const [b0, b1] = BIRCH_BARK;

  return (
    <svg viewBox="0 0 200 160" className={className} role="img" aria-hidden="true">
      <defs>
        <radialGradient id={rosetteId} cx="32%" cy="26%" r="80%">
          <stop offset="0%" stopColor={light} />
          <stop offset="55%" stopColor={c0} />
          <stop offset="100%" stopColor={c1} />
        </radialGradient>
        <linearGradient id={leverId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={light} />
          <stop offset="40%" stopColor={c0} />
          <stop offset="62%" stopColor={c1} />
          <stop offset="100%" stopColor={dark} />
        </linearGradient>
        {showBirch && (
          <linearGradient id={barkId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={b0} />
            <stop offset="100%" stopColor={b1} />
          </linearGradient>
        )}
        <filter id={shadowId} x="-60%" y="-60%" width="220%" height="220%">
          <feDropShadow dx="1.5" dy="3.5" stdDeviation="2.6" floodColor="#000" floodOpacity="0.38" />
        </filter>
      </defs>
      <g filter={`url(#${shadowId})`}>
        <circle cx="54" cy="98" r="29" fill={`url(#${rosetteId})`} stroke={dark} strokeWidth="1" />
        <circle cx="54" cy="98" r="4.5" fill={dark} />
        <path d={leverD} fill="none" stroke={`url(#${leverId})`} strokeWidth={leverW} strokeLinecap="round" strokeLinejoin="round" />
        {showBirch && (
          <path
            d={leverD}
            fill="none"
            stroke={`url(#${barkId})`}
            strokeWidth={leverW}
            strokeLinecap="butt"
            strokeDasharray="30 400"
            strokeDashoffset="-16"
          />
        )}
      </g>
    </svg>
  );
}
