"use client";

import { useMemo, useState } from "react";
import { getProductById, type RandiProduct } from "@/data/randi-real-products";
import {
  calculateProjectCo2,
  calculateProjectPrice,
  formatCo2,
  formatDKK,
  recommendAlternatives,
  type ProjectLine,
} from "@/lib/project-engines";
import type { HandlePlacement, VisualizeDoorResult } from "@/lib/ai/visualizeDoor";
import type { LeadInfo, UploadedPhoto } from "@/types/visualizer";
import BeforeAfterSlider from "./BeforeAfterSlider";
import HandleIllustration from "./HandleIllustration";
import RevealOnScroll from "./RevealOnScroll";

interface ResultStageProps {
  product: RandiProduct;
  lead: LeadInfo;
  photo: UploadedPhoto;
  visualization: VisualizeDoorResult;
  onSelectDifferentProduct: (product: RandiProduct) => void;
  onRestart: () => void;
}

export default function ResultStage({
  product,
  lead,
  photo,
  visualization,
  onSelectDifferentProduct,
  onRestart,
}: ResultStageProps) {
  const [lines, setLines] = useState<ProjectLine[]>([{ productId: product.id, quantity: lead.doorCount }]);
  const [co2Expanded, setCo2Expanded] = useState(false);
  const [requested, setRequested] = useState<"quote" | "call" | null>(null);
  const [placement, setPlacement] = useState<HandlePlacement>(visualization.placement);

  const price = useMemo(() => calculateProjectPrice(lines), [lines]);
  const co2 = useMemo(() => calculateProjectCo2(lines), [lines]);
  const totalDoors = lines.reduce((s, l) => s + l.quantity, 0);

  const recommendations = useMemo(
    () =>
      recommendAlternatives({
        selectedProduct: product,
        buildingType: lead.buildingType || undefined,
        doorCount: lead.doorCount,
      }),
    [product, lead.buildingType, lead.doorCount]
  );
  const comparisonAlt = recommendations[0]?.product;

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

  return (
    <div>
      {/* STAGE 6 — hero visualization, remains the dominant element */}
      <div className="rv-result-hero rv-container">
        <div className="rv-result-heading">
          <span className="rv-eyebrow">Din visualisering</span>
          <h1>
            Din dør med {product.name} {product.productNumber}
          </h1>
        </div>
        <BeforeAfterSlider
          photoUrl={photo.dataUrl}
          product={product}
          placement={placement}
          onPlacementChange={setPlacement}
        />
        <p className="rv-sim-note">
          <InfoIcon /> Simuleret visualisering til demoformål — i produktion erstattes denne af en rigtig
          billedgenereringsmodel (se <code>visualizeDoor()</code>).
        </p>
        <div className="rv-result-actions">
          <button type="button" className="rv-btn rv-btn-outline rv-btn-sm" onClick={onRestart}>
            Prøv et andet greb
          </button>
        </div>
      </div>

      {/* STAGE 7a — project quantity */}
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
                      <HandleIllustration
                        silhouette={p.silhouette}
                        finishFamily={p.finishFamily}
                        hasBirchInsert={p.silhouette === "nordic-straight"}
                      />
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

          {/* STAGE 7b — price + CO2 */}
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
                  {co2.assumptions.map((a) => (
                    <div key={a.label}>
                      <span className="l">{a.label}:</span> {a.note}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </RevealOnScroll>

      {/* STAGE 7c — recommendations */}
      {recommendations.length > 0 && (
        <RevealOnScroll>
          <section className="rv-section rv-container">
            <span className="rv-section-label">Ét til at overveje</span>
            <h2>
              Baseret på dit projekt og valgte materiale kunne du også overveje
              {recommendations.length === 1 ? " dette" : " disse"}
            </h2>
            <div className="rv-rec-grid" style={{ ["--rv-rec-cols" as string]: recommendations.length }}>
              {recommendations.map((rec) => (
                <div className="rv-rec-card" key={rec.product.id}>
                  <div className="thumb">
                    <HandleIllustration
                      silhouette={rec.product.silhouette}
                      finishFamily={rec.product.finishFamily}
                      hasBirchInsert={rec.product.silhouette === "nordic-straight"}
                    />
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
                  </div>
                </div>
              ))}
            </div>
          </section>
        </RevealOnScroll>
      )}

      {/* STAGE 7d — comparison */}
      {comparisonAlt && (
        <RevealOnScroll>
          <section className="rv-section rv-container">
            <span className="rv-section-label">Sammenlign</span>
            <h2>Dine muligheder side om side</h2>
            <div className="rv-compare-table">
              <table>
                <thead>
                  <tr>
                    <th />
                    <th>Dit valg</th>
                    <th>Alternativ</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="rowlabel">Produkt</td>
                    <td className="hl">{product.productNumber}</td>
                    <td className="hl">{comparisonAlt.productNumber}</td>
                  </tr>
                  <tr>
                    <td className="rowlabel">Materiale</td>
                    <td>{product.materials}</td>
                    <td>{comparisonAlt.materials}</td>
                  </tr>
                  <tr>
                    <td className="rowlabel">Estimeret CO₂/stk</td>
                    <td>{formatCo2(product.co2eKg.value)}</td>
                    <td>{formatCo2(comparisonAlt.co2eKg.value)}</td>
                  </tr>
                  <tr>
                    <td className="rowlabel">Døre i projekt</td>
                    <td>{lead.doorCount}</td>
                    <td>{lead.doorCount}</td>
                  </tr>
                  <tr>
                    <td className="rowlabel">Designer</td>
                    <td>{product.designer ?? "—"}</td>
                    <td>{comparisonAlt.designer ?? "—"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </RevealOnScroll>
      )}

      {/* STAGE 7e — commercial CTA */}
      <RevealOnScroll>
        <section className="rv-final">
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
                <b>
                  {product.name} {product.productNumber}
                </b>
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
                <button type="button" className="rv-btn rv-btn-primary" onClick={() => setRequested("quote")}>
                  Anmod om tilbud
                </button>
                <button type="button" className="rv-btn rv-btn-outline" onClick={() => setRequested("call")}>
                  Tal med en Randi-specialist
                </button>
              </div>
            )}
          </div>
        </section>
      </RevealOnScroll>
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
