/**
 * Canned "vision analysis" scenarios used when no live vision model is configured
 * (or as a graceful fallback if the live call fails). Each scenario represents a
 * plausible building-scan outcome so the demo stays believable across repeated
 * uploads without needing a real API key.
 */
export interface MockScenario {
  key: string;
  summary: string;
  series: "Randi Line®" | "Novo Line";
  finish: string;
  doors: {
    label: string;
    doorType: string;
    material: string;
    colorTone: string;
    estimatedCount: number;
    confidence: number;
  }[];
  windowCount: number;
  /** Rough number of wet rooms / toilets on the scanned floor plan, drives sanitary cross-sell qty. */
  wetRoomCount: number;
}

export const MOCK_SCENARIOS: MockScenario[] = [
  {
    key: "office-steel-satin",
    summary:
      "Kontorbygning med glatte, hvide branddøre. Anbefaler Randi Line® i børstet rustfrit stål for et gennemgående, robust udtryk.",
    series: "Randi Line®",
    finish: "Rustfrit stål (satin)",
    doors: [
      {
        label: "Kontordøre, stueetage",
        doorType: "glat dør",
        material: "Stål",
        colorTone: "Hvid",
        estimatedCount: 14,
        confidence: 0.93,
      },
      {
        label: "Hovedindgang",
        doorType: "stål dør",
        material: "Stål",
        colorTone: "Hvid",
        estimatedCount: 2,
        confidence: 0.88,
      },
    ],
    windowCount: 18,
    wetRoomCount: 4,
  },
  {
    key: "renovation-oak-brass",
    summary:
      "Renoveringsprojekt i ældre boligejendom med massive egetræsdøre. Anbefaler Randi Line® i børstet messing for at matche det klassiske udtryk.",
    series: "Randi Line®",
    finish: "Børstet messing",
    doors: [
      {
        label: "Lejlighedsdøre, opgang A",
        doorType: "eg dør",
        material: "Massivt egetræ",
        colorTone: "Mørk træ",
        estimatedCount: 9,
        confidence: 0.86,
      },
      {
        label: "Indgangsparti",
        doorType: "træ dør",
        material: "Egetræ",
        colorTone: "Mørk træ",
        estimatedCount: 1,
        confidence: 0.81,
      },
    ],
    windowCount: 12,
    wetRoomCount: 6,
  },
  {
    key: "facade-black-steel",
    summary:
      "Ny erhvervsfacade med sorte stål-døre og store glaspartier. Anbefaler Randi Line® i mat sort for et gennemgående, moderne design.",
    series: "Randi Line®",
    finish: "Mat sort (pulverlakeret)",
    doors: [
      {
        label: "Facadedøre",
        doorType: "sort stål dør",
        material: "Stål",
        colorTone: "Sort",
        estimatedCount: 6,
        confidence: 0.91,
      },
      {
        label: "Personaleindgang",
        doorType: "moderne dør",
        material: "Stål/glas",
        colorTone: "Sort",
        estimatedCount: 1,
        confidence: 0.84,
      },
    ],
    windowCount: 22,
    wetRoomCount: 3,
  },
  {
    key: "school-budget-white",
    summary:
      "Skolebygning med et højt antal ensartede institutionsdøre. Anbefaler Novo Line i hvid som et prisbevidst, slidstærkt valg.",
    series: "Novo Line",
    finish: "Hvid (pulverlakeret)",
    doors: [
      {
        label: "Klasselokaledøre",
        doorType: "institutionsdør",
        material: "Stål/laminat",
        colorTone: "Hvid",
        estimatedCount: 24,
        confidence: 0.9,
      },
      {
        label: "Gangdøre",
        doorType: "hvid dør",
        material: "Stål",
        colorTone: "Hvid",
        estimatedCount: 8,
        confidence: 0.87,
      },
    ],
    windowCount: 30,
    wetRoomCount: 8,
  },
];

export function pickScenario(seedText: string): MockScenario {
  const hash = hashString(seedText || "randi-demo");
  return MOCK_SCENARIOS[hash % MOCK_SCENARIOS.length];
}

function hashString(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
  }
  return hash;
}
