import { getAllProducts } from "./catalog";
import type { RandiProduct } from "@/types/catalog";

/** Curated metadata for each product series/brand shown under Produkter. */
export interface SeriesInfo {
  slug: string;
  name: string;
  tagline: string;
  description: string;
}

export const SERIES: SeriesInfo[] = [
  {
    slug: "randi-line",
    name: "Randi Line®",
    tagline: "Skandinavisk design i stål, sort og messing",
    description:
      "Randi Lines gennemgående designsprog spænder fra børstet rustfrit stål og mat sort til varm børstet messing — dørgreb, paskvilgreb og tilbehør i ét sammenhængende udtryk.",
  },
  {
    slug: "novo-line",
    name: "Novo Line",
    tagline: "Slidstærkt og prisbevidst til høj volumen",
    description:
      "Novo Line er det robuste, budgetvenlige valg til skoler, institutioner og erhvervsbyggeri med mange ensartede døre.",
  },
  {
    slug: "randi-sanitet",
    name: "Randi Sanitet",
    tagline: "Sæbedispensere, papirholdere og tilbehør til bad",
    description:
      "Sanitetsserien i rustfrit stål og hvid til offentlige toiletter og baderum — designet til dagligt erhvervsbrug.",
  },
  {
    slug: "randi-tilbehor",
    name: "Randi Tilbehør",
    tagline: "Dørlukkere, rosetter og dørstoppere",
    description:
      "Det komplette tilbehørsprogram, der færdiggør enhver dørløsning — matchende rosetter, dørlukkere og dørstoppere.",
  },
];

export function getSeriesBySlug(slug: string): SeriesInfo | undefined {
  return SERIES.find((s) => s.slug === slug);
}

export function getSeriesSlugForName(seriesName: string): string {
  return SERIES.find((s) => s.name === seriesName)?.slug ?? SERIES[0].slug;
}

export function getProductsForSeries(seriesName: string): RandiProduct[] {
  return getAllProducts().filter((p) => p.series === seriesName);
}

/** One representative product per series, used for card thumbnails. */
export function getSeriesCover(seriesName: string): RandiProduct | undefined {
  return getProductsForSeries(seriesName)[0];
}
