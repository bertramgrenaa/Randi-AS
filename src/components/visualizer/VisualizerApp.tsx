"use client";

import { useState } from "react";
import Link from "next/link";
import type { RandiProduct } from "@/data/randi-real-products";
import type { VisualizeDoorResult } from "@/lib/ai/visualizeDoor";
import { EMPTY_LEAD, type LeadInfo, type Stage, type UploadedPhoto } from "@/types/visualizer";
import CatalogueStage from "./CatalogueStage";
import DetailStage from "./DetailStage";
import LeadStage from "./LeadStage";
import UploadStage from "./UploadStage";
import ProcessingStage from "./ProcessingStage";
import ResultStage from "./ResultStage";

const STEP_LABELS: { stage: Stage[]; label: string }[] = [
  { stage: ["catalogue"], label: "Greb" },
  { stage: ["detail"], label: "Produkt" },
  { stage: ["lead"], label: "Projekt" },
  { stage: ["upload", "processing"], label: "Din dør" },
  { stage: ["result"], label: "Resultat" },
];

export default function VisualizerApp() {
  const [stage, setStage] = useState<Stage>("catalogue");
  const [product, setProduct] = useState<RandiProduct | null>(null);
  const [lead, setLead] = useState<LeadInfo>(EMPTY_LEAD);
  const [photo, setPhoto] = useState<UploadedPhoto | null>(null);
  const [visualization, setVisualization] = useState<VisualizeDoorResult | null>(null);

  function handleSelectProduct(p: RandiProduct) {
    setProduct(p);
    setStage("detail");
  }

  function handleVisualize() {
    setStage("lead");
  }

  function handleLeadContinue(l: LeadInfo) {
    setLead(l);
    setStage("upload");
  }

  function handlePhotoContinue(p: UploadedPhoto) {
    setPhoto(p);
    setStage("processing");
  }

  function handleProcessingDone(result: VisualizeDoorResult) {
    setVisualization(result);
    setStage("result");
  }

  /** Recommendation cards can switch the primary product without losing the uploaded photo. */
  function handleSelectDifferentProduct(p: RandiProduct) {
    setProduct(p);
    setStage("processing");
  }

  function handleRestart() {
    setProduct(null);
    setPhoto(null);
    setVisualization(null);
    setStage("catalogue");
  }

  const activeGroup = STEP_LABELS.find((s) => s.stage.includes(stage));

  return (
    <div className="rv" data-visualizer-stage={stage}>
      <div className="rv-shell">
        <div className="rv-railbar">
          <div className="rv-railbar-inner">
            <span className="rv-wordmark">
              Randi <span className="tag">AI Visual Configurator</span>
            </span>
            <div className="rv-steps">
              {STEP_LABELS.map((s, i) => (
                <span key={s.label} style={{ display: "flex", alignItems: "center" }}>
                  {i > 0 && <span className="rv-step-dot" />}
                  <span className={`rv-step-label ${activeGroup === s ? "on" : ""}`}>{s.label}</span>
                </span>
              ))}
            </div>
            <Link href="/" className="rv-exit">
              Afslut
            </Link>
          </div>
        </div>

        {stage === "catalogue" && <CatalogueStage onSelect={handleSelectProduct} />}

        {stage === "detail" && product && (
          <DetailStage
            product={product}
            onVisualize={handleVisualize}
            onBack={() => setStage("catalogue")}
            onSwitchProduct={setProduct}
          />
        )}

        {stage === "lead" && product && (
          <LeadStage product={product} lead={lead} onContinue={handleLeadContinue} onBack={() => setStage("detail")} />
        )}

        {stage === "upload" && product && (
          <UploadStage product={product} onContinue={handlePhotoContinue} onBack={() => setStage("lead")} />
        )}

        {stage === "processing" && product && photo && (
          <ProcessingStage photo={photo} product={product} onDone={handleProcessingDone} />
        )}

        {stage === "result" && product && photo && visualization && (
          <ResultStage
            product={product}
            lead={lead}
            photo={photo}
            visualization={visualization}
            onSelectDifferentProduct={handleSelectDifferentProduct}
            onRestart={handleRestart}
          />
        )}
      </div>
    </div>
  );
}
