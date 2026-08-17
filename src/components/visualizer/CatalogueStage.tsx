"use client";

import { useMemo, useState } from "react";
import { RANDI_PRODUCTS, RANDI_SERIES_INFO, type RandiProduct } from "@/data/randi-real-products";
import HandleIllustration from "./HandleIllustration";
import RevealOnScroll from "./RevealOnScroll";

const SERIES_FILTERS = ["Alle", "Randi-Line®", "Randi-Line® Design"] as const;

interface CatalogueStageProps {
  onSelect: (product: RandiProduct) => void;
}

export default function CatalogueStage({ onSelect }: CatalogueStageProps) {
  const [filter, setFilter] = useState<(typeof SERIES_FILTERS)[number]>("Alle");

  const products = useMemo(
    () => (filter === "Alle" ? RANDI_PRODUCTS : RANDI_PRODUCTS.filter((p) => p.series === filter)),
    [filter]
  );

  return (
    <div>
      <div className="rv-cat-head rv-container-narrow">
        <span className="rv-eyebrow">Randi A/S · Grebskatalog</span>
        <h1>Vælg et greb</h1>
        <p>
          {RANDI_SERIES_INFO.heritage} Nedenfor er et udvalg af Randi-Line®-serien — vælg et greb for at se det
          på din egen dør.
        </p>
      </div>

      <div className="rv-container">
        <div className="rv-filter-row">
          {SERIES_FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              className={`rv-filter-chip ${filter === f ? "on" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="rv-cat-list">
          {products.map((product) => (
            <RevealOnScroll key={product.id}>
              <button type="button" className="rv-cat-row" onClick={() => onSelect(product)}>
                <div className="rv-cat-thumb">
                  <HandleIllustration
                    silhouette={product.silhouette}
                    finishFamily={product.finishFamily}
                    hasBirchInsert={product.silhouette === "nordic-straight"}
                  />
                </div>
                <div className="rv-cat-info">
                  <div className="num">{product.productNumber}</div>
                  <h3>{product.name}</h3>
                  <div className="meta">
                    {product.finish} · {product.materials}
                  </div>
                  {product.designer && <div className="desig">Designet af {product.designer}</div>}
                </div>
                <div className="rv-cat-cta">
                  Se på min dør
                  <ArrowIcon />
                </div>
              </button>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </div>
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
