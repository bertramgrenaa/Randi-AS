"use client";

import { useCallback, useRef, useState } from "react";

interface BeforeAfterSliderProps {
  beforeUrl: string;
  afterUrl: string;
  beforeAlt?: string;
  afterAlt?: string;
  aspectRatio?: string;
}

/**
 * Before/after divider drag between the user's uploaded door photo (before) and the real
 * composited product photo for the classified door type (after) — see
 * `classifyDoorPhoto.ts` for how the door type is picked. There is no draggable handle overlay
 * here: unlike an earlier version of this demo, the "after" image is a real photo, not an
 * illustration placed at a guessed position, so there's nothing left to drag except the divider.
 */
export default function BeforeAfterSlider({
  beforeUrl,
  afterUrl,
  beforeAlt = "Din dør, original",
  afterAlt = "Din dør med det valgte Randi-greb",
  aspectRatio,
}: BeforeAfterSliderProps) {
  const [pos, setPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const updateFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.min(96, Math.max(4, pct)));
  }, []);

  return (
    <div className="rv-compare-wrap">
      <div
        ref={containerRef}
        className="rv-compare"
        style={aspectRatio ? { aspectRatio } : undefined}
        onPointerDown={(e) => {
          dragging.current = true;
          (e.target as Element).setPointerCapture?.(e.pointerId);
          updateFromClientX(e.clientX);
        }}
        onPointerMove={(e) => {
          if (dragging.current) updateFromClientX(e.clientX);
        }}
        onPointerUp={() => {
          dragging.current = false;
        }}
      >
        {/* AFTER — full-width base layer, real composited photo */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={afterUrl} alt={afterAlt} />
        <span className="rv-compare-label after">Efter</span>

        {/* BEFORE — clipped to the left of the divider, the user's own photo */}
        <div className="after-clip" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={beforeUrl} alt={beforeAlt} />
          <span className="rv-compare-label before">Før</span>
        </div>

        <div className="rv-compare-handle" style={{ left: `${pos}%` }} />
      </div>
    </div>
  );
}
