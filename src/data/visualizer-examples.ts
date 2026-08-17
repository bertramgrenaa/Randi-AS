/**
 * Curated real-photo before/after examples for the visualizer's catalogue page.
 *
 * These "after" photos are AI-composited (generated externally by the user via a consumer
 * image-editing model, not by this app) — they are NOT actual Randi product photography, and
 * the product numbers below are exactly as supplied when the images were generated, not
 * verified against randi.dk in this prototype. They exist to demonstrate, with a convincing
 * real photo instead of an illustration, what a genuine AI-compositing pipeline (see
 * `visualizeDoor()`) would produce once wired to a real image-generation provider — the
 * user-upload flow elsewhere in the app still uses the honestly-labelled illustrated overlay,
 * since there is no real vision/generation model behind it in this environment.
 */

export interface VisualizerExample {
  id: string;
  doorLabel: string;
  productNumber: string;
  beforeSrc: string;
  afterSrc: string;
  /** "width/height" of the source photo, so the compare frame matches it exactly (no cropping). */
  aspectRatio: string;
}

export const VISUALIZER_EXAMPLES: VisualizerExample[] = [
  {
    id: "hvid-1010-90",
    doorLabel: "Hvid fyldningsdør",
    productNumber: "1010.90",
    beforeSrc: "/visualizer-examples/hvid-dor-foer.png",
    afterSrc: "/visualizer-examples/hvid-dor-efter-1010-90.png",
    aspectRatio: "257/720",
  },
  {
    id: "hvid-1068",
    doorLabel: "Hvid fyldningsdør",
    productNumber: "1068.00",
    beforeSrc: "/visualizer-examples/hvid-dor-foer.png",
    afterSrc: "/visualizer-examples/hvid-dor-efter-1068.png",
    aspectRatio: "257/720",
  },
  {
    id: "trae-1070-60",
    doorLabel: "Egetræsdør",
    productNumber: "1070.60 PVD",
    beforeSrc: "/visualizer-examples/trae-dor-foer.png",
    afterSrc: "/visualizer-examples/trae-dor-efter-1070-60.png",
    aspectRatio: "248/619",
  },
  {
    id: "trae-1061",
    doorLabel: "Egetræsdør",
    productNumber: "1061.00",
    beforeSrc: "/visualizer-examples/trae-dor-foer.png",
    afterSrc: "/visualizer-examples/trae-dor-efter-1061.png",
    aspectRatio: "248/619",
  },
];
