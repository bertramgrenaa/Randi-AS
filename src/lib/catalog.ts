import rawCatalog from "../../data/randi-products.json";
import type { ProductGroup, RandiCatalog, RandiProduct } from "@/types/catalog";

type RawGroup = Record<string, unknown>[];

interface RawCatalogShape {
  doorHandles: RawGroup;
  windowHandles: RawGroup;
  sanitaryProducts: RawGroup;
  accessories: RawGroup;
}

const GROUPS: ProductGroup[] = [
  "doorHandles",
  "windowHandles",
  "sanitaryProducts",
  "accessories",
];

function tagGroup(group: ProductGroup, items: RawGroup): RandiProduct[] {
  return items.map((item) => ({ ...(item as object), group } as RandiProduct));
}

let cachedCatalog: RandiCatalog | null = null;

/** Loads and normalizes the mock Randi product catalog (data/randi-products.json). */
export function getCatalog(): RandiCatalog {
  if (cachedCatalog) return cachedCatalog;
  const raw = rawCatalog as unknown as RawCatalogShape;
  cachedCatalog = {
    doorHandles: tagGroup("doorHandles", raw.doorHandles),
    windowHandles: tagGroup("windowHandles", raw.windowHandles),
    sanitaryProducts: tagGroup("sanitaryProducts", raw.sanitaryProducts),
    accessories: tagGroup("accessories", raw.accessories),
  };
  return cachedCatalog;
}

export function getAllProducts(): RandiProduct[] {
  const catalog = getCatalog();
  return GROUPS.flatMap((group) => catalog[group]);
}

export function getProductById(id: string): RandiProduct | undefined {
  return getAllProducts().find((p) => p.id === id);
}

export function getProductsByGroup(group: ProductGroup): RandiProduct[] {
  return getCatalog()[group];
}
