import { getCatalog } from "./catalog";
import { computeTotals } from "./pricing";
import type { RandiProduct } from "@/types/catalog";
import type {
  AnalysisResult,
  AnalysisSource,
  ConfiguredLineItem,
  DetectedDoor,
} from "@/types/analysis";

/** Normalized detection payload — produced either by the mock simulator or a live vision call. */
export interface RawDetection {
  summary: string;
  series: string;
  finish: string;
  doors: Omit<DetectedDoor, "id">[];
  windowCount: number;
  wetRoomCount: number;
}

let counter = 0;
function nextId(prefix: string): string {
  counter += 1;
  return `${prefix}-${Date.now().toString(36)}-${counter}`;
}

/**
 * Picks the best door handle for a given series/door-type/finish combination. Several
 * products can share a series and overlap on compatible door types (e.g. both the satin
 * and mat-black Randi Line® handles list "glat dør"), so the detected *finish* is used as
 * the primary tie-breaker to keep the whole configuration visually consistent.
 */
function findDoorHandle(series: string, doorType: string, finish: string): RandiProduct | undefined {
  const { doorHandles } = getCatalog();
  const inSeries = doorHandles.filter((p) => p.series === series);
  return (
    inSeries.find((p) => p.finish === finish && p.compatibleDoorTypes?.includes(doorType)) ??
    inSeries.find((p) => p.finish === finish) ??
    inSeries.find((p) => p.compatibleDoorTypes?.includes(doorType)) ??
    inSeries[0]
  );
}

function findWindowHandle(series: string, finish: string): RandiProduct | undefined {
  const { windowHandles } = getCatalog();
  const inSeries = windowHandles.filter((p) => p.matchesDoorSeries?.includes(series));
  return inSeries.find((p) => p.finish === finish) ?? inSeries[0] ?? windowHandles[0];
}

function findAccessory(category: string, series: string, finish: string): RandiProduct | undefined {
  const { accessories } = getCatalog();
  const candidates = accessories.filter((p) => p.category === category);
  const inSeries = candidates.filter((p) => p.matchesDoorSeries?.includes(series));
  if (inSeries.length > 0) {
    return inSeries.find((p) => p.finish === finish) ?? inSeries[0];
  }
  // Category is series-restricted (e.g. rosettes) and nothing matches this series — better to
  // skip the cross-sell than recommend a mismatched finish/series accessory.
  const isSeriesRestricted = candidates.some((p) => (p.matchesDoorSeries?.length ?? 0) > 0);
  if (isSeriesRestricted) return undefined;
  return candidates.find((p) => p.finish === finish) ?? candidates[0];
}

/**
 * Cross-sell rule set: given the total door count and finish/series, decide which
 * complementary Randi products to auto-add and in what quantity. This is the core
 * "automatisk cross-selling" logic requested for the MVP.
 */
function buildCrossSell(
  series: string,
  finish: string,
  totalDoorCount: number,
  windowCount: number,
  wetRoomCount: number
): ConfiguredLineItem[] {
  const items: ConfiguredLineItem[] = [];

  const windowHandle = findWindowHandle(series, finish);
  if (windowHandle && windowCount > 0) {
    items.push({
      product: windowHandle,
      quantity: windowCount,
      reason: `Matcher ${series} dørserien – tilføjet til ${windowCount} registrerede vinduer.`,
    });
  }

  const rosette = findAccessory("rosette", series, finish);
  if (rosette) {
    items.push({
      product: rosette,
      quantity: totalDoorCount,
      reason: "Matchende rosetter anbefales til alle dørgreb i samme finish.",
    });
  }

  const closer = findAccessory("dørlukker", series, finish);
  const closerQty = Math.max(1, Math.round(totalDoorCount * 0.25));
  if (closer) {
    items.push({
      product: closer,
      quantity: closerQty,
      reason: "Dørlukkere anbefales til hoved- og branddøre (ca. 25% af det samlede antal).",
    });
  }

  const stopper = findAccessory("dørstopper", series, finish);
  if (stopper) {
    items.push({
      product: stopper,
      quantity: totalDoorCount,
      reason: "Dørstoppere beskytter vægge og gulve ved alle nye dørgreb.",
    });
  }

  if (wetRoomCount > 0) {
    const { sanitaryProducts } = getCatalog();
    for (const sub of sanitaryProducts) {
      items.push({
        product: sub,
        quantity: wetRoomCount,
        reason: `Sanitetsudstyr anbefalet til ${wetRoomCount} registrerede baderum/toiletter.`,
      });
    }
  }

  return items;
}

/**
 * When the user starts the configurator from a specific product page ("Brug i
 * AI-konfigurator"), the chosen series/finish should win over whatever the AI/mock
 * detection would otherwise have picked — the door-type/count detection from the photo is
 * still useful, but the *product line* is now the user's explicit choice.
 */
export interface ProductPreference {
  series: string;
  finish: string;
  productName: string;
}

export function buildAnalysisResult(
  detection: RawDetection,
  sourceFileName: string,
  source: AnalysisSource,
  preference?: ProductPreference
): AnalysisResult {
  const series = preference?.series ?? detection.series;
  const finish = preference?.finish ?? detection.finish;

  const detectedDoors: DetectedDoor[] = detection.doors.map((d) => ({
    ...d,
    id: nextId("door"),
  }));

  const totalDoorCount = detectedDoors.reduce((sum, d) => sum + d.estimatedCount, 0);

  const doorLineItemsMap = new Map<string, ConfiguredLineItem>();
  for (const door of detectedDoors) {
    const handle = findDoorHandle(series, door.doorType, finish);
    if (!handle) continue;
    const doorReason = `"${door.label}" (${door.doorType}, ${door.colorTone.toLowerCase()})`;
    const existing = doorLineItemsMap.get(handle.id);
    if (existing) {
      existing.quantity += door.estimatedCount;
      existing.reason = `Foreslået til ${existing.reason
        .replace(/^Foreslået til /, "")
        .replace(/\.$/, "")}, ${doorReason}.`;
    } else {
      doorLineItemsMap.set(handle.id, {
        product: handle,
        quantity: door.estimatedCount,
        reason: `Foreslået til ${doorReason}.`,
      });
    }
  }
  const doorLineItems = Array.from(doorLineItemsMap.values());

  const crossSellLineItems = buildCrossSell(
    series,
    finish,
    totalDoorCount,
    detection.windowCount,
    detection.wetRoomCount
  );

  const totals = computeTotals([...doorLineItems, ...crossSellLineItems]);

  const summary = preference
    ? `Konfigureret ud fra dit valgte produkt (${preference.productName}). ${detection.summary}`
    : detection.summary;

  return {
    id: nextId("analysis"),
    createdAt: new Date().toISOString(),
    sourceFileName,
    source,
    summary,
    recommendedSeries: series,
    detectedDoors,
    doorLineItems,
    crossSellLineItems,
    totals,
  };
}
