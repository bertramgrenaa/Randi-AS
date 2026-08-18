import type { DoorTypeKey } from "@/data/randi-real-products";

/**
 * Real-photo door-type classification.
 *
 * This app doesn't have a real image-generation/editing model wired in (see the note below), so
 * it can't composite the user's exact door with a chosen handle. What it CAN do honestly is
 * genuinely analyse the uploaded photo: decode it onto a small canvas and compare its average
 * colour warmth (red channel minus blue channel) against the two door types this demo has real
 * before/after composites for. This is real pixel analysis, not a canned/random result — the
 * white-door reference photo averages to a near-neutral grey (warmth ~1), the oak-door reference
 * photo averages to a clearly warm tone (warmth ~30-31), verified empirically against both
 * source photos with a wide safety margin either side of the threshold below. It only
 * distinguishes between these two specific door types, so it's surfaced to the user as exactly
 * that (see the "genkendt ud fra farvetone" copy in ResultStage), not sold as general vision AI.
 *
 * A production build wiring in a real image-generation API (OpenAI's image-edit/inpaint API,
 * Google's Gemini image editing, etc.) would replace this whole module with an actual
 * composited-image call — at that point door-type classification becomes unnecessary, since the
 * model can render the chosen handle directly onto the user's own photo.
 */
export interface ClassifyDoorPhotoResult {
  doorType: DoorTypeKey;
  warmth: number;
}

const WARMTH_THRESHOLD = 15;

export function classifyDoorPhoto(dataUrl: string): Promise<ClassifyDoorPhotoResult> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const size = 32;
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve({ doorType: "hvid", warmth: 0 });
        return;
      }
      ctx.drawImage(img, 0, 0, size, size);
      const data = ctx.getImageData(0, 0, size, size).data;
      let rSum = 0;
      let bSum = 0;
      let n = 0;
      for (let i = 0; i < data.length; i += 4) {
        rSum += data[i];
        bSum += data[i + 2];
        n++;
      }
      const warmth = rSum / n - bSum / n;
      resolve({ doorType: warmth > WARMTH_THRESHOLD ? "trae" : "hvid", warmth });
    };
    img.onerror = () => resolve({ doorType: "hvid", warmth: 0 });
    img.src = dataUrl;
  });
}
