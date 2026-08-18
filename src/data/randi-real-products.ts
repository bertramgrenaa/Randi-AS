/**
 * Real Randi A/S product reference data for the visual configurator demo.
 *
 * This demo is deliberately trimmed to 4 door handles, each backed by a real AI-composited
 * before/after photo pair supplied by the user (via a consumer image-editing model, not by this
 * app) for BOTH reference door types below — so any of the 4 handles can be shown on either
 * door, and any door photo a user uploads works with any handle. 1078.00 is Randi-Line® Nordic
 * Straight, independently researched from randi.dk and designer sources (see `verified: true`
 * and `standards`); the other three product numbers/finishes are exactly as supplied with their
 * reference photos and are NOT independently verified against randi.dk in this prototype.
 *
 * Product photography is the user-supplied reference photos (not scraped/reproduced randi.dk
 * photography) — `handlePhoto` is a clean product-only crop, `afterSrc` are the composited
 * before/after pairs used in the visualizer result.
 *
 * Prices, CO2e are NOT public and are explicitly marked as demo values (see `isDemo` flags) —
 * replace with Randi's real ERP price feed and LCA/EPD data. `co2Note` is a short, honestly
 * hedged explanation of the *direction* the real number would likely move in and why (grounded
 * in genuine, cited sustainability research — see co2Note text) — not a fabricated calculation.
 */

export interface DemoValue {
  value: number;
  isDemo: true;
  note: "Demo data – replace with Randi LCA/product data";
}

function demo(value: number): DemoValue {
  return { value, isDemo: true, note: "Demo data – replace with Randi LCA/product data" };
}

export type DoorTypeKey = "hvid" | "trae";

export interface DoorTypeInfo {
  key: DoorTypeKey;
  label: string;
  beforeSrc: string;
  aspectRatio: string;
}

export const DOOR_TYPES: Record<DoorTypeKey, DoorTypeInfo> = {
  hvid: {
    key: "hvid",
    label: "Hvid fyldningsdør",
    beforeSrc: "/visualizer-examples/hvid-dor-foer.png",
    aspectRatio: "257 / 720",
  },
  trae: {
    key: "trae",
    label: "Egetræsdør",
    beforeSrc: "/visualizer-examples/trae-dor-foer.png",
    aspectRatio: "248 / 619",
  },
};

export interface RandiInsight {
  title: string;
  body: string;
}

export interface RandiHandleProduct {
  id: string;
  kind: "handle";
  productNumber: string;
  name: string;
  finish: string;
  designer?: string;
  description?: string;
  standards?: string[];
  /** True only for products independently researched against randi.dk/designer sources. */
  verified: boolean;
  handlePhoto: string;
  afterSrc: Record<DoorTypeKey, string>;
  priceDKK: DemoValue;
  co2eKg: DemoValue;
  co2Note: string;
  insight: RandiInsight;
}

export const RANDI_PRODUCTS: RandiHandleProduct[] = [
  {
    id: "1078-00",
    kind: "handle",
    productNumber: "1078.00",
    name: "Randi-Line® Nordic Straight",
    finish: "Børstet rustfrit stål + birkebark",
    designer: "Lars Vejen / Njordrum",
    description:
      "Nordic er en komposition af enkle geometriske former og naturmaterialer. Indlægget er birkebark, som traditionelt er brugt i nordisk folkemedicin for sine antiseptiske egenskaber.",
    standards: ["DS/EN 1906:2012", "DS/EN 179:2008"],
    verified: true,
    handlePhoto: "/visualizer-examples/handle-1078.png",
    afterSrc: {
      hvid: "/visualizer-examples/hvid-dor-efter-1078.png",
      trae: "/visualizer-examples/trae-dor-efter-1078.png",
    },
    priceDKK: demo(1290),
    co2eKg: demo(4.8),
    co2Note:
      "Hovedparten af aftrykket for dette greb kommer fra den rustfrie stålkonstruktion — smelteprocessen for stål er energitung. Birkebark-indlægget er et biobaseret restmateriale fra skovbrug og bidrager markant mindre end hvis hele grebet var støbt i metal, hvilket trækker totalen en smule ned sammenlignet med et fuldt metalgreb i samme størrelse.",
    insight: {
      title: "Hvorfor birkebark?",
      body: "Birkebark indeholder betulin, et stof med dokumenteret antibakteriel effekt over for flere bakterietyper i laboratorieforsøg, og har en lang tradition i nordisk folkemedicin som sårplaster og antiseptisk middel. Det gør ikke i sig selv grebet til en klinisk testet antibakteriel kontaktflade — det er ikke undersøgt på samme måde som f.eks. antimikrobielle kobberoverflader — men birkebark er et biobaseret restmateriale fra skovbrug: et fornybart alternativ til at støbe hele grebet i metal eller plast.",
    },
  },
  {
    id: "1010-90",
    kind: "handle",
    productNumber: "1010.90",
    name: "Randi 1010.90",
    finish: "Poleret messing",
    verified: false,
    handlePhoto: "/visualizer-examples/handle-1010-90.png",
    afterSrc: {
      hvid: "/visualizer-examples/hvid-dor-efter-1010-90.png",
      trae: "/visualizer-examples/trae-dor-efter-1010-90.png",
    },
    priceDKK: demo(950),
    co2eKg: demo(4.1),
    co2Note:
      "Messingproduktion (kobber legeret med zink) er energikrævende, men da messing kan omsmeltes og genanvendes uden kvalitetstab, regnes en del af den indlejrede energi typisk med som \"betalt tilbage\" over flere livscyklusser, hvis metallet holdes i kredsløb frem for at ende som affald.",
    insight: {
      title: "Messing kan genanvendes i det uendelige",
      body: "Messing (en kobber-zink-legering) kan omsmeltes og genbruges uden at miste sine egenskaber, og det kræver typisk kun en brøkdel — i industrikilder angivet til omkring 10-15% — af den energi, det tager at fremstille ny messing fra råmaterialer. Sammen med bl.a. glas er messing et af de få materialer med reel \"closed-loop\"-genanvendelighed: det kan blive til nyt messing af samme kvalitet, igen og igen.",
    },
  },
  {
    id: "1070-60",
    kind: "handle",
    productNumber: "1070.60 PVD",
    name: "Randi 1070.60 PVD Coated",
    finish: "PVD-behandlet messing",
    verified: false,
    handlePhoto: "/visualizer-examples/handle-1070-60.png",
    afterSrc: {
      hvid: "/visualizer-examples/hvid-dor-efter-1070-60.png",
      trae: "/visualizer-examples/trae-dor-efter-1070-60.png",
    },
    priceDKK: demo(1590),
    co2eKg: demo(5.2),
    co2Note:
      "Messing-kernen bidrager på linje med andre messingprodukter, men selve PVD-behandlingen er en tør vakuumproces uden de kemiske bade og den spildevandsbelastning, traditionel galvanisering medfører — det trækker overfladebehandlingens andel af aftrykket ned sammenlignet med et lakeret eller galvaniseret greb, samtidig med at den høje slidstyrke forlænger produktets levetid.",
    insight: {
      title: "Hvorfor PVD-behandling?",
      body: "PVD (Physical Vapor Deposition) er en tør vakuumproces, hvor metal fordampes og lægges som en tynd overfladebelægning — modsat traditionel galvanisering, der bruger kemiske bade (ofte med cyanid, stærke syrer eller seksværdigt krom) og genererer spildevand, der skal renses. PVD-belægninger er generelt anerkendt i branchen for høj hårdhed og slidstyrke, hvilket forlænger produktets levetid sammenlignet med lak eller almindelig galvanisering — færre udskiftninger over tid, samme greb.",
    },
  },
  {
    id: "1061-00",
    kind: "handle",
    productNumber: "1061.00",
    name: "Randi 1061.00",
    finish: "Børstet rustfrit stål",
    verified: false,
    handlePhoto: "/visualizer-examples/handle-1061.png",
    afterSrc: {
      hvid: "/visualizer-examples/hvid-dor-efter-1061.png",
      trae: "/visualizer-examples/trae-dor-efter-1061.png",
    },
    priceDKK: demo(890),
    co2eKg: demo(3.9),
    co2Note:
      "Rustfrit ståls produktion er relativt energitung, primært fra smelteprocessen og legeringen med krom/nikkel, men da metallet kan genanvendes næsten uendeligt uden at miste styrke eller korrosionsbestandighed, og grebet har lang levetid som bygningsbeslag, er det årlige aftryk over produktets brugstid lavere end for materialer, der skal udskiftes oftere.",
    insight: {
      title: "Rustfrit stål: næsten uendeligt genanvendeligt",
      body: "Rustfrit stål (f.eks. AISI 304) kan omsmeltes og genbruges igen og igen uden at miste sin styrke eller korrosionsbestandighed. Den globale genanvendelsesrate for rustfrit stål ligger typisk over 90%, og det høje skrotværdi gør det til et af de mest reelt cirkulære metaller i byggeriet — ikke bare teoretisk genanvendeligt, men rent faktisk genanvendt i stor skala.",
    },
  },
];

export interface RandiAccessory {
  id: string;
  kind: "accessory";
  productNumber: string;
  category: string;
  name: string;
  finish: string;
  verified: boolean;
  handlePhoto: string;
  priceDKK: DemoValue;
  co2eKg: DemoValue;
}

/**
 * Complementary Randi-Line® products (window handles, escutcheons, pull handles, washroom
 * fittings) for the "Fuldend udtrykket" cross-sell section. Product numbers/finishes are as
 * supplied with the reference photos, not independently verified against randi.dk. Price/CO2e
 * follow the same demo-value convention as the door handles above.
 */
export const ACCESSORIES: RandiAccessory[] = [
  { id: "acc-1100-60", kind: "accessory", productNumber: "1100.60", category: "Toiletgarniture", name: "Randi 1100.60 PVD Coated", finish: "PVD-behandlet kobber", verified: false, handlePhoto: "/visualizer-examples/acc-1100-60.png", priceDKK: demo(450), co2eKg: demo(2.1) },
  { id: "acc-1201-90", kind: "accessory", productNumber: "1201.90", category: "Langskilt", name: "Randi 1201.90", finish: "Børstet messing", verified: false, handlePhoto: "/visualizer-examples/acc-1201-90.png", priceDKK: demo(380), co2eKg: demo(1.4) },
  { id: "acc-1534", kind: "accessory", productNumber: "1534.00", category: "Stangergreb", name: "Randi 1534.00", finish: "Poleret stål", verified: false, handlePhoto: "/visualizer-examples/acc-1534.png", priceDKK: demo(890), co2eKg: demo(3.6) },
  { id: "acc-1736-1738-90", kind: "accessory", productNumber: "1736-1738.90", category: "Vinduesgreb", name: "Randi 1736-1738.90", finish: "Poleret messing", verified: false, handlePhoto: "/visualizer-examples/acc-1736-1738-90.png", priceDKK: demo(650), co2eKg: demo(2.8) },
  { id: "acc-1746-1748-00", kind: "accessory", productNumber: "1746-1748.00", category: "Vinduesgreb", name: "Randi 1746-1748.00", finish: "Børstet stål", verified: false, handlePhoto: "/visualizer-examples/acc-1746-1748-00.png", priceDKK: demo(590), co2eKg: demo(2.5) },
  { id: "acc-1768-1770-00", kind: "accessory", productNumber: "1768-1770.00", category: "Vinduesgreb", name: "Randi 1768-1770.00", finish: "Børstet stål + birkebark", verified: false, handlePhoto: "/visualizer-examples/acc-1768-1770-00.png", priceDKK: demo(690), co2eKg: demo(2.6) },
  { id: "acc-2978", kind: "accessory", productNumber: "2978.X00", category: "Affaldsspand", name: "Randi 2978", finish: "Børstet rustfrit stål", verified: false, handlePhoto: "/visualizer-examples/acc-2978.png", priceDKK: demo(1290), co2eKg: demo(5.5) },
  { id: "acc-7706", kind: "accessory", productNumber: "7706", category: "Vinduesgreb", name: "Randi 7706", finish: "Poleret stål", verified: false, handlePhoto: "/visualizer-examples/acc-7706.png", priceDKK: demo(590), co2eKg: demo(2.5) },
  { id: "acc-7826-06", kind: "accessory", productNumber: "7826.06", category: "Glashylde", name: "Randi 7826.06", finish: "Glas + børstet stål", verified: false, handlePhoto: "/visualizer-examples/acc-7826-06.png", priceDKK: demo(750), co2eKg: demo(3.2) },
  { id: "acc-p3520-90", kind: "accessory", productNumber: "P3520.90", category: "Møbelgreb", name: "Randi P3520.90", finish: "Poleret messing", verified: false, handlePhoto: "/visualizer-examples/acc-p3520-90.png", priceDKK: demo(320), co2eKg: demo(1.1) },
];

export type CatalogueItem = RandiHandleProduct | RandiAccessory;

export const ALL_ITEMS: CatalogueItem[] = [...RANDI_PRODUCTS, ...ACCESSORIES];

export function getProductById(id: string): CatalogueItem | undefined {
  return ALL_ITEMS.find((p) => p.id === id);
}

export function isAccessory(item: CatalogueItem): item is RandiAccessory {
  return item.kind === "accessory";
}

/**
 * A few products (the ones without a distinct series name) have `name` set to literally
 * "Randi " + their product number, so a plain `${name} ${productNumber}` would read as e.g.
 * "Randi 1010.90 1010.90". This returns the name with the number appended only when the name
 * doesn't already contain it.
 */
export function productDisplayLabel(item: { name: string; productNumber: string }): string {
  return item.name.includes(item.productNumber) ? item.name : `${item.name} ${item.productNumber}`;
}
