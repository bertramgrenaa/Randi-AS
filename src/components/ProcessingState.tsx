"use client";

import { useEffect, useState } from "react";
import { Check, DoorOpen, FileSearch, Leaf, Layers, ScanLine } from "lucide-react";

const STEPS = [
  { label: "Indlæser og forbereder billede", icon: ScanLine },
  { label: "Genkender dørtype, farve og materiale", icon: DoorOpen },
  { label: "Matcher mod Randi produktkatalog", icon: Layers },
  { label: "Finder cross-sell: paskvilgreb, sanitet & tilbehør", icon: FileSearch },
  { label: "Beregner pris og EPD / CO2e-aftryk", icon: Leaf },
] as const;

const STEP_DURATION_MS = 850;

interface ProcessingStateProps {
  previewUrl?: string | null;
  fileName?: string;
}

export default function ProcessingState({ previewUrl, fileName }: ProcessingStateProps) {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (activeStep >= STEPS.length - 1) return;
    const timer = setTimeout(() => setActiveStep((s) => s + 1), STEP_DURATION_MS);
    return () => clearTimeout(timer);
  }, [activeStep]);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-8 py-6">
      <div className="relative h-64 w-full max-w-sm overflow-hidden rounded-2xl border border-randi-line bg-stone-100 shadow-sm">
        {previewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={previewUrl} alt={fileName ?? "Uploadet billede"} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-stone-400">
            <DoorOpen size={48} />
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-randi-accent/0 via-randi-accent/10 to-randi-accent/0">
          <div className="animate-randi-scan h-1/3 w-full bg-gradient-to-b from-transparent via-randi-accent/40 to-transparent" />
        </div>
        <div className="absolute inset-0 ring-1 ring-inset ring-randi-accent/20" />
      </div>

      <div className="w-full max-w-sm space-y-3">
        {STEPS.map((step, index) => {
          const Icon = step.icon;
          const isDone = index < activeStep;
          const isActive = index === activeStep;
          return (
            <div
              key={step.label}
              className={`flex items-center gap-3 rounded-xl border px-4 py-3 transition-colors ${
                isActive
                  ? "border-randi-accent/40 bg-randi-accent/5"
                  : isDone
                    ? "border-randi-line bg-white"
                    : "border-randi-line/60 bg-white/50"
              }`}
            >
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                  isDone
                    ? "bg-randi-ink text-white"
                    : isActive
                      ? "bg-randi-accent text-white"
                      : "bg-stone-100 text-stone-400"
                }`}
              >
                {isDone ? <Check size={16} /> : <Icon size={16} className={isActive ? "animate-pulse" : ""} />}
              </div>
              <span
                className={`text-sm ${
                  isActive ? "font-medium text-randi-ink" : isDone ? "text-stone-500" : "text-stone-400"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
