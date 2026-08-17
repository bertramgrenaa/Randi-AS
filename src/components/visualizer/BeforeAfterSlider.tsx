"use client";

import { useCallback, useRef, useState } from "react";
import type { RandiProduct } from "@/data/randi-real-products";
import type { HandlePlacement } from "@/lib/ai/visualizeDoor";
import HandleIllustration from "./HandleIllustration";

interface BeforeAfterSliderProps {
  photoUrl: string;
  product: RandiProduct;
  placement: HandlePlacement;
  onPlacementChange: (placement: HandlePlacement) => void;
}

/**
 * Handle placement is draggable directly on the photo, so the user can put it exactly where
 * their real door handle would sit — there is no real vision model behind this demo, so a
 * fixed default position would very often land on the wall instead of the door. The
 * before/after divider drag (slider) and the handle-overlay drag are independent pointer
 * listeners on the same container; each stops propagation into the other so they don't fight.
 */
export default function BeforeAfterSlider({ photoUrl, product, placement, onPlacementChange }: BeforeAfterSliderProps) {
  const [pos, setPos] = useState(50);
  const [hasDraggedHandle, setHasDraggedHandle] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const draggingSlider = useRef(false);
  const draggingHandle = useRef(false);

  const updateSliderFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.min(96, Math.max(4, pct)));
  }, []);

  const updateHandleFromClient = useCallback(
    (clientX: number, clientY: number) => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const xPct = Math.min(0.96, Math.max(0.04, (clientX - rect.left) / rect.width));
      const yPct = Math.min(0.96, Math.max(0.04, (clientY - rect.top) / rect.height));
      onPlacementChange({ ...placement, xPct, yPct });
    },
    [onPlacementChange, placement]
  );

  return (
    <div className="rv-compare-wrap">
      <div
        ref={containerRef}
        className="rv-compare"
        onPointerDown={(e) => {
          if (overlayRef.current && (e.target === overlayRef.current || overlayRef.current.contains(e.target as Node))) {
            return;
          }
          draggingSlider.current = true;
          (e.target as Element).setPointerCapture?.(e.pointerId);
          updateSliderFromClientX(e.clientX);
        }}
        onPointerMove={(e) => {
          if (draggingSlider.current) updateSliderFromClientX(e.clientX);
        }}
        onPointerUp={() => {
          draggingSlider.current = false;
        }}
      >
        {/* AFTER — full-width base layer: photo + illustrated handle overlay */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photoUrl} alt="Din dør med det valgte Randi-greb" />
        <span className="rv-compare-label after">Efter</span>

        <div
          ref={overlayRef}
          className={`rv-handle-overlay ${hasDraggedHandle ? "" : "hint"}`}
          style={{
            left: `${placement.xPct * 100}%`,
            top: `${placement.yPct * 100}%`,
            width: `${placement.scalePct * 100}%`,
          }}
          onPointerDown={(e) => {
            e.stopPropagation();
            draggingHandle.current = true;
            (e.target as Element).setPointerCapture?.(e.pointerId);
            setHasDraggedHandle(true);
          }}
          onPointerMove={(e) => {
            if (!draggingHandle.current) return;
            e.stopPropagation();
            updateHandleFromClient(e.clientX, e.clientY);
          }}
          onPointerUp={(e) => {
            e.stopPropagation();
            draggingHandle.current = false;
          }}
        >
          <HandleIllustration
            silhouette={product.silhouette}
            finishFamily={product.finishFamily}
            hasBirchInsert={product.silhouette === "nordic-straight"}
          />
        </div>

        {!hasDraggedHandle && (
          <div className="rv-drag-tip">
            <MoveIcon /> Træk grebet hen på din dør
          </div>
        )}

        {/* BEFORE — clipped to the left of the divider, plain photo */}
        <div className="after-clip" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photoUrl} alt="Din dør, original" />
          <span className="rv-compare-label before">Før</span>
        </div>

        <div className="rv-compare-handle" style={{ left: `${pos}%` }} />
      </div>

      <div className="rv-size-row">
        <label htmlFor="rv-size-range">Størrelse</label>
        <input
          id="rv-size-range"
          type="range"
          min={8}
          max={26}
          value={Math.round(placement.scalePct * 100)}
          onChange={(e) => onPlacementChange({ ...placement, scalePct: Number(e.target.value) / 100 })}
        />
      </div>
    </div>
  );
}

function MoveIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ verticalAlign: -2, marginRight: 4 }}>
      <path d="M5 9l-3 3 3 3" />
      <path d="M9 5l3-3 3 3" />
      <path d="M15 19l-3 3-3-3" />
      <path d="M19 9l3 3-3 3" />
      <path d="M2 12h20" />
      <path d="M12 2v20" />
    </svg>
  );
}
