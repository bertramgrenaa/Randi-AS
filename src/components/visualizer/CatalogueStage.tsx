"use client";

import { RANDI_PRODUCTS, type RandiHandleProduct } from "@/data/randi-real-products";
import RevealOnScroll from "./RevealOnScroll";

interface CatalogueStageProps {
  onSelect: (product: RandiHandleProduct) => void;
}

export default function CatalogueStage({ onSelect }: CatalogueStageProps) {
  return (
    <div>
      <div className="rv-cat-head rv-container-narrow">
        <span className="rv-eyebrow">Randi A/S · Grebskatalog</span>
        <h1>Dørgreb</h1>
        <p>Vælg et greb for at se det på din egen dør — upload et billede, og se det visualiseret med det samme.</p>
      </div>

      <div className="rv-container">
        <div className="rv-grid">
          {RANDI_PRODUCTS.map((product) => (
            <RevealOnScroll key={product.id}>
              <button type="button" className="rv-card" onClick={() => onSelect(product)}>
                <div className="stage">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={product.handlePhoto} alt={product.name} />
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
