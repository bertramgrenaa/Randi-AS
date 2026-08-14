# Randi BuildingScan & Visualizer — AI-konfigurator (MVP/prototype)

En B2B lead-gen prototype for Randi A/S: et produktsite i Randi-brandets navy/rød designsprog,
hvor brugeren kan gennemse dørgreb, paskvilgreb, sanitet og tilbehør på tværs af Randi Line® og
Novo Line — og fra en hvilken som helst produktside starte AI-konfiguratoren for at få en
komplet stykliste, pris- og CO2e/EPD-beregning, med det valgte produkt som udgangspunkt.

> Design, produktdata, priser og AI-visualiseringer i denne prototype er **simulerede** til
> demoformål. Logo/ikonmærket er et originalt design til prototypen — det er ikke en
> gengivelse af Randi A/S' registrerede varemærke.

## Kom i gang

```bash
npm install
npm run dev
```

Åbn [http://localhost:3000](http://localhost:3000).

### Live AI-billedanalyse (valgfrit)

Uden nogen API-nøgle kører appen fuldt funktionelt på en deterministisk mock-simulator
(`src/lib/mock-scenarios.ts`). For at slå live billedanalyse via Claude Vision til:

```bash
cp .env.example .env.local
# udfyld ANTHROPIC_API_KEY i .env.local
```

Hvis kaldet til Claude fejler eller nøglen mangler, falder `/api/analyze-door` automatisk
tilbage til mock-simulatoren.

## Sider

```
/                                   Forside (hero, "Sådan virker det", serier, dokumentation)
/produkter                          Serier-oversigt + søgning (?q=...)
/produkter/[series]                 Produktgrid for én serie, grupperet pr. produkttype
/produkter/[series]/[productId]     Produktdetalje + "Brug i AI-konfigurator"
/konfigurator                       Upload → AI-analyse → resultat-dashboard → lead gate
/konfigurator?product=<id>          Samme flow, men forudkonfigureret til et valgt produkt
/report                             Printbar/downloadbar Building Specifier Report (efter lead gate)
```

### Produkt → konfigurator-kobling

Fra enhver produktside kan brugeren klikke **"Brug i AI-konfigurator"**, som sender dem til
`/konfigurator?product=<productId>`. AI-konfiguratoren analyserer stadig det uploadede
billede for dørtype/antal, men serie og finish fra det valgte produkt vinder over AI'ens eget
gæt (`ProductPreference` i `src/lib/matching-engine.ts`) — så resultatet altid tager
udgangspunkt i det produkt, brugeren startede fra.

## Arkitektur

```
data/randi-products.json     Mock produktkatalog (dørgreb, paskvilgreb, sanitet, tilbehør)
scripts/gen-product-images.mjs  Genererer placeholder-SVG'er for produktkataloget

src/types/                   Delte TypeScript-typer (katalog, analyseresultat)
src/lib/
  catalog.ts                 Indlæser og normaliserer produktkataloget
  series.ts                  Serie-metadata (slug, navn, tagline) til /produkter-siderne
  pricing.ts                 Pris-/CO2e-beregning (moms, formattering)
  mock-scenarios.ts          Kanoniske "AI-analyse"-scenarier til demo uden API-nøgle
  vision-analysis.ts         Live Claude Vision-kald (valgfrit) + mock-fallback
  matching-engine.ts         Matcher analyseresultat mod kataloget, cross-sell-regler,
                              samt ProductPreference-override fra produktsiderne

src/components/
  site/                       SiteHeader, SiteFooter, Logo, ProductCard — brand-tema/navigation
  UploadDropzone.tsx          Drag-and-drop upload
  ProcessingState.tsx         Analyse/processing-state med trinvise indikatorer
  ResultDashboard.tsx         Resultat-dashboard (samler nedenstående)
  VisualPreview.tsx           Før/efter visuelt preview med produkt-overlay
  LineItemsTable.tsx          Stykliste-tabel (genbruges i dashboard + rapport)
  TotalsSummary.tsx           Pris- og CO2e-summary-kort
  LeadGateModal.tsx           Lead gate-modal (kontaktformular)

src/app/
  (site)/layout.tsx           Fælles SiteHeader/SiteFooter for alle marketing-/produktsider
  (site)/page.tsx             Forside
  (site)/produkter/...        Produktkatalog-browsing
  (site)/konfigurator/page.tsx  AI-konfigurator-flow
  report/page.tsx             Printbar specifier-rapport (uden global nav, selvstændig header)
  api/analyze-door/route.ts   Modtager billede (+ evt. preferredProductId), matcher katalog
  api/leads/route.ts          Simuleret lead-capture (logges server-side)
```

## Scripts

```bash
npm run dev      # udviklingsserver
npm run build    # produktionsbuild
npm run lint     # ESLint
node scripts/gen-product-images.mjs  # regenerér placeholder-produktbilleder efter katalogændringer
```
