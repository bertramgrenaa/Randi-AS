"use client";

import { Suspense, useCallback, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertTriangle, Leaf, ScanSearch, X } from "lucide-react";
import UploadDropzone from "@/components/UploadDropzone";
import ProcessingState from "@/components/ProcessingState";
import ResultDashboard from "@/components/ResultDashboard";
import LeadGateModal from "@/components/LeadGateModal";
import { getProductById } from "@/lib/catalog";
import type { AnalysisResult } from "@/types/analysis";

type Stage = "idle" | "processing" | "result" | "error";

/** Minimum time (ms) to keep the processing animation on screen, even on a fast response. */
const MIN_PROCESSING_MS = 2600;

export default function KonfiguratorPage() {
  return (
    <Suspense fallback={null}>
      <KonfiguratorFlow />
    </Suspense>
  );
}

function KonfiguratorFlow() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preferredProductId = searchParams.get("product");
  const preferredProduct = useMemo(
    () => (preferredProductId ? getProductById(preferredProductId) : undefined),
    [preferredProductId]
  );

  const [stage, setStage] = useState<Stage>("idle");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showLeadGate, setShowLeadGate] = useState(false);

  const handleSubmit = useCallback(
    async (file: File, notes: string) => {
      setStage("processing");
      setErrorMessage(null);
      setFileName(file.name);
      setPreviewUrl(file.type.startsWith("image/") ? URL.createObjectURL(file) : null);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("notes", notes);
      if (preferredProductId) formData.append("preferredProductId", preferredProductId);

      const startedAt = Date.now();

      try {
        const res = await fetch("/api/analyze-door", { method: "POST", body: formData });
        const data = await res.json();

        const elapsed = Date.now() - startedAt;
        const remaining = Math.max(0, MIN_PROCESSING_MS - elapsed);
        if (remaining > 0) await new Promise((resolve) => setTimeout(resolve, remaining));

        if (!res.ok) {
          setErrorMessage(data.error ?? "Analysen fejlede. Prøv igen.");
          setStage("error");
          return;
        }

        setResult(data as AnalysisResult);
        setStage("result");
      } catch {
        const elapsed = Date.now() - startedAt;
        const remaining = Math.max(0, MIN_PROCESSING_MS - elapsed);
        if (remaining > 0) await new Promise((resolve) => setTimeout(resolve, remaining));
        setErrorMessage("Kunne ikke kontakte analyse-tjenesten. Tjek din forbindelse og prøv igen.");
        setStage("error");
      }
    },
    [preferredProductId]
  );

  function handleStartOver() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setStage("idle");
    setResult(null);
    setPreviewUrl(null);
    setFileName("");
    setErrorMessage(null);
  }

  function clearPreferredProduct() {
    router.replace("/konfigurator");
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      {stage === "idle" && (
        <div className="mx-auto max-w-2xl">
          <Intro />

          {preferredProduct && (
            <div className="mt-6 flex items-start gap-3 rounded-xl border border-randi-accent/30 bg-randi-accent/5 p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preferredProduct.imagePath}
                alt={preferredProduct.name}
                className="h-12 w-12 shrink-0 rounded-lg bg-white object-contain ring-1 ring-randi-line"
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-randi-accent">Konfigurerer ud fra</p>
                <p className="truncate text-sm font-semibold text-randi-ink">
                  {preferredProduct.name}
                </p>
                <p className="text-xs text-stone-500">
                  {preferredProduct.series} · {preferredProduct.finish}
                </p>
              </div>
              <button
                type="button"
                onClick={clearPreferredProduct}
                aria-label="Fjern valgt produkt"
                className="rounded-full p-1.5 text-stone-400 hover:bg-white hover:text-stone-700"
              >
                <X size={15} />
              </button>
            </div>
          )}

          <div className="mt-6 rounded-2xl border border-randi-line bg-white p-6 shadow-sm sm:p-8">
            <UploadDropzone onSubmit={handleSubmit} />
          </div>
        </div>
      )}

      {stage === "processing" && (
        <div className="mx-auto max-w-2xl">
          <ProcessingState previewUrl={previewUrl} fileName={fileName} />
        </div>
      )}

      {stage === "error" && (
        <div className="mx-auto max-w-xl rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
          <AlertTriangle className="mx-auto text-red-500" size={28} />
          <p className="mt-3 text-sm font-medium text-red-700">{errorMessage}</p>
          <button
            type="button"
            onClick={handleStartOver}
            className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Prøv igen
          </button>
        </div>
      )}

      {stage === "result" && result && (
        <>
          <ResultDashboard
            result={result}
            previewUrl={previewUrl}
            onRequestReport={() => setShowLeadGate(true)}
            onStartOver={handleStartOver}
          />
          {showLeadGate && <LeadGateModal result={result} onClose={() => setShowLeadGate(false)} />}
        </>
      )}
    </div>
  );
}

function Intro() {
  return (
    <div className="text-center">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-randi-ink px-3 py-1 text-xs font-medium text-white">
        <ScanSearch size={13} /> AI-drevet dørgenkendelse
      </span>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-randi-ink sm:text-4xl">
        Fra dørbillede til komplet tilbud på minutter
      </h1>
      <p className="mx-auto mt-3 max-w-lg text-stone-600">
        Upload et billede eller dørskema. Randi BuildingScan genkender dørtype, farve og
        materiale, matcher automatisk Randi-dørgreb, paskvilgreb, sanitet og tilbehør — og
        beregner pris samt CO2e/EPD for hele projektet.
      </p>
      <div className="mx-auto mt-6 flex max-w-md items-center justify-center gap-6 text-xs text-stone-500">
        <div className="flex items-center gap-1.5">
          <Leaf size={14} className="text-emerald-600" /> EPD/CO2e-dokumentation
        </div>
        <div className="flex items-center gap-1.5">
          <ScanSearch size={14} className="text-randi-accent" /> Automatisk cross-sell
        </div>
      </div>
    </div>
  );
}
