"use client";

import { Download, FileCheck2, RotateCcw } from "lucide-react";
import type { AnalysisResult } from "@/types/analysis";
import VisualPreview from "./VisualPreview";
import LineItemsTable from "./LineItemsTable";
import TotalsSummary from "./TotalsSummary";

interface ResultDashboardProps {
  result: AnalysisResult;
  previewUrl: string | null;
  onRequestReport: () => void;
  onStartOver: () => void;
}

export default function ResultDashboard({
  result,
  previewUrl,
  onRequestReport,
  onStartOver,
}: ResultDashboardProps) {
  const windowItems = result.crossSellLineItems.filter((i) => i.product.group === "windowHandles");
  const sanitaryItems = result.crossSellLineItems.filter(
    (i) => i.product.group === "sanitaryProducts"
  );
  const accessoryItems = result.crossSellLineItems.filter((i) => i.product.group === "accessories");

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col gap-2 rounded-2xl border border-randi-line bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <FileCheck2 size={18} />
          </div>
          <div>
            <p className="text-sm font-semibold text-randi-ink">Analyse fuldført</p>
            <p className="text-sm text-stone-500">{result.summary}</p>
            <p className="mt-1 text-xs text-stone-400">
              Anbefalet serie: <span className="font-medium text-randi-ink">{result.recommendedSeries}</span>
              {" · "}
              Kilde:{" "}
              {result.source === "claude-vision" ? "Live AI-billedanalyse" : "Simuleret AI-analyse (demo)"}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onStartOver}
          className="flex shrink-0 items-center gap-1.5 self-start rounded-lg border border-randi-line px-3 py-2 text-xs font-medium text-stone-600 hover:bg-stone-50 sm:self-auto"
        >
          <RotateCcw size={14} /> Ny analyse
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <VisualPreview result={result} previewUrl={previewUrl} />
        </div>
        <div className="space-y-4 lg:col-span-3">
          <TotalsSummary totals={result.totals} />
          <div className="rounded-2xl border border-dashed border-randi-accent/40 bg-randi-accent/5 p-5">
            <p className="text-sm font-medium text-randi-ink">
              Få den komplette Building Specifier Report
            </p>
            <p className="mt-1 text-sm text-stone-600">
              Download en samlet PDF/JSON-rapport med fuld stykliste, EPD/CO2e-dokumentation og
              tilbud — indtast dine kontaktoplysninger for at låse rapporten op.
            </p>
            <button
              type="button"
              onClick={onRequestReport}
              className="mt-4 flex items-center gap-2 rounded-xl bg-randi-accent px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-randi-accent-dark"
            >
              <Download size={16} /> Download fuld rapport
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <LineItemsTable title="Døre — dørgreb" items={result.doorLineItems} />
        <LineItemsTable title="Vinduer — paskvilgreb (cross-sell)" items={windowItems} />
        <LineItemsTable title="Sanitetsudstyr (cross-sell)" items={sanitaryItems} />
        <LineItemsTable title="Dørtilbehør (cross-sell)" items={accessoryItems} />
      </div>
    </div>
  );
}
