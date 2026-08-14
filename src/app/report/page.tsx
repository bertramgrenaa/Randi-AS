"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { DoorClosed, Download, Printer } from "lucide-react";
import type { AnalysisResult } from "@/types/analysis";
import LineItemsTable from "@/components/LineItemsTable";
import TotalsSummary from "@/components/TotalsSummary";

interface ReportPayload {
  result: AnalysisResult;
  lead: { name: string; email: string; company: string };
}

const REPORT_STORAGE_KEY = "randi-report-payload";

// sessionStorage is an external mutable store — read it via useSyncExternalStore rather than
// an effect + setState, so the report renders synchronously on mount without an extra render.
function subscribe() {
  return () => {};
}
function getSnapshot() {
  return sessionStorage.getItem(REPORT_STORAGE_KEY);
}
function getServerSnapshot() {
  return null;
}

export default function ReportPage() {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  let payload: ReportPayload | null = null;
  if (raw) {
    try {
      payload = JSON.parse(raw) as ReportPayload;
    } catch {
      payload = null;
    }
  }

  if (!payload) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <p className="text-sm text-stone-500">
          Ingen rapportdata fundet. Gennemfør en analyse på forsiden og udfyld kontaktformularen
          for at generere rapporten.
        </p>
        <Link href="/" className="mt-4 inline-block text-sm font-medium text-randi-accent underline">
          Gå til forsiden
        </Link>
      </div>
    );
  }

  const { result, lead } = payload;

  function handleDownloadJson() {
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `randi-specifier-report-${result.id}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  const windowItems = result.crossSellLineItems.filter((i) => i.product.group === "windowHandles");
  const sanitaryItems = result.crossSellLineItems.filter(
    (i) => i.product.group === "sanitaryProducts"
  );
  const accessoryItems = result.crossSellLineItems.filter((i) => i.product.group === "accessories");

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-randi-ink text-white">
            <DoorClosed size={18} />
          </div>
          <span className="text-sm font-bold tracking-tight text-randi-ink">RANDI</span>
        </Link>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleDownloadJson}
            className="flex items-center gap-1.5 rounded-lg border border-randi-line bg-white px-3.5 py-2 text-xs font-medium text-stone-600 hover:bg-stone-50"
          >
            <Download size={14} /> Download JSON
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-1.5 rounded-lg bg-randi-ink px-3.5 py-2 text-xs font-medium text-white hover:bg-randi-graphite"
          >
            <Printer size={14} /> Gem som PDF / Print
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-randi-line bg-white p-6 shadow-sm sm:p-8 print:border-0 print:p-0 print:shadow-none">
        <div className="flex items-start justify-between border-b border-randi-line pb-6">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-randi-accent">
              Randi A/S · Building Specifier Report
            </p>
            <h1 className="mt-1 text-2xl font-semibold text-randi-ink">
              Projektrapport &amp; tilbud
            </h1>
            <p className="mt-1 text-sm text-stone-500">
              Genereret {new Date(result.createdAt).toLocaleString("da-DK")} · Rapport-ID {result.id}
            </p>
          </div>
          <div className="text-right text-sm text-stone-500">
            <p className="font-medium text-randi-ink">{lead.name}</p>
            {lead.company && <p>{lead.company}</p>}
            <p>{lead.email}</p>
          </div>
        </div>

        <div className="mt-6 rounded-xl bg-randi-cream p-4 text-sm text-stone-700">
          <p className="font-medium text-randi-ink">AI-analysesammendrag</p>
          <p className="mt-1">{result.summary}</p>
          <p className="mt-2 text-xs text-stone-500">
            Kildefil: {result.sourceFileName} · Anbefalet serie: {result.recommendedSeries}
          </p>
        </div>

        <div className="mt-6">
          <TotalsSummary totals={result.totals} />
        </div>

        <div className="mt-6 space-y-4">
          <LineItemsTable title="Døre — dørgreb" items={result.doorLineItems} />
          <LineItemsTable title="Vinduer — paskvilgreb" items={windowItems} />
          <LineItemsTable title="Sanitetsudstyr" items={sanitaryItems} />
          <LineItemsTable title="Dørtilbehør" items={accessoryItems} />
        </div>

        <div className="mt-8 border-t border-randi-line pt-4 text-[11px] leading-relaxed text-stone-400">
          Denne rapport er genereret af Randi BuildingScan &amp; Visualizer (prototype/MVP).
          Priser er vejledende og eksklusive moms medmindre andet er angivet. EPD/CO2e-værdier er
          estimerede A1-A3-værdier pr. produkt til demoformål og udgør ikke en certificeret EPD.
        </div>
      </div>
    </div>
  );
}
