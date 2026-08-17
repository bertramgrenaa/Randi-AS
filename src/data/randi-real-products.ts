/**
 * Real Randi A/S product reference data.
 *
 * Sourced from randi.dk product pages and third-party retailer/design listings that mirror
 * them (larsvejen.dk, cfmoller.com, villahus.com, williams-ironmongery.co.uk) — direct fetches
 * to randi.dk itself were blocked by this environment's network egress, so this was compiled
 * from indexed search snippets rather than a live crawl. Product numbers, series names,
 * designers, materials and technical facts (spindle sizes, door-thickness ranges, standards)
 * reflect what those sources state. Nothing here is invented.
 *
 * Prices, CO2e and weight are NOT public on randi.dk and are explicitly marked as demo values
 * (see `isDemo` flags) — replace with Randi's real ERP price feed and LCA/EPD data.
 *
 * Product photography is not reproduced here (no verified licence to embed it in this
 * prototype) — `illustration` instead points at an original line-art rendering keyed to the
 * product's real silhouette and finish, built in <HandleIllustration />.
 */

export type FinishFamily = "steel" | "black-pvd" | "brass-pvd" | "copper-pvd" | "polished-brass";

export interface DemoValue {
  value: number;
  isDemo: true;
  note: "Demo data – replace with Randi LCA/product data";
}

export interface SustainabilityAttribute {
  label: string;
  detail: string;
}

export type HandleSilhouette = "nordic-straight" | "wing" | "kome" | "solid-16mm" | "classic-hollow";

export interface RandiProduct {
  id: string;
  productNumber: string;
  name: string;
  series: "Randi-Line®" | "Randi-Line® Design";
  category: "Dørgreb" | "Vinduesgreb";
  silhouette: HandleSilhouette;
  finish: string;
  finishFamily: FinishFamily;
  materials: string;
  designer?: string;
  designerNote?: string;
  description: string;
  diameterMm?: number;
  doorThicknessOptions?: string[];
  spindleOptions?: string[];
  standards?: string[];
  priceDKK: DemoValue;
  co2eKg: DemoValue;
  weightG: DemoValue;
  sustainabilityAttributes: SustainabilityAttribute[];
  recommendedAlternativeIds: string[];
  sourceUrls: string[];
}

function demo(value: number): DemoValue {
  return { value, isDemo: true, note: "Demo data – replace with Randi LCA/product data" };
}

export const RANDI_SERIES_INFO = {
  founded: 1878,
  origin: "Randers, Danmark",
  heritage:
    "Randi har siden 1878 støbt dørgreb i rustfrit stål og messing fra det første værksted i Randers, og er i dag et af Skandinaviens mest anvendte navne inden for arkitektonisk beslag.",
  lines: [
    {
      name: "Randi-Line®",
      description:
        "Det komplette moderne sortiment af dørgreb og beslag i rustfrit stål, udviklet til funktion, holdbarhed og enkelt design.",
    },
    {
      name: "Randi-Line® Design",
      description:
        "PVD-overfladebehandlede varianter af Randi-Line® (børstet messing, kobber, sort) — udviklet til høj slidstyrke og korrosionsbestandighed.",
    },
  ],
};

export const RANDI_PRODUCTS: RandiProduct[] = [
  {
    id: "nordic-1078-00",
    productNumber: "1078.00",
    name: "Randi-Line® Nordic Straight",
    series: "Randi-Line®",
    category: "Dørgreb",
    silhouette: "nordic-straight",
    finish: "Børstet rustfrit stål + birkebark",
    finishFamily: "steel",
    materials: "Rustfrit stål (satin) med indlæg af birkebark",
    designer: "Lars Vejen / Njordrum",
    designerNote:
      "Formgivet omkring naturens egen intelligens — en simpel geometrisk form, hvor birkebarken både er materiale og funktion.",
    description:
      "Nordic er en komposition af enkle geometriske former og naturmaterialer. Indlægget er birkebark, som er naturligt antibakterielt og gør grebet modstandsdygtigt over for bakterier — særligt relevant på kontaktflader mange rører ved dagligt.",
    diameterMm: 19,
    doorThicknessOptions: ["34–46 mm", "47–58 mm", "59–70 mm", "71–82 mm"],
    spindleOptions: ["8×8 mm"],
    standards: ["DS/EN 1906:2012", "DS/EN 179:2008"],
    priceDKK: demo(1290),
    co2eKg: demo(4.8),
    weightG: demo(410),
    sustainabilityAttributes: [
      { label: "Birkebark", detail: "Naturligt antibakterielt materiale — reducerer bakterievækst på kontaktfladen." },
      { label: "Fornybart indlæg", detail: "Birkebark er et biobaseret restmateriale fra skovbrug, i modsætning til rent metal/plast." },
    ],
    recommendedAlternativeIds: ["nordic-1078-20", "kome-1073-00"],
    sourceUrls: ["https://www.randi.dk/en/assortment/1078-00/", "https://www.larsvejen.dk/portfolio/nordic-straight-door-handle/"],
  },
  {
    id: "nordic-1078-20",
    productNumber: "1078.20",
    name: "Randi-Line® Nordic Straight PVD",
    series: "Randi-Line® Design",
    category: "Dørgreb",
    silhouette: "nordic-straight",
    finish: "PVD-behandlet stål + birkebark",
    finishFamily: "black-pvd",
    materials: "PVD-overfladebehandlet rustfrit stål med indlæg af birkebark",
    designer: "Lars Vejen / Njordrum",
    description:
      "Samme Nordic-formsprog som 1078.00, men med Randi-Line® Design PVD-overfladebehandling for øget slidstyrke og korrosionsbestandighed — velegnet til udsatte indgangspartier.",
    diameterMm: 19,
    doorThicknessOptions: ["34–46 mm", "47–58 mm", "59–70 mm", "71–82 mm"],
    spindleOptions: ["8×8 mm"],
    standards: ["DS/EN 1906:2012", "DS/EN 179:2008"],
    priceDKK: demo(1590),
    co2eKg: demo(5.6),
    weightG: demo(410),
    sustainabilityAttributes: [
      { label: "Birkebark", detail: "Naturligt antibakterielt materiale — reducerer bakterievækst på kontaktfladen." },
      { label: "PVD-levetid", detail: "PVD-behandlingen forlænger overfladens levetid og reducerer behov for udskiftning." },
    ],
    recommendedAlternativeIds: ["nordic-1078-00"],
    sourceUrls: ["https://www.randi.dk/en/randi-line-design-pvd-surface-treatment/"],
  },
  {
    id: "wing-1074-00",
    productNumber: "1074.00",
    name: "Randi-Line® Wing",
    series: "Randi-Line®",
    category: "Dørgreb",
    silhouette: "wing",
    finish: "Børstet rustfrit stål",
    finishFamily: "steel",
    materials: "Rustfrit stål (satin), AISI 304",
    designer: "AART Designers",
    designerNote: "Prisvindende design, der refererer til formen på en flyvinge.",
    description:
      "Wing er et elegant Ø19 mm greb, hvis stramme, bøjede linje er inspireret af en flyvinges profil. Leveres parvis til dørtykkelse 40 mm, 34–58 mm eller 58–82 mm.",
    diameterMm: 19,
    doorThicknessOptions: ["40 mm", "34–58 mm", "58–82 mm"],
    standards: [],
    priceDKK: demo(950),
    co2eKg: demo(4.1),
    weightG: demo(380),
    sustainabilityAttributes: [],
    recommendedAlternativeIds: ["wing-1074-90", "wing-1074-20"],
    sourceUrls: ["https://www.randi.dk/en/assortment/1074-00/", "https://williams-ironmongery.co.uk/portfolio-items/1074/"],
  },
  {
    id: "wing-1074-90",
    productNumber: "1074.90",
    name: "Randi-Line® Wing",
    series: "Randi-Line®",
    category: "Dørgreb",
    silhouette: "wing",
    finish: "Poleret messing",
    finishFamily: "polished-brass",
    materials: "Messing, poleret",
    designer: "AART Designers",
    description:
      "Wing-grebet i poleret messing — et varmt, klassisk udtryk der bevarer det samme aerodynamisk inspirerede formsprog som stål-varianten.",
    diameterMm: 19,
    doorThicknessOptions: ["40 mm", "34–58 mm", "58–82 mm"],
    priceDKK: demo(1190),
    co2eKg: demo(5.3),
    weightG: demo(395),
    sustainabilityAttributes: [],
    recommendedAlternativeIds: ["wing-1074-00"],
    sourceUrls: ["https://ca.pinterest.com/pin/1060034831037618053/"],
  },
  {
    id: "wing-1074-20",
    productNumber: "1074.20",
    name: "Randi-Line® Wing PVD",
    series: "Randi-Line® Design",
    category: "Dørgreb",
    silhouette: "wing",
    finish: "Sort PVD",
    finishFamily: "black-pvd",
    materials: "PVD-overfladebehandlet stål",
    designer: "AART Designers",
    description:
      "Wing i sort PVD — en mørk, mat variant til moderne facader, med samme slidstyrke-fordele som Randi-Line® Design-serien.",
    diameterMm: 19,
    doorThicknessOptions: ["40 mm", "34–58 mm", "58–82 mm"],
    priceDKK: demo(1290),
    co2eKg: demo(5.0),
    weightG: demo(380),
    sustainabilityAttributes: [],
    recommendedAlternativeIds: ["wing-1074-00"],
    sourceUrls: ["https://www.villahus.com/shop/113-black-door-handles/4383-randi-door-handle---wing---black-pvd---model-1074/"],
  },
  {
    id: "kome-1073-00",
    productNumber: "1073.00",
    name: "Randi-Line® Komé",
    series: "Randi-Line®",
    category: "Dørgreb",
    silhouette: "kome",
    finish: "Børstet rustfrit stål",
    finishFamily: "steel",
    materials: "Rustfrit stål (satin)",
    designer: "C.F. Møller Architects",
    designerNote:
      "Grundlagt i arkitektur, funktion og ergonomi — lodrette kanter og skrående flader giver et markant, men roligt udtryk.",
    description:
      "Komé er et symmetrisk, ergonomisk greb tegnet som en komplet serie: dørgreb, vridere, rosetter og langskilte i ét sammenhængende formsprog, der underordner sig arkitekturens linjer.",
    diameterMm: 19,
    standards: [],
    priceDKK: demo(1450),
    co2eKg: demo(4.9),
    weightG: demo(420),
    sustainabilityAttributes: [],
    recommendedAlternativeIds: ["nordic-1078-00", "kome-rw1073"],
    sourceUrls: ["https://www.randi.dk/en/assortment/1073-00/", "https://www.cfmoller.com/p/Randi-Line-Kome-i2308.html"],
  },
  {
    id: "kome-rw1073",
    productNumber: "RW1073",
    name: "Randi-Line® Komé vinduesgreb",
    series: "Randi-Line®",
    category: "Vinduesgreb",
    silhouette: "kome",
    finish: "Børstet rustfrit stål",
    finishFamily: "steel",
    materials: "Rustfrit stål (satin)",
    designer: "C.F. Møller Architects",
    description:
      "Krum Komé-paskvilgreb til vinduer, der matcher dørserien i samme formsprog. Randi-Line® vinduesgreb fås som standard med 35 og 43 mm spindellængde.",
    spindleOptions: ["7×7 mm", "8×8 mm"],
    priceDKK: demo(495),
    co2eKg: demo(1.4),
    weightG: demo(160),
    sustainabilityAttributes: [],
    recommendedAlternativeIds: ["kome-1073-00"],
    sourceUrls: ["https://www.villahus.com/shop/62-espagnolette---patio/3825-cranked-randi-linereg-kome-window-handle-left-oe14-mm-solid/"],
  },
  {
    id: "solid-1060-00",
    productNumber: "1060.00",
    name: "Randi-Line® 1060",
    series: "Randi-Line®",
    category: "Dørgreb",
    silhouette: "solid-16mm",
    finish: "Børstet rustfrit stål",
    finishFamily: "steel",
    materials: "Rustfrit stål (satin), AISI 304",
    designer: "C.F. Møller Architects",
    description:
      "Et massivt 16 mm greb, tegnet som en komplet designlinje af C.F. Møller Architects. Leveres parvis til dørtykkelse 40 mm, 34–58 mm eller 58–82 mm.",
    doorThicknessOptions: ["40 mm", "34–58 mm", "58–82 mm"],
    spindleOptions: ["8×8 mm", "9×9 mm"],
    standards: ["DS/EN 1906:2012", "DIN 18273:2015-07"],
    priceDKK: demo(890),
    co2eKg: demo(3.9),
    weightG: demo(350),
    sustainabilityAttributes: [],
    recommendedAlternativeIds: ["kome-1073-00", "nordic-1078-00"],
    sourceUrls: ["https://www.randi.dk/en/assortment/1060-00/"],
  },
  {
    id: "classic-1021-00",
    productNumber: "1021.00",
    name: "Randi-Line® 1021",
    series: "Randi-Line®",
    category: "Dørgreb",
    silhouette: "classic-hollow",
    finish: "Børstet rustfrit stål",
    finishFamily: "steel",
    materials: "Rustfrit stål (satin), AISI 304",
    description:
      "Et lige, klassisk Ø19 mm greb i hult design. Leveres parvis til dørtykkelse 40 mm, 34–58 mm eller 58–82 mm.",
    diameterMm: 19,
    doorThicknessOptions: ["40 mm", "34–58 mm", "58–82 mm"],
    spindleOptions: ["8×8 mm", "9×9 mm"],
    standards: ["DS/EN 1906:2012", "DIN 18273:2015-07"],
    priceDKK: demo(650),
    co2eKg: demo(3.2),
    weightG: demo(310),
    sustainabilityAttributes: [],
    recommendedAlternativeIds: ["classic-1021-20", "solid-1060-00"],
    sourceUrls: ["https://www.randi.dk/en/assortment/1021-00/"],
  },
  {
    id: "classic-1021-20",
    productNumber: "1021.20",
    name: "Randi-Line® 1021 PVD",
    series: "Randi-Line® Design",
    category: "Dørgreb",
    silhouette: "classic-hollow",
    finish: "Sort PVD",
    finishFamily: "black-pvd",
    materials: "PVD-overfladebehandlet stål",
    description: "1021 i sort PVD-overfladebehandling — samme klassiske form, mørkt og mat udtryk.",
    diameterMm: 19,
    doorThicknessOptions: ["40 mm", "34–58 mm", "58–82 mm"],
    spindleOptions: ["8×8 mm", "9×9 mm"],
    priceDKK: demo(890),
    co2eKg: demo(3.8),
    weightG: demo(310),
    sustainabilityAttributes: [],
    recommendedAlternativeIds: ["classic-1021-00"],
    sourceUrls: ["https://www.randi.dk/en/assortment/1021-20-pvd-coated/"],
  },
];

export function getProductById(id: string): RandiProduct | undefined {
  return RANDI_PRODUCTS.find((p) => p.id === id);
}

export function getAlternatives(product: RandiProduct): RandiProduct[] {
  return product.recommendedAlternativeIds
    .map((id) => getProductById(id))
    .filter((p): p is RandiProduct => Boolean(p));
}

export function getDoorHandles(): RandiProduct[] {
  return RANDI_PRODUCTS.filter((p) => p.category === "Dørgreb");
}
