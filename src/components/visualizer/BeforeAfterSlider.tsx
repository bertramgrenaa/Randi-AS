"use client";

import { useCallback, useRef, useState } from "react";
import type { RandiProduct } from "@/data/randi-real-products";
import type { HandlePlacement } from "@/lib/ai/visualizeDoor";
import HandleIllustration from "./HandleIllustration";

interface BeforeAfterSliderProps {
  photoUrl: string;
  product: RandiProduct;
  placement: HandlePlacement;
}

export default function BeforeAfterSlider({ photoUrl, product, placement }: BeforeAfterSliderProps) {
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
      {/* AFTER — full-width base layer: photo + illustrated handle overlay */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={photoUrl} alt="Din dør med det valgte Randi-greb" />
      <div
        className="rv-handle-overlay"
        style={{
          left: `${placement.xPct * 100}%`,
          top: `${placement.yPct * 100}%`,
          width: `${placement.scalePct * 100}%`,
          transform: `translate(-50%, -50%) rotate(${placement.rotationDeg}deg)`,
        }}
      >
        <HandleIllustration
          silhouette={product.silhouette}
          finishFamily={product.finishFamily}
          hasBirchInsert={product.silhouette === "nordic-straight"}
        />
      </div>
      <span className="rv-compare-label after">Efter</span>

      {/* BEFORE — clipped to the left of the divider, plain photo */}
      <div className="after-clip" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photoUrl} alt="Din dør, original" />
        <span className="rv-compare-label before">Før</span>
      </div>

      <div className="rv-compare-handle" style={{ left: `${pos}%` }} />
    </div>
  );
}
