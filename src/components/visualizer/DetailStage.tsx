"use client";

import type { RandiHandleProduct } from "@/data/randi-real-products";
import { formatDKK } from "@/lib/project-engines";

interface DetailStageProps {
  product: RandiHandleProduct;
  onVisualize: () => void;
  onBack: () => void;
}

export default function DetailStage({ product, onVisualize, onBack }: DetailStageProps) {
  return (
    <div className="rv-detail rv-container">
      <button type="button" className="rv-back" onClick={onBack}>
        <BackIcon /> Tilbage til Dørgreb
      </button>

      <div className="rv-detail-grid">
        <div>
          <div className="rv-detail-stage">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={product.handlePhoto} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
          </div>
        </div>

        <div className="rv-detail-info">
          <h1>{product.productNumber}</h1>
          <div className="series">
            Randi-Line® · {product.name}
            {product.verified ? (
              <span className="rv-verified-badge">
                <CheckIcon /> Bekræftet produktdata
              </span>
            ) : null}
          </div>
          {product.designer && <p className="desig">Designet af {product.designer}</p>}
          {product.description && <p className="desc">{product.description}</p>}

          <ul className="rv-bullets">
            <li>Leveres som standard i {product.finish.toLowerCase()}.</li>
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

          <div className="rv-insight-box">
            <LeafIcon />
            <div>
              <div className="title">{product.insight.title}</div>
              <p className="body">{product.insight.body}</p>
            </div>
          </div>

          <div className="rv-detail-cta">
            <button type="button" className="rv-btn rv-btn-primary" onClick={onVisualize}>
              Se på min dør <ArrowIcon />
            </button>
          </div>

          <p className="rv-source-note">
            {product.verified
              ? "Produktdata (designer, standarder, beskrivelse) er researchet fra randi.dk og officielle designerkilder."
              : "Produktnummer og finish er som oplyst af Randi A/S — ikke uafhængigt verificeret mod randi.dk i denne prototype."}{" "}
            Pris og CO₂e er demo-værdier — erstat med Randis pris- og LCA-data.
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
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ marginTop: 2, flexShrink: 0 }}>
      <path d="M11 20A7 7 0 0 1 4 13c0-4 3-8 10-9 1 6-1 12-3 16z" />
      <path d="M4 13c4 0 8-2 10-9" />
    </svg>
  );
}
function CheckIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}
