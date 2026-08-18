"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ACCESSORIES,
  DOOR_TYPES,
  getProductById,
  productDisplayLabel,
  type DoorTypeKey,
  type RandiHandleProduct,
} from "@/data/randi-real-products";
import {
  calculateProjectCo2,
  calculateProjectPrice,
  countDoors,
  formatCo2,
  formatDKK,
  recommendAlternatives,
  type ProjectLine,
} from "@/lib/project-engines";
import type { LeadInfo, UploadedPhoto } from "@/types/visualizer";
import BeforeAfterSlider from "./BeforeAfterSlider";
import RevealOnScroll from "./RevealOnScroll";

interface ResultStageProps {
  product: RandiHandleProduct;
  lead: LeadInfo;
  photo: UploadedPhoto;
  doorType: DoorTypeKey;
  onSelectDifferentProduct: (product: RandiHandleProduct) => void;
  onRestart: () => void;
}

export default function ResultStage({
  product,
  lead,
  photo,
  doorType,
  onSelectDifferentProduct,
  onRestart,
}: ResultStageProps) {
  const [lines, setLines] = useState<ProjectLine[]>([{ productId: product.id, quantity: lead.doorCount }]);
  const [co2Expanded, setCo2Expanded] = useState(false);
  const [requested, setRequested] = useState<"quote" | "call" | null>(null);
  const [openCompareId, setOpenCompareId] = useState<string | null>(null);
  const [stickyVisible, setStickyVisible] = useState(false);
  const heroActionsRef = useRef<HTMLDivElement>(null);
  const finalCtaRef = useRef<HTMLDivElement>(null);

  const price = useMemo(() => calculateProjectPrice(lines), [lines]);
  const co2 = useMemo(() => calculateProjectCo2(lines), [lines]);
  const totalDoors = useMemo(() => countDoors(lines), [lines]);

  const recommendations = useMemo(
    () => recommendAlternatives({ selectedProduct: product, doorCount: lead.doorCount }),
    [product, lead.doorCount]
  );
  const comparisonAlt =
    openCompareId != null ? recommendations.find((r) => r.product.id === openCompareId)?.product : undefined;

  const co2NotesShown = useMemo(() => {
    const seen = new Set<string>();
    const notes: { productName: string; note: string }[] = [];
    for (const l of co2.perLine) {
      if (!l.co2Note || seen.has(l.productId)) continue;
      seen.add(l.productId);
      notes.push({ productName: l.productName, note: l.co2Note });
    }
    return notes;
  }, [co2.perLine]);

  useEffect(() => {
    const el = heroActionsRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => setStickyVisible(!entry.isIntersecting), {
      rootMargin: "-40px 0px 0px 0px",
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  function updateQuantity(productId: string, delta: number) {
    setLines((prev) =>
      prev.map((l) => (l.productId === productId ? { ...l, quantity: Math.max(1, l.quantity + delta) } : l))
    );
  }
  function removeLine(productId: string) {
    setLines((prev) => prev.filter((l) => l.productId !== productId));
  }
  function addToProject(productId: string) {
    setLines((prev) => {
      const existing = prev.find((l) => l.productId === productId);
      if (existing) return prev.map((l) => (l.productId === productId ? { ...l, quantity: l.quantity + 1 } : l));
      return [...prev, { productId, quantity: 1 }];
    });
  }
  function toggleCompare(productId: string) {
    setOpenCompareId((prev) => (prev === productId ? null : productId));
  }
  function requestAction(kind: "quote" | "call") {
    setRequested(kind);
    finalCtaRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  return (
    <div>
      {/* hero visualization */}
      <div className="rv-result-hero rv-container">
        <div className="rv-result-heading">
          <span className="rv-eyebrow">Din visualisering</span>
          <h1>Din dør med {productDisplayLabel(product)}</h1>
          <p className="rv-doortype-note">
            Genkendt som {DOOR_TYPES[doorType].label.toLowerCase()} ud fra billedets farvetone.
          </p>
        </div>
        <BeforeAfterSlider
          beforeUrl={photo.dataUrl}
          afterUrl={product.afterSrc[doorType]}
          aspectRatio={DOOR_TYPES[doorType].aspectRatio}
        />
        <p className="rv-sim-note">
          <InfoIcon /> Døren er genkendt ud fra farvetone i dit billede — se{" "}
          <code>classifyDoorPhoto()</code>. Denne demo har rigtige komposit-fotos for begge dørtyper og
          alle 4 greb; i produktion erstattes dette af en rigtig billedgenereringsmodel, der kan
          sammensætte grebet direkte på dit eget fotos præcise dørtype og lys.
        </p>
        <div className="rv-result-actions" ref={heroActionsRef}>
          <button type="button" className="rv-btn rv-btn-outline rv-btn-sm" onClick={onRestart}>
            Prøv et andet greb
          </button>
        </div>
      </div>

      {/* project quantity */}
      <RevealOnScroll>
        <section className="rv-section rv-container">
          <span className="rv-section-label">Dit projekt</span>
          <h2>
            {totalDoors} {totalDoors === 1 ? "dør" : "døre"}
            {lead.buildingType ? ` · ${lead.buildingType.toLowerCase()}` : ""}
          </h2>

          <div className="rv-project-row">
            <div className="rv-project-lines">
              {lines.map((line) => {
                const p = getProductById(line.productId);
                if (!p) return null;
                const isPrimary = p.id === product.id;
                return (
                  <div className="rv-project-line" key={p.id}>
                    <div className="swatch">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.handlePhoto} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                    </div>
                    <div>
                      <div className="pname">{p.name}</div>
                      <div className="pnum">
                        {p.productNumber} · {p.finish}
                      </div>
                    </div>
                    <div className="rv-stepper" style={{ marginLeft: "auto" }}>
                      <button type="button" aria-label="Færre" onClick={() => updateQuantity(p.id, -1)}>
                        −
                      </button>
                      <span className="count" style={{ fontSize: 18, minWidth: 30 }}>
                        {line.quantity}
                      </span>
                      <button type="button" aria-label="Flere" onClick={() => updateQuantity(p.id, 1)}>
                        +
                      </button>
                    </div>
                    {!isPrimary && (
                      <button type="button" className="remove" onClick={() => removeLine(p.id)}>
                        Fjern
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* price + CO2 */}
          <div className="rv-metric-grid">
            <div className="rv-metric">
              <div className="label">
                Estimeret projektpris <span className="rv-demo-badge">Demo</span>
              </div>
              <div className="value">{formatDKK(price.totalDKK)}</div>
              <div className="sub">
                {formatDKK(price.subtotalDKK)} ekskl. moms · {formatDKK(price.vatDKK)} i moms (25%)
              </div>
            </div>
            <div className="rv-metric">
              <div className="label">
                Estimeret klimaaftryk <span className="rv-demo-badge">Demo</span>
              </div>
              <div className="value">{formatCo2(co2.totalKg)}</div>
              <button type="button" className="rv-expand-btn" onClick={() => setCo2Expanded((v) => !v)}>
                {co2Expanded ? "Skjul beregning" : "Hvordan beregnes dette?"}
              </button>
              {co2Expanded && (
                <div className="rv-expand-panel">
                  {co2.perLine.map((l) => (
                    <div className="row" key={l.productId}>
                      <span>
                        {l.quantity} × {l.productName}
                      </span>
                      <span className="l">{formatCo2(l.subtotalKg)}</span>
                    </div>
                  ))}
                  <div style={{ borderTop: "1px solid var(--rv-line)", margin: "4px 0" }} />
                  {co2NotesShown.map((n) => (
                    <p key={n.productName}>
                      <span className="l">{n.productName}:</span> {n.note}
                    </p>
                  ))}
                  <div className="rv-epd-note">
                    <p>
                      <strong>Transport og bortskaffelse</strong> er ikke medregnet med reelle afstande eller
                      livscyklusdata i denne prototype — kun selve produktionsleddet (A1–A3) er skønnet pr.
                      produkt. Rustfrit stål og messing er begge i praksis højt genanvendelige materialer, hvilket
                      trækker den reelle bortskaffelsesbelastning ned sammenlignet med metaller, der typisk
                      deponeres.
                    </p>
                    <p>
                      <strong>Hvad er en EPD/LCA?</strong> En Environmental Product Declaration (EPD) er en
                      uafhængigt verificeret miljøvaredeklaration, bygget på en Life Cycle Assessment (LCA) efter
                      standarder som EN 15804 og ISO 14025. Den dokumenterer et produkts klimaaftryk gennem hele
                      livscyklussen — fra råvare til bortskaffelse. Tallene her er demo-estimater, ikke en EPD.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </RevealOnScroll>

      {/* recommendations */}
      {recommendations.length > 0 && (
        <RevealOnScroll>
          <section className="rv-section rv-container">
            <span className="rv-section-label">Ét til at overveje</span>
            <h2>
              Baseret på dit projekt kunne du også overveje
              {recommendations.length === 1 ? " dette" : " disse"}
            </h2>
            <div className="rv-rec-grid" style={{ ["--rv-rec-cols" as string]: recommendations.length }}>
              {recommendations.map((rec) => (
                <div className="rv-rec-card" key={rec.product.id}>
                  <div className="thumb">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={rec.product.handlePhoto} alt={rec.product.name} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                  </div>
                  <div className="num">{rec.product.productNumber}</div>
                  <h3>{rec.product.name}</h3>
                  <div className="finish">
                    {rec.product.finish}
                    {rec.product.designer ? ` · Designet af ${rec.product.designer}` : ""}
                  </div>
                  <p className="reason">{rec.reason}</p>
                  <div className="actions">
                    <button
                      type="button"
                      className="rv-btn rv-btn-outline rv-btn-sm"
                      onClick={() => onSelectDifferentProduct(rec.product)}
                    >
                      Se på min dør
                    </button>
                    <button
                      type="button"
                      className="rv-btn-ghost"
                      style={{ fontSize: 12.5 }}
                      onClick={() => addToProject(rec.product.id)}
                    >
                      + Tilføj til projekt
                    </button>
                    <button
                      type="button"
                      className={`rv-btn-ghost rv-compare-toggle ${openCompareId === rec.product.id ? "open" : ""}`}
                      style={{ fontSize: 12.5 }}
                      onClick={() => toggleCompare(rec.product.id)}
                    >
                      Sammenlign <ChevronDown />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* shared, full-width horizontal comparison panel — only one open at a time */}
            {comparisonAlt && (
              <div className="rv-compare-panel-shared">
                <div className="rv-compare-shared-grid">
                  <div className="col">
                    <div className="colhead">Produkt</div>
                    <div className="cell">
                      {product.productNumber} → {comparisonAlt.productNumber}
                    </div>
                  </div>
                  <div className="col">
                    <div className="colhead">Finish</div>
                    <div className="cell">
                      {product.finish} → {comparisonAlt.finish}
                    </div>
                  </div>
                  <div className="col">
                    <div className="colhead">CO₂ pr. stk</div>
                    <div className="cell">
                      {formatCo2(product.co2eKg.value)} → {formatCo2(comparisonAlt.co2eKg.value)}
                    </div>
                  </div>
                  <div className="col">
                    <div className="colhead">Produktdata</div>
                    <div className="cell">
                      {product.verified ? "Bekræftet" : "Ikke verificeret"} →{" "}
                      {comparisonAlt.verified ? "Bekræftet" : "Ikke verificeret"}
                    </div>
                  </div>
                  <div className="col">
                    <div className="colhead">Døre i projekt</div>
                    <div className="cell">{lead.doorCount}</div>
                  </div>
                </div>
              </div>
            )}
          </section>
        </RevealOnScroll>
      )}

      {/* cross-sell: complementary Randi products */}
      <RevealOnScroll>
        <section className="rv-section rv-container">
          <span className="rv-section-label">Fuldend udtrykket</span>
          <h2>Match resten af døren — og resten af rummet</h2>
          <p className="rv-acc-intro">
            Vinduesgreb, langskilte og møbelgreb i samme finish binder helhedsindtrykket sammen ud over selve
            dørgrebet.
          </p>
          <div className="rv-acc-grid">
            {ACCESSORIES.map((acc) => (
              <div className="rv-acc-card" key={acc.id}>
                <div className="thumb">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={acc.handlePhoto} alt={acc.name} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                </div>
                <div className="cat">{acc.category}</div>
                <div className="name">{acc.name}</div>
                <div className="finish">{acc.finish}</div>
                <div className="price">
                  {formatDKK(acc.priceDKK.value)} <span className="rv-demo-badge">Demo</span>
                </div>
                <button type="button" className="rv-btn rv-btn-outline rv-btn-sm rv-btn-block" onClick={() => addToProject(acc.id)}>
                  + Tilføj til projekt
                </button>
              </div>
            ))}
          </div>
        </section>
      </RevealOnScroll>

      {/* commercial CTA */}
      <RevealOnScroll>
        <section className="rv-final" ref={finalCtaRef}>
          <div className="rv-container-narrow">
            <span className="rv-eyebrow">Næste skridt</span>
            <h2>Klar til at gå videre?</h2>

            <div className="rv-final-summary">
              <div className="row">
                <span>Projekt</span>
                <b>{lead.projectName || lead.buildingType || "Dit projekt"}</b>
              </div>
              <div className="row">
                <span>Døre</span>
                <b>{totalDoors}</b>
              </div>
              <div className="row">
                <span>Primært greb</span>
                <b>{productDisplayLabel(product)}</b>
              </div>
              <div className="row">
                <span>Estimeret projektværdi</span>
                <b>{formatDKK(price.totalDKK)}</b>
              </div>
            </div>

            {requested ? (
              <p className="rv-final-thanks">
                Tak! Vi har noteret {lead.email} for {requested === "quote" ? "et tilbud" : "en samtale med en specialist"} på
                dette projekt.
              </p>
            ) : (
              <div className="rv-final-actions">
                <button type="button" className="rv-btn rv-btn-primary" onClick={() => requestAction("quote")}>
                  Anmod om tilbud
                </button>
                <button type="button" className="rv-btn rv-btn-outline" onClick={() => requestAction("call")}>
                  Tal med en Randi-specialist
                </button>
              </div>
            )}
          </div>
        </section>
      </RevealOnScroll>

      {/* sticky CTA bar — follows while scrolling past the hero */}
      <div className={`rv-sticky-cta ${stickyVisible && !requested ? "show" : ""}`}>
        <span className="rv-sticky-cta-label">
          {productDisplayLabel(product)} · {totalDoors} {totalDoors === 1 ? "dør" : "døre"}
        </span>
        <div className="rv-sticky-cta-actions">
          <button type="button" className="rv-btn rv-btn-primary rv-btn-sm" onClick={() => requestAction("quote")}>
            Anmod om tilbud
          </button>
          <button type="button" className="rv-btn rv-btn-outline rv-btn-sm" onClick={() => requestAction("call")}>
            Tal med en Randi-specialist
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5" />
      <circle cx="12" cy="8" r="0.5" fill="currentColor" />
    </svg>
  );
}
function ChevronDown() {
  return (
    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 3, verticalAlign: -1 }}>
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}
