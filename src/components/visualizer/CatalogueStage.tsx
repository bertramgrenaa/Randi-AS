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
        <h1>Dørgreb</h1>
        <p>
          {RANDI_SERIES_INFO.heritage} Vælg et greb for at se det på din egen dør.
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

        <div className="rv-grid">
          {products.map((product) => (
            <RevealOnScroll key={product.id}>
              <button type="button" className="rv-card" onClick={() => onSelect(product)}>
                <div className="stage">
                  <HandleIllustration
                    silhouette={product.silhouette}
                    finishFamily={product.finishFamily}
                    hasBirchInsert={product.silhouette === "nordic-straight"}
                  />
                </div>
                <div className="info">
                  <div className="sku">{product.productNumber}</div>
                  <div className="meta">{product.finish}</div>
                  <div className="name">{product.name}</div>
                </div>
              </button>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </div>
  );
}
