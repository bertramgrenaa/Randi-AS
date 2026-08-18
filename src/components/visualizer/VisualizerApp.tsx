"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { RANDI_PRODUCTS, type DoorTypeKey, type RandiHandleProduct } from "@/data/randi-real-products";
import { EMPTY_LEAD, type LeadInfo, type Stage, type UploadedPhoto } from "@/types/visualizer";
import CatalogueStage from "./CatalogueStage";
import DetailStage from "./DetailStage";
import LeadStage from "./LeadStage";
import UploadStage from "./UploadStage";
import ProcessingStage from "./ProcessingStage";
import ResultStage from "./ResultStage";

export default function VisualizerApp() {
  const [stage, setStage] = useState<Stage>("catalogue");
  const [product, setProduct] = useState<RandiHandleProduct | null>(null);
  const [lead, setLead] = useState<LeadInfo>(EMPTY_LEAD);
  const [photo, setPhoto] = useState<UploadedPhoto | null>(null);
  const [doorType, setDoorType] = useState<DoorTypeKey | null>(null);
  const [productsOpen, setProductsOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  function handleSelectProduct(p: RandiHandleProduct) {
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

  function handleProcessingDone(result: DoorTypeKey) {
    setDoorType(result);
    setStage("result");
  }

  /** Recommendation cards can switch the primary product without losing the uploaded photo. */
  function handleSelectDifferentProduct(p: RandiHandleProduct) {
    setProduct(p);
    setStage("processing");
  }

  function handleRestart() {
    setProduct(null);
    setPhoto(null);
    setDoorType(null);
    setStage("catalogue");
  }

  function handleLogoClick() {
    setProduct(null);
    setPhoto(null);
    setDoorType(null);
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
          <MedalIcon />
          <span>AWARDS</span>
        </div>

        <header className="rv-topbar">
          <div className="rv-topbar-inner">
            <button type="button" className="rv-logo" onClick={handleLogoClick}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="rv-logo-mark" src="/visualizer-examples/randi-icon-mark.png" alt="" />
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
                    <button
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
                      Dørgreb
                    </button>
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
              <span className="rv-lang">
                <DanishFlagIcon />
                Dansk
                <ChevronDown />
              </span>
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
          <DetailStage product={product} onVisualize={handleVisualize} onBack={() => setStage("catalogue")} />
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

        {stage === "result" && product && photo && doorType && (
          <ResultStage
            product={product}
            lead={lead}
            photo={photo}
            doorType={doorType}
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
function MedalIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="15" r="6" />
      <path d="M9 9.5L6 3M15 9.5l3-6.5M9.5 15l-1 3.5M14.5 15l1 3.5" />
    </svg>
  );
}
function DanishFlagIcon() {
  return (
    <svg width="16" height="12" viewBox="0 0 16 12" style={{ flexShrink: 0 }}>
      <rect width="16" height="12" fill="#c8102e" />
      <rect x="5" width="2.4" height="12" fill="#fff" />
      <rect y="5" width="16" height="2.4" fill="#fff" />
    </svg>
  );
}
