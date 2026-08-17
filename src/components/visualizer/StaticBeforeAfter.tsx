"use client";

import { useCallback, useRef, useState } from "react";

interface StaticBeforeAfterProps {
  beforeSrc: string;
  afterSrc: string;
  beforeAlt: string;
  afterAlt: string;
  aspectRatio: string;
}

/**
 * Same divider-drag interaction as BeforeAfterSlider, but for a curated pair of real photos
 * (an actual "before" and an actual, already-composited "after") instead of one photo plus a
 * live illustrated overlay. No handle placement/drag needed here — the handle is already baked
 * into the after photo.
 */
export default function StaticBeforeAfter({ beforeSrc, afterSrc, beforeAlt, afterAlt, aspectRatio }: StaticBeforeAfterProps) {
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
    <div
      ref={containerRef}
      className="rv-compare"
      style={{ aspectRatio }}
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
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={afterSrc} alt={afterAlt} />
      <span className="rv-compare-label after">Efter</span>

      <div className="after-clip" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={beforeSrc} alt={beforeAlt} />
        <span className="rv-compare-label before">Før</span>
      </div>

      <div className="rv-compare-handle" style={{ left: `${pos}%` }} />
    </div>
  );
}
