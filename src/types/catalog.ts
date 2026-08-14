// Shared product & catalog types for the Randi BuildingScan & Visualizer prototype.

export type ProductGroup =
  | "doorHandles"
  | "windowHandles"
  | "sanitaryProducts"
  | "accessories";

/** Normalized shape every product in data/randi-products.json is coerced into at load time. */
export interface RandiProduct {
  id: string;
  sku: string;
  series: string;
  name: string;
  description: string;
  finish: string;
  material: string;
  priceDKK: number;
  unit: string;
  epdCo2eKg: number;
  imagePath: string;
  tags: string[];
  /** Sub-category, e.g. "sæbedispenser" or "dørlukker" (present on sanitary/accessory items). */
  category?: string;
  compatibleDoorTypes?: string[];
  matchesDoorSeries?: string[];
  recommendedFor?: string[];
  /** Which top-level group of the catalog this product was loaded from. */
  group: ProductGroup;
}

export interface RandiCatalog {
  doorHandles: RandiProduct[];
  windowHandles: RandiProduct[];
  sanitaryProducts: RandiProduct[];
  accessories: RandiProduct[];
}
