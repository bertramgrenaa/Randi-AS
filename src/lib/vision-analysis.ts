import { pickScenario } from "./mock-scenarios";
import type { RawDetection } from "./matching-engine";

const VALID_SERIES = new Set(["Randi Line®", "Novo Line"]);

const VISION_SYSTEM_PROMPT = `Du er et computer vision-system der analyserer billeder af døre og dørskemaer for producenten Randi A/S.
Se på billedet og returnér UDELUKKENDE et JSON-objekt (ingen markdown, ingen forklaring) med denne struktur:
{
  "summary": "kort dansk beskrivelse af det du ser og din anbefaling",
  "series": "Randi Line®" | "Novo Line",
  "finish": "en af: Rustfrit stål (satin), Rustfrit stål (poleret), Mat sort (pulverlakeret), Børstet messing, Hvid (pulverlakeret)",
  "doors": [
    { "label": "kort navn", "doorType": "en af: glat dør, eg dør, stål dør, sort stål dør, hvid dør, træ dør, institutionsdør, moderne dør", "material": "kort", "colorTone": "kort", "estimatedCount": tal, "confidence": 0-1 }
  ],
  "windowCount": tal,
  "wetRoomCount": tal
}
Estimér antal ud fra hvad der er synligt/beskrevet. Hvis der er flere dørtyper, opret flere elementer i "doors". Vælg "Randi Line®" til premium/erhverv/renovering og "Novo Line" til budget/institution med høj volumen.`;

/**
 * Attempts a live Claude Vision analysis of the uploaded image. Returns null (never throws)
 * if no API key is configured or the call/parse fails for any reason — callers should fall
 * back to the deterministic mock simulator in that case.
 */
export async function tryLiveVisionAnalysis(
  base64Image: string,
  mimeType: string,
  notes: string
): Promise<RawDetection | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-5",
        max_tokens: 1024,
        system: VISION_SYSTEM_PROMPT,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image",
                source: { type: "base64", media_type: mimeType, data: base64Image },
              },
              {
                type: "text",
                text: notes
                  ? `Ekstra kontekst fra brugeren: ${notes}`
                  : "Analysér dette billede af en dør/dørskema.",
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) return null;
    const data = await response.json();
    const text: string | undefined = data?.content?.[0]?.text;
    if (!text) return null;

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;
    const parsed = JSON.parse(jsonMatch[0]);

    if (!VALID_SERIES.has(parsed.series) || !Array.isArray(parsed.doors)) return null;

    return {
      summary: String(parsed.summary ?? "AI-analyse af dørbillede."),
      series: parsed.series,
      finish: String(parsed.finish ?? ""),
      doors: parsed.doors.map((d: Record<string, unknown>) => ({
        label: String(d.label ?? "Dør"),
        doorType: String(d.doorType ?? "glat dør"),
        material: String(d.material ?? "Ukendt"),
        colorTone: String(d.colorTone ?? "Ukendt"),
        estimatedCount: Number(d.estimatedCount) || 1,
        confidence: Math.min(1, Math.max(0, Number(d.confidence) || 0.7)),
      })),
      windowCount: Number(parsed.windowCount) || 0,
      wetRoomCount: Number(parsed.wetRoomCount) || 0,
    };
  } catch {
    return null;
  }
}

/** Deterministic offline fallback so the demo works without any API key configured. */
export function mockVisionAnalysis(seedText: string): RawDetection {
  const scenario = pickScenario(seedText);
  return {
    summary: scenario.summary,
    series: scenario.series,
    finish: scenario.finish,
    doors: scenario.doors,
    windowCount: scenario.windowCount,
    wetRoomCount: scenario.wetRoomCount,
  };
}
