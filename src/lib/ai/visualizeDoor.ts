import type { RandiProduct } from "@/data/randi-real-products";

/**
 * AI visualization abstraction.
 *
 * The rest of the app only ever calls `visualizeDoor()` — it never talks to an image model
 * directly. That keeps the provider swappable: today `mockProvider` below simulates a result
 * client-side (a placement heuristic + an illustrated handle overlay); a production build can
 * swap in `createOpenAIImageProvider()` / `createGoogleImageProvider()` (stubbed further down)
 * or any other image-editing/compositing service without touching a single UI component.
 */

export interface VisualizeDoorInput {
  /** The user's uploaded photo as a data URL. */
  imageDataUrl: string;
  imageWidth: number;
  imageHeight: number;
  selectedProduct: RandiProduct;
}

export interface HandlePlacement {
  /** Normalized (0–1) position of the handle's pivot point within the source image. */
  xPct: number;
  yPct: number;
  /** Normalized handle height relative to image height. */
  scalePct: number;
  /** Rotation in degrees, for doors photographed at an angle. */
  rotationDeg: number;
}

export interface VisualizeDoorResult {
  provider: "mock-heuristic" | "openai-images" | "google-imagen";
  /** True whenever the result is a client-side simulation rather than a generated image. */
  isSimulated: true;
  placement: HandlePlacement;
  /** The exact captions the UI showed while "processing" — kept here so result + process stay in sync. */
  narrative: string[];
}

export type VisualizeDoorFn = (input: VisualizeDoorInput) => Promise<VisualizeDoorResult>;

/**
 * Mock/simulation provider used by this prototype. It does not call any image-generation API —
 * it derives a plausible handle placement from simple photo-geometry heuristics (doors are
 * usually taller than wide, and a lever handle sits roughly 40–46% up from the bottom on the
 * side furthest from the hinge) and hands that back for the UI to composite an illustrated
 * overlay onto the photo with CSS. The processing narrative describes what a *real* vision +
 * generation pipeline would do at each step — the simulation is honest about being a
 * simulation (see `isSimulated`), it just doesn't fabricate a fake "AI-generated" photo.
 */
export const mockVisualizeDoor: VisualizeDoorFn = async ({ imageWidth, imageHeight }) => {
  const isPortrait = imageHeight >= imageWidth;
  const placement: HandlePlacement = isPortrait
    ? { xPct: 0.74, yPct: 0.5, scalePct: 0.16, rotationDeg: 0 }
    : { xPct: 0.68, yPct: 0.52, scalePct: 0.13, rotationDeg: 0 };

  // Simulated latency so the processing stage feels like real inference rather than an instant swap.
  await new Promise((resolve) => setTimeout(resolve, 300));

  return {
    provider: "mock-heuristic",
    isSimulated: true,
    placement,
    narrative: [
      "Analyserer dit dørbillede...",
      "Identificerer dørens geometri...",
      "Placerer det valgte Randi-greb...",
      "Klargør din visualisering...",
    ],
  };
};

/**
 * Production stub — wire this up to an OpenAI image-edit/inpaint call once a key is available.
 * Signature-compatible with `VisualizeDoorFn` so swapping the active provider is a one-line
 * change in `getVisualizeDoorProvider()` below.
 */
export function createOpenAIImageProvider(apiKey: string): VisualizeDoorFn {
  return async () => {
    throw new Error(
      `OpenAI image provider not implemented in this prototype (key present: ${Boolean(apiKey)}) — plug in a real image-edit call here.`
    );
  };
}

/** Production stub — same idea, for Google's image generation/editing APIs. */
export function createGoogleImageProvider(apiKey: string): VisualizeDoorFn {
  return async () => {
    throw new Error(
      `Google image provider not implemented in this prototype (key present: ${Boolean(apiKey)}) — plug in a real image-edit call here.`
    );
  };
}

/**
 * Single seam the UI calls through. Swap the returned provider (e.g. based on an env var) to
 * change how visualizations are produced without changing any calling code.
 */
export function getVisualizeDoorProvider(): VisualizeDoorFn {
  return mockVisualizeDoor;
}
