# Randi BuildingScan & Visualizer — AI-konfigurator (MVP/prototype)

En B2B lead-gen prototype for Randi A/S. Brugeren uploader et billede eller dørskema, får en
AI-drevet analyse af dørtype/farve/materiale, en matchende Randi-produktkonfiguration
(dørgreb, paskvilgreb, sanitet, tilbehør) med automatisk cross-sell, et samlet pris- og
CO2e/EPD-estimat — og kan låse en komplet "Building Specifier Report" op ved at indtaste
kontaktoplysninger.

> Produktdata, priser og AI-visualiseringer i denne prototype er **simulerede** til
> demoformål og udgør ikke bindende tilbud eller certificerede EPD'er.

## Kom i gang

```bash
npm install
npm run dev
```

Åbn [http://localhost:3000](http://localhost:3000).

### Live AI-billedanalyse (valgfrit)

Uden nogen API-nøgle kører appen fuldt funktionelt på en deterministisk mock-simulator
(`src/lib/mock-scenarios.ts`), så hele flowet kan demonstreres uden eksterne afhængigheder.

For at slå live billedanalyse via Claude Vision til:

```bash
cp .env.example .env.local
# udfyld ANTHROPIC_API_KEY i .env.local
```

Hvis kaldet til Claude fejler eller nøglen mangler, falder `/api/analyze-door` automatisk
tilbage til mock-simulatoren — brugerflowet fejler aldrig på grund af dette.

## Arkitektur

```
data/randi-products.json     Mock produktkatalog (dørgreb, paskvilgreb, sanitet, tilbehør)
scripts/gen-product-images.mjs  Genererer placeholder-SVG'er for produktkataloget

src/types/                   Delte TypeScript-typer (katalog, analyseresultat)
src/lib/
  catalog.ts                 Indlæser og normaliserer produktkataloget
  pricing.ts                 Pris-/CO2e-beregning (moms, formattering)
  mock-scenarios.ts          Kanoniske "AI-analyse"-scenarier til demo uden API-nøgle
  vision-analysis.ts         Live Claude Vision-kald (valgfrit) + mock-fallback
  matching-engine.ts         Matcher analyseresultat mod kataloget + cross-sell-regler

src/components/
  UploadDropzone.tsx          Drag-and-drop upload
  ProcessingState.tsx         Analyse/processing-state med trinvise indikatorer
  ResultDashboard.tsx         Resultat-dashboard (samler nedenstående)
  VisualPreview.tsx           Før/efter visuelt preview med produkt-overlay
  LineItemsTable.tsx          Stykliste-tabel (genbruges i dashboard + rapport)
  TotalsSummary.tsx           Pris- og CO2e-summary-kort
  LeadGateModal.tsx           Lead gate-modal (kontaktformular)

src/app/
  page.tsx                    Hovedflow: upload → processing → resultat
  report/page.tsx             Printbar Building Specifier Report (PDF via print, + JSON-download)
  api/analyze-door/route.ts   Modtager billede, kører/simulerer vision-analyse, matcher katalog
  api/leads/route.ts          Simuleret lead-capture (logges server-side)
```

### Dataflow

1. **Upload** — `UploadDropzone` sender billede + evt. noter til `/api/analyze-door`.
2. **Analyse** — route'n forsøger et live Claude Vision-kald (hvis `ANTHROPIC_API_KEY` er
   sat), ellers vælges et af de faste mock-scenarier deterministisk ud fra filnavn/størrelse.
3. **Matching** — `matching-engine.ts` matcher den genkendte dørserie/finish/dørtype mod
   produktkataloget og bygger automatisk cross-sell (paskvilgreb, sanitet, dørtilbehør) med
   mængder afledt af antal døre/vinduer/baderum.
4. **Resultat** — `ResultDashboard` viser visuelt preview, stykliste og totals (pris + CO2e).
5. **Lead gate** — `LeadGateModal` poster til `/api/leads` og gemmer analyseresultatet i
   `sessionStorage`, hvorefter `/report` åbnes i en ny fane som en printbar/downloadbar rapport.

## Scripts

```bash
npm run dev      # udviklingsserver
npm run build    # produktionsbuild
npm run lint     # ESLint
node scripts/gen-product-images.mjs  # regenerér placeholder-produktbilleder efter katalogændringer
```
