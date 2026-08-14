import type { ConfiguredLineItem, ProjectTotals } from "@/types/analysis";

/** Standard Danish VAT rate applied on top of the (VAT-excl.) catalog prices. */
export const DANISH_VAT_RATE = 0.25;

export function computeTotals(
  lineItems: ConfiguredLineItem[],
  vatRate: number = DANISH_VAT_RATE
): ProjectTotals {
  const subtotalDKK = round2(
    lineItems.reduce((sum, item) => sum + item.product.priceDKK * item.quantity, 0)
  );
  const vatDKK = round2(subtotalDKK * vatRate);
  const totalDKK = round2(subtotalDKK + vatDKK);
  const totalCo2eKg = round2(
    lineItems.reduce((sum, item) => sum + item.product.epdCo2eKg * item.quantity, 0)
  );

  return { subtotalDKK, vatDKK, vatRate, totalDKK, totalCo2eKg };
}

export function formatDKK(value: number): string {
  return new Intl.NumberFormat("da-DK", {
    style: "currency",
    currency: "DKK",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatCo2e(value: number): string {
  return `${new Intl.NumberFormat("da-DK", { maximumFractionDigits: 1 }).format(value)} kg CO2e`;
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}
