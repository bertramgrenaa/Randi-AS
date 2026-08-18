import { getProductById, RANDI_PRODUCTS, isAccessory, type RandiHandleProduct } from "@/data/randi-real-products";

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
  co2Note?: string;
}

export interface Co2Breakdown {
  totalKg: number;
  perLine: Co2LineBreakdown[];
  isDemo: true;
}

function round(v: number, decimals = 0): number {
  const f = 10 ** decimals;
  return Math.round(v * f) / f;
}

/** Number of doors in a project — accessories (window handles, escutcheons, etc.) don't count as doors. */
export function countDoors(lines: ProjectLine[]): number {
  return lines.reduce((sum, line) => {
    const product = getProductById(line.productId);
    if (!product || isAccessory(product)) return sum;
    return sum + line.quantity;
  }, 0);
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
    .map((line): Co2LineBreakdown | null => {
      const product = getProductById(line.productId);
      if (!product) return null;
      return {
        productId: product.id,
        productName: product.name,
        quantity: line.quantity,
        subtotalKg: round(product.co2eKg.value * line.quantity, 1),
        co2Note: isAccessory(product) ? undefined : product.co2Note,
      };
    })
    .filter((l): l is Co2LineBreakdown => l !== null);

  const totalKg = round(
    perLine.reduce((sum, l) => sum + l.subtotalKg, 0),
    1
  );

  return { totalKg, perLine, isDemo: true };
}

export function formatDKK(value: number): string {
  return new Intl.NumberFormat("da-DK", { style: "currency", currency: "DKK", maximumFractionDigits: 0 }).format(value);
}
export function formatCo2(value: number): string {
  return `${new Intl.NumberFormat("da-DK", { maximumFractionDigits: 1 }).format(value)} kg CO₂e`;
}

export interface RecommendationInput {
  selectedProduct: RandiHandleProduct;
  doorCount: number;
}
export interface Recommendation {
  product: RandiHandleProduct;
  reason: string;
}

/**
 * Up to 3 alternative door handles (never accessories) to show alongside the selected product.
 * Verified products get a reason that highlights their researched specs and sustainability
 * attribute; unverified (demo) products get a generic reason that's honest about being a
 * prototype recommendation rather than a data-backed match.
 */
export function recommendAlternatives(input: RecommendationInput): Recommendation[] {
  const { selectedProduct, doorCount } = input;
  return RANDI_PRODUCTS.filter((p) => p.id !== selectedProduct.id)
    .slice(0, 3)
    .map((alt) => {
      const reason = alt.verified
        ? `Anbefalet ud fra researchede specifikationer og en dokumenteret bæredygtighedsegenskab (${alt.insight.title.toLowerCase()}).`
        : `Alternativt greb til dit projekt (${doorCount} døre), vist på det samme dørfoto som ${selectedProduct.name}.`;
      return { product: alt, reason };
    });
}
