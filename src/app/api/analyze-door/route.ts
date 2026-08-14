import { NextRequest, NextResponse } from "next/server";
import { buildAnalysisResult } from "@/lib/matching-engine";
import { mockVisionAnalysis, tryLiveVisionAnalysis } from "@/lib/vision-analysis";
import type { AnalysisSource } from "@/types/analysis";

export const runtime = "nodejs";

/**
 * POST /api/analyze-door
 *
 * Accepts multipart/form-data with:
 *  - file: image or PDF of a door / door schedule (required)
 *  - notes: optional free-text context from the user
 *
 * Runs (or simulates) computer-vision door detection, matches the result against the
 * Randi product catalog, and returns a full AnalysisResult including cross-sell items,
 * pricing and EPD/CO2e totals.
 */
export async function POST(request: NextRequest) {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "Kunne ikke læse den uploadede fil. Prøv igen." },
      { status: 400 }
    );
  }

  const file = formData.get("file");
  const notes = String(formData.get("notes") ?? "");

  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json(
      { error: "Mangler fil. Upload et billede eller PDF af døren/dørskemaet." },
      { status: 400 }
    );
  }

  const MAX_SIZE = 15 * 1024 * 1024;
  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: "Filen er for stor. Maks. 15 MB pr. upload." },
      { status: 400 }
    );
  }

  const seed = `${file.name}-${file.size}-${notes}`;
  let source: AnalysisSource = "mock-simulation";
  let detection = null;

  if (file.type.startsWith("image/")) {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const base64 = Buffer.from(arrayBuffer).toString("base64");
      const live = await tryLiveVisionAnalysis(base64, file.type, notes);
      if (live) {
        detection = live;
        source = "claude-vision";
      }
    } catch (err) {
      console.error("Live vision analysis failed, falling back to simulation", err);
    }
  }

  if (!detection) {
    detection = mockVisionAnalysis(seed);
  }

  try {
    const result = buildAnalysisResult(detection, file.name, source);
    return NextResponse.json(result);
  } catch (err) {
    console.error("Failed to build analysis result", err);
    return NextResponse.json(
      { error: "Analysen fejlede under matchning mod produktkataloget." },
      { status: 500 }
    );
  }
}
