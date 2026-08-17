# Randi BuildingScan & Visualizer — AI-konfigurator (MVP/prototype)

To prototyper i ét repo:

1. **`/visualizer` — Randi AI Visual Configurator** (flagskibet): en produktoplevelse designet tæt
   op ad randi.dk's rigtige hjemmeside (mørk navy header med fuld navigation, rød AWARDS-badge,
   søgefelt, sprogvælger, hvidt kort-grid med SKU-numre) og bygget på **rigtige Randi-produkter**
   (Randi-Line® Nordic, Wing, Komé, 1060, 1021 m.fl., researchet fra randi.dk). Brugeren vælger et
   rigtigt greb, uploader et billede af sin egen dør, og trækker derefter selv den illustrerede
   greb-visualisering hen på det faktiske dørsted i billedet (der er ingen rigtig computer vision
   i denne prototype, så manuel placering er den ærlige og funktionelle løsning) — og får derefter
   — progressivt — projektpris, klimaaftryk, transparente anbefalinger og en sammenligning. Se
   `src/data/randi-real-products.ts` for kildehenvisninger.
2. **`/`, `/produkter`, `/konfigurator` — B2B lead-gen prototype**: et separat produktsite i
   Randi-brandets navy/rød designsprog med et bredere (simuleret) katalog og en mere
   dashboard-agtig AI-konfigurator/stykliste-flow.

> Design, produktdata, priser og AI-visualiseringer er **simulerede/demo** til demoformål —
> se de enkelte sektioner nedenfor for hvad der er baseret på rigtige kilder, og hvad der ikke
> er. Logo/ikonmærket er et originalt design til prototyperne — det er ikke en gengivelse af
> Randi A/S' registrerede varemærke, og der er ikke brugt Randi-produktfotografi (ingen
> bekræftet licens til det i dette miljø) — håndtagene i `/visualizer` er i stedet originale
> stregillustrationer holdt tro mod de rigtige produkters silhuet og finish.

## `/visualizer` — Randi AI Visual Configurator

Rejsen følger: **Produkt → Visualisér → Konfigurér projekt → Forstå aftryk → Opdag alternativer**.

```
Stage 1  /visualizer                Grebskatalog (arkitektonisk liste, ikke e-handelsgrid)
Stage 2  → produktdetalje           Rigtige specs, designer, finish-varianter, "Se på min dør"
Stage 3  → projektinfo              Progressiv mikroform: e-mail, projekttype, antal døre
Stage 4  → upload                   Drag-and-drop / kamera, eksempel-vejledning
Stage 5  → AI-analyse               Simuleret processing-sekvens (visualizeDoor())
Stage 6  → resultat (hero)          Før/efter-slider med det valgte greb visualiseret på fotoet
Stage 7  → resultat (progressiv)    Projekt/antal → pris → CO2e → anbefalinger → sammenligning → CTA
```

**Datakilder**: `src/data/randi-real-products.ts` indeholder rigtige produktnumre, serier,
designere, materialer og tekniske specs (dørtykkelse, spindel, standarder) — komprimeret fra
randi.dk-søgeresultater samt larsvejen.dk, cfmoller.com og forhandlersider (direkte fetch til
randi.dk var blokeret i dette miljø). Pris, CO2e og vægt er **ikke** offentligt tilgængelige og er
tydeligt mærket `isDemo: true` med teksten *"Demo data – replace with Randi LCA/product data"* —
præcis som opgavebeskrivelsen kræver.

**AI-arkitektur**: `src/lib/ai/visualizeDoor.ts` definerer en udbyder-uafhængig
`visualizeDoor()`-funktion. `mockVisualizeDoor` simulerer resultatet klient-side (en
placerings-heuristik som startpunkt + en illustreret overlay) og er tydeligt markeret
`isSimulated: true` — appen foregiver ikke at have genereret et rigtigt AI-billede. Da der ikke er
nogen rigtig dør-genkendelse i denne prototype, kan brugeren selv **trække grebet hen på det
faktiske dørsted** i sit foto og justere størrelsen (`BeforeAfterSlider.tsx`) — det gør
visualiseringen brugbar i stedet for at gætte forkert. `createOpenAIImageProvider()` /
`createGoogleImageProvider()` er signatur-kompatible stubs, klar til at blive koblet til en
rigtig billed-model uden at ændre UI-koden.

**Motorer** (`src/lib/project-engines.ts`): pris- og CO2e-beregning understøtter et projekt med
flere greb/antal (fx 8 × Nordic + 4 × Wing), og en regelbaseret `recommendAlternatives()` der
altid leverer en begrundet anbefaling — aldrig "anbefalet til dig" uden hvorfor.

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
src/data/randi-real-products.ts     Rigtig produktdata (se kildehenvisninger ovenfor)
src/lib/ai/visualizeDoor.ts         AI-visualiserings-abstraktion + mock-provider + provider-stubs
src/lib/project-engines.ts          Pris-/CO2e-motor (multi-produkt-projekt) + anbefalingsmotor
src/types/visualizer.ts             Stage/lead/upload-typer til state machine'en

src/components/visualizer/
  HandleIllustration.tsx            Originale SVG-stregillustrationer pr. silhuet/finish
  VisualizerApp.tsx                 State machine der styrer de 7 stages
  CatalogueStage.tsx / DetailStage.tsx
  LeadStage.tsx / UploadStage.tsx / ProcessingStage.tsx
  ResultStage.tsx                   Hero-visualisering + alle progressive sektioner
  BeforeAfterSlider.tsx             Trækbar før/efter-sammenligning
  RevealOnScroll.tsx                IntersectionObserver-baseret scroll-reveal

src/app/visualizer/
  visualizer.css                    Selvstændigt "rv"-designsystem, lagt tæt op ad randi.dk's
                                     rigtige design (navy header/nav, rød accent, hvide kort)
  page.tsx                          Ligger uden for (site)-gruppen — egen navy top-bar med fuld
                                     navigation, AWARDS-badge og søgefelt (matcher randi.dk)
```

## Scripts

```bash
npm run dev      # udviklingsserver
npm run build    # produktionsbuild
npm run lint     # ESLint
node scripts/gen-product-images.mjs  # regenerér placeholder-produktbilleder efter katalogændringer
```
