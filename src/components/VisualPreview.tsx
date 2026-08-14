"use client";

import { useState } from "react";
import { Eye, EyeOff, Sparkles } from "lucide-react";
import type { AnalysisResult } from "@/types/analysis";

interface VisualPreviewProps {
  result: AnalysisResult;
  previewUrl: string | null;
}

export default function VisualPreview({ result, previewUrl }: VisualPreviewProps) {
  const [showAfter, setShowAfter] = useState(true);
  const topDoor = result.detectedDoors[0];
  const primaryHandle = result.doorLineItems[0]?.product;

  return (
    <div className="overflow-hidden rounded-2xl border border-randi-line bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-randi-line px-5 py-3">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-randi-copper" />
          <h3 className="text-sm font-semibold text-randi-ink">Visuelt preview</h3>
        </div>
        <div className="flex rounded-lg bg-stone-100 p-1 text-xs font-medium">
          <button
            type="button"
            onClick={() => setShowAfter(false)}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 transition-colors ${
              !showAfter ? "bg-white text-randi-ink shadow-sm" : "text-stone-500"
            }`}
          >
            <EyeOff size={13} /> Før
          </button>
          <button
            type="button"
            onClick={() => setShowAfter(true)}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 transition-colors ${
              showAfter ? "bg-white text-randi-ink shadow-sm" : "text-stone-500"
            }`}
          >
            <Eye size={13} /> Efter (AI-visualisering)
          </button>
        </div>
      </div>

      <div className="relative aspect-[4/3] w-full bg-stone-100">
        {previewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={previewUrl} alt="Uploadet dørbillede" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-stone-400">
            Intet billede tilgængeligt
          </div>
        )}

        {showAfter && topDoor && (
          <>
            <div className="absolute inset-6 rounded-xl border-2 border-dashed border-randi-copper/70">
              <span className="absolute -top-3 left-3 rounded-full bg-randi-ink px-2.5 py-1 text-[11px] font-medium text-white shadow">
                {topDoor.doorType} · {Math.round(topDoor.confidence * 100)}% sikkerhed
              </span>
            </div>

            {primaryHandle && (
              <div className="absolute bottom-4 right-4 flex max-w-[190px] items-center gap-3 rounded-xl bg-white/95 p-2.5 shadow-lg ring-1 ring-randi-line backdrop-blur">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={primaryHandle.imagePath}
                  alt={primaryHandle.name}
                  className="h-12 w-12 shrink-0 rounded-lg bg-randi-cream object-cover"
                />
                <div className="min-w-0">
                  <p className="truncate text-[11px] font-semibold text-randi-ink">
                    {primaryHandle.series}
                  </p>
                  <p className="truncate text-[11px] text-stone-500">{primaryHandle.finish}</p>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <p className="px-5 py-3 text-xs text-stone-500">
        Simuleret AI-visualisering til demoformål — viser genkendt dørparti og det anbefalte
        Randi-dørgreb, der ville blive monteret.
      </p>
    </div>
  );
}
