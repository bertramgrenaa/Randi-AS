import { getProductById, type RandiProduct } from "@/data/randi-real-products";

/**
 * Price + CO2e engines for a project (a project can mix multiple products/quantities, e.g.
 * 8 × Nordic 1078.00 on the main entrance + 4 × Wing 1074.00 on interior doors).
 *
 * Both engines are pure functions over `ProjectLine[]` so Randi can later swap the per-product
 * `priceDKK` / `co2eKg` demo values for a real price feed / EPD dataset without touching this
 * module's shape — only the inputs change.
 */

export interface ProjectLine {
  productId: string;
  quantity: number;
}

export const VAT_RATE = 0.25;

export interface PriceBreakdown {
  subtotalDKK: number;
  vatDKK: number;
  vatRate: number;
  totalDKK: number;
  isDemo: true;
}

export interface Co2LineBreakdown {
  productId: string;
  productName: string;
  quantity: number;
  subtotalKg: number;
}

export interface Co2Breakdown {
  totalKg: number;
  perLine: Co2LineBreakdown[];
  assumptions: { label: string; note: string }[];
  isDemo: true;
}

function round(v: number, decimals = 0): number {
  const f = 10 ** decimals;
  return Math.round(v * f) / f;
}

export function calculateProjectPrice(lines: ProjectLine[]): PriceBreakdown {
  const subtotalDKK = round(
    lines.reduce((sum, line) => {
      const product = getProductById(line.productId);
      return sum + (product ? product.priceDKK.value * line.quantity : 0);
    }, 0)
  );
  const vatDKK = round(subtotalDKK * VAT_RATE);
  return { subtotalDKK, vatDKK, vatRate: VAT_RATE, totalDKK: round(subtotalDKK + vatDKK), isDemo: true };
}

export function calculateProjectCo2(lines: ProjectLine[]): Co2Breakdown {
  const perLine: Co2LineBreakdown[] = lines
    .map((line) => {
      const product = getProductById(line.productId);
      if (!product) return null;
      return {
        productId: product.id,
        productName: product.name,
        quantity: line.quantity,
        subtotalKg: round(product.co2eKg.value * line.quantity, 1),
      };
    })
    .filter((l): l is Co2LineBreakdown => l !== null);

  const totalKg = round(
    perLine.reduce((sum, l) => sum + l.subtotalKg, 0),
    1
  );

  return {
    totalKg,
    perLine,
    isDemo: true,
    assumptions: [
      {
        label: "Materiale & produktion (A1–A3)",
        note: "Demo-værdi pr. produkt — erstat med Randis certificerede EPD/LCA-data pr. produktnummer.",
      },
      {
        label: "Transport (A4)",
        note: "Demo data – replace with Randi LCA/product data. Ikke medregnet med reel transportafstand i denne prototype.",
      },
      {
        label: "Bortskaffelse (C1–C4)",
        note: "Demo data – replace with Randi LCA/product data. Rustfrit stål og messing er i praksis højt genanvendelige materialer.",
      },
    ],
  };
}

export function formatDKK(value: number): string {
  return new Intl.NumberFormat("da-DK", { style: "currency", currency: "DKK", maximumFractionDigits: 0 }).format(
    value
  );
}
export function formatCo2(value: number): string {
  return `${new Intl.NumberFormat("da-DK", { maximumFractionDigits: 1 }).format(value)} kg CO₂e`;
}

/* ============================================================
   RECOMMENDATION ENGINE
   ============================================================ */

export interface RecommendationInput {
  selectedProduct: RandiProduct;
  buildingType?: string;
  doorCount: number;
  sustainabilityPreference?: boolean;
}

export interface Recommendation {
  product: RandiProduct;
  reason: string;
}

/**
 * Transparent, rule-based recommender (no ML — every recommendation carries a stated reason,
 * per the brief: never "recommended for you" without an explanation). Prioritises the birch
 * bark Nordic series when it's a genuinely relevant fit, otherwise falls back to the selected
 * product's own curated `recommendedAlternativeIds`.
 */
export function recommendAlternatives(input: RecommendationInput): Recommendation[] {
  const { selectedProduct, buildingType, doorCount, sustainabilityPreference } = input;
  const recs: Recommendation[] = [];

  const nordic = getProductById("nordic-1078-00");
  const isNordicFamily = selectedProduct.silhouette === "nordic-straight";
  if (nordic && !isNordicFamily) {
    const wantsSustainability =
      sustainabilityPreference || buildingType === "Skole" || buildingType === "Sundhed" || buildingType === "Bolig";
    if (wantsSustainability) {
      recs.push({
        product: nordic,
        reason: `Anbefalet fordi grebet bruger birkebark som en del af håndtaget og passer til det minimalistiske udtryk i dit valgte produkt — birkebark er naturligt antibakterielt, hvilket ofte er relevant for ${
          buildingType ? buildingType.toLowerCase() : "bygninger med mange berøringer af håndtaget"
        }.`,
      });
    }
  }

  for (const altId of selectedProduct.recommendedAlternativeIds) {
    if (recs.some((r) => r.product.id === altId)) continue;
    const alt = getProductById(altId);
    if (!alt) continue;
    let reason: string;
    if (alt.series !== selectedProduct.series) {
      reason = `Samme grebsform som ${selectedProduct.name}, men i ${alt.series} med ${alt.finish.toLowerCase()} — velegnet hvis projektet kræver ekstra slidstyrke eller et andet finish-udtryk.`;
    } else if (alt.designer === selectedProduct.designer && alt.designer) {
      reason = `Fra samme designserie som ${selectedProduct.name} (${alt.designer}), i ${alt.finish.toLowerCase()} — for et sammenhængende udtryk på tværs af projektets døre.`;
    } else {
      reason = `Et beslægtet Randi-Line® greb der matcher projektets skala (${doorCount} døre) og kan bruges til fx sekundære døre i samme projekt.`;
    }
    recs.push({ product: alt, reason });
    if (recs.length >= 3) break;
  }

  return recs.slice(0, 3);
}
