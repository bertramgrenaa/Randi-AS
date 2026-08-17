"use client";

import { RANDI_PRODUCTS, type RandiProduct } from "@/data/randi-real-products";
import { formatDKK } from "@/lib/project-engines";
import HandleIllustration from "./HandleIllustration";

const FINISH_SWATCH_COLOR: Record<RandiProduct["finishFamily"], string> = {
  steel: "linear-gradient(135deg,#d7dade,#8b9096)",
  "black-pvd": "linear-gradient(135deg,#4a4b4f,#1c1d20)",
  "brass-pvd": "linear-gradient(135deg,#d3ab68,#8f6a34)",
  "copper-pvd": "linear-gradient(135deg,#c17e4e,#7c4522)",
  "polished-brass": "linear-gradient(135deg,#f0d28c,#b3862f)",
};

interface DetailStageProps {
  product: RandiProduct;
  onVisualize: () => void;
  onBack: () => void;
  onSwitchProduct: (product: RandiProduct) => void;
}

export default function DetailStage({ product, onVisualize, onBack, onSwitchProduct }: DetailStageProps) {
  const siblings = RANDI_PRODUCTS.filter((p) => p.name === product.name);

  return (
    <div className="rv-detail rv-container">
      <button type="button" className="rv-back" onClick={onBack}>
        <BackIcon /> Tilbage til Dørgreb
      </button>

      <div className="rv-detail-grid">
        <div>
          <div className="rv-detail-stage">
            <HandleIllustration
              silhouette={product.silhouette}
              finishFamily={product.finishFamily}
              hasBirchInsert={product.silhouette === "nordic-straight"}
            />
          </div>
          {siblings.length > 1 && (
            <div className="rv-finish-row">
              {siblings.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  aria-label={s.finish}
                  title={s.finish}
                  className={`rv-finish-swatch ${s.id === product.id ? "on" : ""}`}
                  style={{ background: FINISH_SWATCH_COLOR[s.finishFamily] }}
                  onClick={() => onSwitchProduct(s)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="rv-detail-info">
          <h1>{product.productNumber}</h1>
          <div className="series">
            {product.series} · {product.name}
          </div>
          {product.designer && (
            <p className="desig">
              Designet af {product.designer}
              {product.designerNote ? ` — ${product.designerNote}` : ""}
            </p>
          )}
          <p className="desc">{product.description}</p>

          <ul className="rv-bullets">
            <li>Leveres som standard i {product.finish.toLowerCase()}.</li>
            <li>Materiale: {product.materials}.</li>
            {product.diameterMm && <li>Diameter: Ø{product.diameterMm} mm.</li>}
            {product.doorThicknessOptions && (
              <li>Leveres i sæt til dørtykkelse {product.doorThicknessOptions.join(", ")}.</li>
            )}
            {product.spindleOptions && <li>Standard dørgrebspind, {product.spindleOptions.join(" og ")}.</li>}
            {product.standards && product.standards.length > 0 && (
              <li>
                Grebet er godkendt i henhold til:{" "}
                {product.standards.map((std, i) => (
                  <span key={std}>
                    <span className="std">{std}</span>
                    {i < product.standards!.length - 1 ? ", " : ""}
                  </span>
                ))}
                .
              </li>
            )}
          </ul>

          <div className="rv-detail-price">
            {formatDKK(product.priceDKK.value)}
            <span className="rv-demo-badge">Demo-pris</span>
          </div>

          {product.sustainabilityAttributes.map((attr) => (
            <div className="rv-sustain-tag" key={attr.label}>
              <LeafIcon />
              <div>
                <div className="label">{attr.label}</div>
                <div className="detail">{attr.detail}</div>
              </div>
            </div>
          ))}

          <div className="rv-detail-cta">
            <button type="button" className="rv-btn rv-btn-primary" onClick={onVisualize}>
              Se på min dør <ArrowIcon />
            </button>
          </div>

          <p className="rv-source-note">
            Produktdata baseret på randi.dk og officielle designerkilder. Priser og CO₂e er demo-værdier —
            erstat med Randis pris- og LCA-data.
          </p>
        </div>
      </div>
    </div>
  );
}

function BackIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M19 12H5" />
      <path d="M11 18l-6-6 6-6" />
    </svg>
  );
}
function ArrowIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M5 12h14" />
      <path d="M13 6l6 6-6 6" />
    </svg>
  );
}
function LeafIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ marginTop: 2 }}>
      <path d="M11 20A7 7 0 0 1 4 13c0-4 3-8 10-9 1 6-1 12-3 16z" />
      <path d="M4 13c4 0 8-2 10-9" />
    </svg>
  );
}
