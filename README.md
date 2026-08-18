# Randi BuildingScan & Visualizer — AI-konfigurator (MVP/prototype)

To prototyper i ét repo:

1. **`/visualizer` — Randi AI Visual Configurator** (flagskibet): en produktoplevelse designet tæt
   op ad randi.dk's rigtige hjemmeside (mørk navy header med fuld navigation, rød AWARDS-badge,
   søgefelt, sprogvælger, hvidt kort-grid med SKU-numre, self-hostet Inter via `next/font`) og
   bygget på **4 rigtige Randi-dørgreb** + **10 komplementære Randi-Line®-produkter**
   (vinduesgreb, langskilte, møbelgreb m.m.) til en cross-sell-sektion. Brugeren vælger et
   greb, uploader et rigtigt billede af sin egen dør, og appen **genkender ægte dørtypen ud fra
   billedets farvetone** (client-side canvas-analyse, ikke et gæt eller en knap) og viser derefter
   et rigtigt, brugerleveret komposit-foto af netop det greb på netop den dørtype — og får
   derefter, progressivt, projektpris, klimaaftryk, transparente anbefalinger, en delt
   sammenligningspanel og et cross-sell af komplementære produkter. Se
   `src/data/randi-real-products.ts` for kildehenvisninger.
2. **`/`, `/produkter`, `/konfigurator` — B2B lead-gen prototype**: et separat produktsite i
   Randi-brandets navy/rød designsprog med et bredere (simuleret) katalog og en mere
   dashboard-agtig AI-konfigurator/stykliste-flow.

> Design, produktdata, priser og CO2e-tal er **simulerede/demo** til demoformål — se de enkelte
> sektioner nedenfor for hvad der er baseret på rigtige kilder, og hvad der ikke er.
> Produktfotografi (dørgreb, tilbehør, dørfotos) i `/visualizer` er leveret af brugeren, ikke
> hentet/gengivet fra randi.dk.

## `/visualizer` — Randi AI Visual Configurator

Rejsen følger: **Produkt → Visualisér → Konfigurér projekt → Forstå aftryk → Opdag alternativer**.

```
Stage 1  /visualizer                Grebskatalog — 4 rigtige dørgreb med rigtige produktfotos
Stage 2  → produktdetalje           Specs, designer (hvor kendt), bæredygtigheds-indsigt, "Se på min dør"
Stage 3  → projektinfo              Progressiv mikroform: e-mail, projekttype, antal døre
Stage 4  → upload                   Drag-and-drop / kamera, eksempel-vejledning
Stage 5  → AI-analyse               Ægte farvetone-klassificering af dørtype (classifyDoorPhoto())
Stage 6  → resultat (hero)          Før/efter-slider: dit eget foto vs. et rigtigt komposit-foto
Stage 7  → resultat (progressiv)    Projekt/antal → pris → CO2e → anbefalinger → sammenligning →
                                     cross-sell ("Fuldend udtrykket") → CTA (+ sticky CTA-bar)
```

**Datakilder**: `src/data/randi-real-products.ts` indeholder produktnumre, finish og — for det ene
uafhængigt researchede produkt (1078.00, `verified: true`) — designer, standarder og beskrivelse
fra randi.dk og officielle designerkilder. De øvrige 3 dørgreb og alle 10 tilbehørsprodukter er
som oplyst med de leverede referencefotos, ikke selvstændigt verificeret mod randi.dk i denne
prototype. Pris og CO2e er **ikke** offentligt tilgængelige og er tydeligt mærket `isDemo: true`
med teksten *"Demo data – replace with Randi LCA/product data"*. Hvert dørgrebs `co2Note` og
`insight` er skrevet ud fra reelt research (birkebarks antiseptiske historik, messings/rustfrit
ståls genanvendelighed, PVD som tør vakuumproces) — hedget ærligt hvor forskningen ikke understøtter
en stærkere påstand, ikke en fabrikeret beregning.

**Dørtype-klassificering**: `src/lib/classifyDoorPhoto.ts` afgør, om det uploadede foto ligner den
hvide fyldningsdør eller egetræsdøren i denne prototype, ved reelt at analysere billedets
gennemsnitlige farvevarme (rød minus blå kanal) på en nedskaleret canvas — ikke en knap, og ikke et
tilfældigt resultat. Alle 4 dørgreb har et rigtigt komposit-foto for **begge** dørtyper
(`afterSrc: Record<DoorTypeKey, string>`), så enhver kombination af greb × dørtype virker — der er
ingen "mismatch"-fejlvej tilbage i denne version. En produktionsversion med en rigtig
billedgenererings-API (OpenAI image-edit, Gemini image editing) ville erstatte hele modulet med et
ægte komposit-kald og gøre klassificeringen overflødig.

**Motorer** (`src/lib/project-engines.ts`): pris- og CO2e-beregning understøtter et projekt med
flere greb/tilbehør/antal, `countDoors()` tæller kun dørgreb (ikke tilbehør) som "døre", og
`recommendAlternatives()` foreslår op til 3 andre dørgreb med en begrundelse der afhænger af om
produktet er uafhængigt verificeret eller ej — aldrig "anbefalet til dig" uden hvorfor.

## `/`, `/produkter`, `/konfigurator` — B2B lead-gen prototype

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

### `/visualizer`-filer

```
src/data/randi-real-products.ts     Produktdata: 4 dørgreb (RandiHandleProduct) + 10 tilbehør
                                     (RandiAccessory), forenet i CatalogueItem/ALL_ITEMS
src/lib/classifyDoorPhoto.ts        Ægte canvas-farvetone-klassificering af dørtype
src/lib/project-engines.ts          Pris-/CO2e-motor (multi-produkt-projekt), countDoors()
                                     (ekskl. tilbehør) + anbefalingsmotor
src/types/visualizer.ts             Stage/lead/upload-typer til state machine'en

src/components/visualizer/
  VisualizerApp.tsx                 State machine der styrer de 7 stages
  CatalogueStage.tsx / DetailStage.tsx
  LeadStage.tsx / UploadStage.tsx / ProcessingStage.tsx
  ResultStage.tsx                   Hero-visualisering + alle progressive sektioner (CO2-panel,
                                     anbefalinger, delt sammenligningspanel, "Fuldend udtrykket"
                                     cross-sell, sticky CTA-bar)
  BeforeAfterSlider.tsx             Trækbar før/efter-sammenligning mellem eget foto og komposit-foto
  RevealOnScroll.tsx                IntersectionObserver-baseret scroll-reveal

src/app/visualizer/
  visualizer.css                    Selvstændigt "rv"-designsystem, lagt tæt op ad randi.dk's
                                     rigtige design (navy header/nav, rød accent, hvide kort)
  page.tsx                          Ligger uden for (site)-gruppen — egen navy top-bar med fuld
                                     navigation, AWARDS-badge og søgefelt (matcher randi.dk);
                                     selvhoster Inter via next/font/google

public/visualizer-examples/         Alle produktfotos: dørgreb, tilbehør, før/efter-komposit-fotos
                                     for begge dørtyper, logo/ikonmærke
```

## Scripts

```bash
npm run dev      # udviklingsserver
npm run build    # produktionsbuild
npm run lint     # ESLint
node scripts/gen-product-images.mjs  # regenerér placeholder-produktbilleder efter katalogændringer
```
