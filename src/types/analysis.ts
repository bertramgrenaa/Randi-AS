import type { RandiProduct } from "./catalog";

/** A single door (or door type group) detected in the uploaded image/document. */
export interface DetectedDoor {
  id: string;
  label: string;
  doorType: string;
  material: string;
  colorTone: string;
  estimatedCount: number;
  /** 0-1 model confidence for this detection. */
  confidence: number;
}

export interface ConfiguredLineItem {
  product: RandiProduct;
  quantity: number;
  /** Human-readable reason this item was recommended (shown in the UI). */
  reason: string;
}

export interface ProjectTotals {
  subtotalDKK: number;
  vatDKK: number;
  vatRate: number;
  totalDKK: number;
  totalCo2eKg: number;
}

export type AnalysisSource = "claude-vision" | "mock-simulation";

export interface AnalysisResult {
  id: string;
  createdAt: string;
  sourceFileName: string;
  source: AnalysisSource;
  summary: string;
  recommendedSeries: string;
  detectedDoors: DetectedDoor[];
  doorLineItems: ConfiguredLineItem[];
  crossSellLineItems: ConfiguredLineItem[];
  totals: ProjectTotals;
}
