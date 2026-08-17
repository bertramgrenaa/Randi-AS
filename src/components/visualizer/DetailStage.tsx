"use client";

import { RANDI_PRODUCTS, type RandiProduct } from "@/data/randi-real-products";
import { formatDKK } from "@/lib/project-engines";
import HandleIllustration from "./HandleIllustration";

const FINISH_SWATCH_COLOR: Record<RandiProduct["finishFamily"], string> = {
  steel: "linear-gradient(135deg,#e2ded2,#a39c8c)",
  "black-pvd": "linear-gradient(135deg,#4a453c,#211e19)",
  "brass-pvd": "linear-gradient(135deg,#d3ab68,#96723a)",
  "copper-pvd": "linear-gradient(135deg,#c17e4e,#8a4f28)",
  "polished-brass": "linear-gradient(135deg,#ecd08a,#b5893f)",
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
        <BackIcon /> Tilbage til katalog
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
          <div className="series">{product.series}</div>
          <div className="num">{product.productNumber}</div>
          <h1>{product.name}</h1>
          {product.designer && (
            <p className="desig">
              Designet af {product.designer}
              {product.designerNote ? ` — ${product.designerNote}` : ""}
            </p>
          )}
          <p className="desc">{product.description}</p>

          <dl className="rv-spec-list">
            <div className="rv-spec-row">
              <dt>Finish</dt>
              <dd>{product.finish}</dd>
            </div>
            <div className="rv-spec-row">
              <dt>Materiale</dt>
              <dd>{product.materials}</dd>
            </div>
            {product.diameterMm && (
              <div className="rv-spec-row">
                <dt>Diameter</dt>
                <dd>Ø{product.diameterMm} mm</dd>
              </div>
            )}
            {product.doorThicknessOptions && (
              <div className="rv-spec-row">
                <dt>Dørtykkelse</dt>
                <dd>{product.doorThicknessOptions.join(" / ")}</dd>
              </div>
            )}
            {product.spindleOptions && (
              <div className="rv-spec-row">
                <dt>Spindel</dt>
                <dd>{product.spindleOptions.join(" / ")}</dd>
              </div>
            )}
            {product.standards && product.standards.length > 0 && (
              <div className="rv-spec-row">
                <dt>Standarder</dt>
                <dd>{product.standards.join(", ")}</dd>
              </div>
            )}
            <div className="rv-spec-row">
              <dt>Vejl. pris</dt>
              <dd>
                {formatDKK(product.priceDKK.value)}
                <span className="rv-demo-badge">Demo</span>
              </dd>
            </div>
          </dl>

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
