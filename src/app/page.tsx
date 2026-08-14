"use client";

import { useCallback, useState } from "react";
import { AlertTriangle, DoorClosed, Leaf, ScanSearch } from "lucide-react";
import UploadDropzone from "@/components/UploadDropzone";
import ProcessingState from "@/components/ProcessingState";
import ResultDashboard from "@/components/ResultDashboard";
import LeadGateModal from "@/components/LeadGateModal";
import type { AnalysisResult } from "@/types/analysis";

type Stage = "idle" | "processing" | "result" | "error";

/** Minimum time (ms) to keep the processing animation on screen, even on a fast response. */
const MIN_PROCESSING_MS = 2600;

export default function Home() {
  const [stage, setStage] = useState<Stage>("idle");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showLeadGate, setShowLeadGate] = useState(false);

  const handleSubmit = useCallback(async (file: File, notes: string) => {
    setStage("processing");
    setErrorMessage(null);
    setFileName(file.name);
    setPreviewUrl(file.type.startsWith("image/") ? URL.createObjectURL(file) : null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("notes", notes);

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
  }, []);

  function handleStartOver() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setStage("idle");
    setResult(null);
    setPreviewUrl(null);
    setFileName("");
    setErrorMessage(null);
  }

  return (
    <div className="flex min-h-screen flex-1 flex-col">
      <SiteHeader />

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
        {stage === "idle" && (
          <div className="mx-auto max-w-2xl">
            <Intro />
            <div className="mt-8 rounded-2xl border border-randi-line bg-white p-6 shadow-sm sm:p-8">
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
            {showLeadGate && (
              <LeadGateModal result={result} onClose={() => setShowLeadGate(false)} />
            )}
          </>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}

function SiteHeader() {
  return (
    <header className="border-b border-randi-line bg-white/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-randi-ink text-white">
            <DoorClosed size={18} />
          </div>
          <div>
            <p className="text-sm font-bold leading-none tracking-tight text-randi-ink">RANDI</p>
            <p className="text-[11px] leading-none text-stone-500">BuildingScan &amp; Visualizer</p>
          </div>
        </div>
        <span className="hidden rounded-full bg-randi-copper/10 px-3 py-1 text-xs font-medium text-randi-copper sm:inline-block">
          AI-konfigurator · Prototype
        </span>
      </div>
    </header>
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
          <ScanSearch size={14} className="text-randi-copper" /> Automatisk cross-sell
        </div>
      </div>
    </div>
  );
}

function SiteFooter() {
  return (
    <footer className="border-t border-randi-line bg-white">
      <div className="mx-auto w-full max-w-5xl px-4 py-6 text-center text-xs text-stone-400 sm:px-6 lg:px-8">
        Randi BuildingScan &amp; Visualizer — prototype/MVP. Produktdata, priser og
        AI-visualiseringer er simulerede til demoformål.
      </div>
    </footer>
  );
}
