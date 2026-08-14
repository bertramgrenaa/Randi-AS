import { Coins, Leaf, Percent } from "lucide-react";
import type { ProjectTotals } from "@/types/analysis";
import { formatCo2e, formatDKK } from "@/lib/pricing";

interface TotalsSummaryProps {
  totals: ProjectTotals;
}

export default function TotalsSummary({ totals }: TotalsSummaryProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <SummaryCard
        icon={<Coins size={18} />}
        label="Estimeret pris (ekskl. moms)"
        value={formatDKK(totals.subtotalDKK)}
      />
      <SummaryCard
        icon={<Percent size={18} />}
        label={`Moms (${Math.round(totals.vatRate * 100)}%) & totalpris`}
        value={formatDKK(totals.totalDKK)}
        hint={`heraf moms ${formatDKK(totals.vatDKK)}`}
      />
      <SummaryCard
        icon={<Leaf size={18} />}
        label="Samlet EPD / CO2e-aftryk"
        value={formatCo2e(totals.totalCo2eKg)}
        accent
      />
    </div>
  );
}

function SummaryCard({
  icon,
  label,
  value,
  hint,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  hint?: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-randi-line bg-white p-5 shadow-sm">
      <div
        className={`mb-3 flex h-9 w-9 items-center justify-center rounded-full ${
          accent ? "bg-emerald-50 text-emerald-600" : "bg-randi-accent/10 text-randi-accent"
        }`}
      >
        {icon}
      </div>
      <p className="text-xs font-medium text-stone-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-randi-ink">{value}</p>
      {hint && <p className="mt-0.5 text-xs text-stone-400">{hint}</p>}
    </div>
  );
}
