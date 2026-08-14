import Link from "next/link";
import { ArrowRight, FileCheck2, Layers, Leaf, ScanSearch, UploadCloud } from "lucide-react";
import { SERIES } from "@/lib/series";

export default function HomePage() {
  return (
    <div>
      <Hero />
      <HowItWorks />
      <SeriesGrid />
      <Documentation />
      <ClosingCta />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-randi-navy via-randi-navy to-randi-graphite text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-randi-accent/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 left-1/3 h-80 w-80 rounded-full bg-white/5 blur-3xl"
      />
      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/80">
          <ScanSearch size={13} /> AI-drevet dørgenkendelse · Prototype/MVP
        </span>
        <h1 className="mt-5 max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
          Fra dørbillede til komplet tilbud på minutter
        </h1>
        <p className="mt-4 max-w-xl text-white/70">
          Upload et billede eller dørskema, og lad AI-konfiguratoren genkende dørtype, farve og
          materiale, matche Randi-dørgreb, paskvilgreb, sanitet og tilbehør — og beregne pris
          samt CO2e/EPD for hele projektet.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/konfigurator"
            className="flex items-center gap-2 rounded-lg bg-randi-accent px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-randi-accent-dark"
          >
            Prøv AI-konfiguratoren <ArrowRight size={16} />
          </Link>
          <Link
            href="/produkter"
            className="flex items-center gap-2 rounded-lg border border-white/25 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            Se produktkatalog
          </Link>
        </div>
      </div>
    </section>
  );
}

const STEPS = [
  {
    icon: UploadCloud,
    title: "1. Upload",
    text: "Træk et billede eller dørskema (PNG/JPG/PDF) ind i konfiguratoren.",
  },
  {
    icon: ScanSearch,
    title: "2. AI-analyse",
    text: "Dørtype, farve og materiale genkendes og matches mod Randis produktkatalog.",
  },
  {
    icon: FileCheck2,
    title: "3. Tilbud & CO2e",
    text: "Få stykliste, cross-sell, samlet pris og EPD/CO2e — og download den fulde rapport.",
  },
];

function HowItWorks() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <h2 className="text-center text-2xl font-semibold tracking-tight text-randi-ink">
        Sådan virker det
      </h2>
      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {STEPS.map((step) => (
          <div key={step.title} className="rounded-2xl border border-randi-line bg-white p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-randi-accent/10 text-randi-accent">
              <step.icon size={20} />
            </div>
            <p className="mt-4 font-semibold text-randi-ink">{step.title}</p>
            <p className="mt-1.5 text-sm text-stone-600">{step.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function SeriesGrid() {
  return (
    <section className="bg-randi-cream py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-semibold tracking-tight text-randi-ink">Serier</h2>
          <Link
            href="/produkter"
            className="hidden text-sm font-semibold text-randi-accent hover:text-randi-accent-dark sm:block"
          >
            Se alle produkter →
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SERIES.map((s) => (
            <Link
              key={s.slug}
              href={`/produkter/${s.slug}`}
              className="group rounded-2xl border border-randi-line bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-randi-navy text-white">
                <Layers size={18} />
              </div>
              <p className="mt-4 font-semibold text-randi-ink group-hover:text-randi-accent">
                {s.name}
              </p>
              <p className="mt-1.5 text-sm text-stone-500">{s.tagline}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function Documentation() {
  return (
    <section id="dokumentation" className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex items-center gap-2.5">
        <Leaf size={20} className="text-emerald-600" />
        <h2 className="text-2xl font-semibold tracking-tight text-randi-ink">
          Dokumentation: pris og EPD/CO2e
        </h2>
      </div>
      <p className="mt-4 text-stone-600">
        Hvert produkt i kataloget er tagget med en pris i DKK (ekskl. moms) og en estimeret
        EPD/CO2e-værdi (kg CO2e, A1-A3, cradle-to-gate, pr. produkt). Når AI-konfiguratoren
        matcher din bygning mod kataloget, lægges disse værdier sammen på tværs af dørgreb,
        paskvilgreb, sanitet og tilbehør til et samlet projektestimat.
      </p>
      <ul className="mt-5 space-y-2 text-sm text-stone-600">
        <li>• Priser er vejledende og eksklusive 25% dansk moms medmindre andet er angivet.</li>
        <li>
          • EPD/CO2e-værdier er estimater til demoformål og udgør ikke en certificeret EPD
          (Environmental Product Declaration).
        </li>
        <li>
          • Cross-sell (paskvilgreb, sanitet, tilbehør) foreslås automatisk ud fra registreret
          antal døre, vinduer og baderum.
        </li>
      </ul>
      <p className="mt-5 rounded-xl bg-randi-cream p-4 text-xs text-stone-500">
        Denne prototype anvender simuleret/mocket produktdata. I en produktionsversion erstattes
        kataloget af Randis rigtige ERP/PIM-data og certificerede EPD&apos;er.
      </p>
    </section>
  );
}

function ClosingCta() {
  return (
    <section className="bg-randi-ink">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-16 text-center sm:px-6 lg:px-8">
        <h2 className="text-2xl font-semibold tracking-tight text-white">Klar til dit projekt?</h2>
        <p className="max-w-md text-white/60">
          Upload et dørbillede og få en komplet Building Specifier Report med stykliste, pris og
          CO2e-dokumentation.
        </p>
        <Link
          href="/konfigurator"
          className="mt-2 flex items-center gap-2 rounded-lg bg-randi-accent px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-randi-accent-dark"
        >
          Start AI-konfigurator <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}
