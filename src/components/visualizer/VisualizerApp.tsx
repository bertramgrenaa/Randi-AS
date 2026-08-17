"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { RANDI_PRODUCTS, type RandiProduct } from "@/data/randi-real-products";
import type { VisualizeDoorResult } from "@/lib/ai/visualizeDoor";
import { EMPTY_LEAD, type LeadInfo, type Stage, type UploadedPhoto } from "@/types/visualizer";
import CatalogueStage from "./CatalogueStage";
import DetailStage from "./DetailStage";
import LeadStage from "./LeadStage";
import UploadStage from "./UploadStage";
import ProcessingStage from "./ProcessingStage";
import ResultStage from "./ResultStage";

const SERIES_LIST = ["Randi-Line®", "Randi-Line® Design"] as const;

export default function VisualizerApp() {
  const [stage, setStage] = useState<Stage>("catalogue");
  const [product, setProduct] = useState<RandiProduct | null>(null);
  const [lead, setLead] = useState<LeadInfo>(EMPTY_LEAD);
  const [photo, setPhoto] = useState<UploadedPhoto | null>(null);
  const [visualization, setVisualization] = useState<VisualizeDoorResult | null>(null);
  const [productsOpen, setProductsOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

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

  function handleLogoClick() {
    setProduct(null);
    setPhoto(null);
    setVisualization(null);
    setStage("catalogue");
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = searchRef.current?.value.trim().toLowerCase();
    if (!q) return;
    const match = RANDI_PRODUCTS.find(
      (p) => p.productNumber.toLowerCase().includes(q) || p.name.toLowerCase().includes(q)
    );
    if (match) {
      setProduct(match);
      setStage("detail");
    }
  }

  return (
    <div className="rv" data-visualizer-stage={stage}>
      <div className="rv-shell">
        <div className="rv-awards">
          <span aria-hidden="true">🏆</span>
          <span>AWARDS</span>
        </div>

        <header className="rv-topbar">
          <div className="rv-topbar-inner">
            <button type="button" className="rv-logo" onClick={handleLogoClick}>
              <span className="rv-logo-mark">R</span>
              <span className="rv-logo-text">
                <span className="name">Randi</span>
                <br />
                <span className="sub">Member of ECO Schulte Group</span>
              </span>
            </button>

            <nav className="rv-nav">
              <button type="button" className="navlink" onClick={handleLogoClick}>
                Forside
              </button>
              <div style={{ position: "relative" }}>
                <button
                  type="button"
                  className="navlink"
                  onClick={() => setProductsOpen((v) => !v)}
                  onBlur={() => setTimeout(() => setProductsOpen(false), 150)}
                >
                  Produkter <ChevronDown />
                </button>
                {productsOpen && (
                  <div
                    style={{
                      position: "absolute",
                      top: "calc(100% + 14px)",
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: 220,
                      background: "var(--rv-surface)",
                      color: "var(--rv-ink)",
                      borderRadius: 4,
                      boxShadow: "var(--rv-shadow)",
                      padding: 8,
                      textTransform: "none",
                      letterSpacing: "normal",
                      fontWeight: 400,
                      zIndex: 40,
                    }}
                  >
                    {SERIES_LIST.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => {
                          setProductsOpen(false);
                          setStage("catalogue");
                        }}
                        style={{
                          display: "block",
                          width: "100%",
                          textAlign: "left",
                          padding: "9px 12px",
                          borderRadius: 4,
                          fontSize: 13,
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "var(--rv-ink)",
                        }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <a href="#" onClick={(e) => e.preventDefault()}>
                Projekter
              </a>
              <a href="#" onClick={(e) => e.preventDefault()}>
                Dokumentation
              </a>
              <a href="#" onClick={(e) => e.preventDefault()}>
                Forhandlere
              </a>
              <a href="#" onClick={(e) => e.preventDefault()}>
                Profil
              </a>
              <a href="#" onClick={(e) => e.preventDefault()}>
                Kontakt
              </a>
              <a href="#" onClick={(e) => e.preventDefault()}>
                Nyheder
              </a>
              <Link href="/" className="rv-exit-link">
                Afslut demo
              </Link>
            </nav>

            <div className="rv-topbar-actions">
              <span className="rv-lang">🇩🇰 Dansk</span>
              <form className="rv-search" onSubmit={handleSearch}>
                <input ref={searchRef} type="search" placeholder="Søg..." aria-label="Søg efter produkt" />
                <button type="submit" aria-label="Søg">
                  <SearchIcon />
                </button>
              </form>
            </div>
          </div>
        </header>

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

function ChevronDown() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}
function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </svg>
  );
}
