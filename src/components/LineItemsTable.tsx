import type { ConfiguredLineItem } from "@/types/analysis";
import { formatCo2e, formatDKK } from "@/lib/pricing";

interface LineItemsTableProps {
  title: string;
  items: ConfiguredLineItem[];
}

export default function LineItemsTable({ title, items }: LineItemsTableProps) {
  if (items.length === 0) return null;

  const lineTotal = (item: ConfiguredLineItem) => item.product.priceDKK * item.quantity;

  return (
    <div className="overflow-hidden rounded-2xl border border-randi-line bg-white shadow-sm">
      <div className="border-b border-randi-line px-5 py-3">
        <h3 className="text-sm font-semibold text-randi-ink">{title}</h3>
      </div>
      {/* overflow-x-auto is a safety net for very narrow viewports only — the fixed table
          layout + colgroup below keeps the full row (incl. "I alt") within the container at
          any width we actually design for, which matters for the printed/PDF report where
          scrolled-off overflow content would otherwise be silently clipped. */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm" style={{ tableLayout: "fixed" }}>
          <colgroup>
            <col className="w-[34%]" />
            <col className="w-[17%]" />
            <col className="w-[10%]" />
            <col className="w-[13%]" />
            <col className="w-[13%]" />
            <col className="w-[13%]" />
          </colgroup>
          <thead>
            <tr className="text-xs text-stone-500">
              <th className="px-5 py-2 font-medium">Produkt</th>
              <th className="px-3 py-2 font-medium">Finish</th>
              <th className="px-3 py-2 text-right font-medium">Antal</th>
              <th className="px-3 py-2 text-right font-medium">Stk. pris</th>
              <th className="px-3 py-2 text-right font-medium">CO2e</th>
              <th className="px-5 py-2 text-right font-medium">I alt</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-randi-line/70">
            {items.map((item) => (
              <tr key={item.product.id} className="align-top">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.product.imagePath}
                      alt={item.product.name}
                      className="h-10 w-10 shrink-0 rounded-lg bg-randi-cream object-cover"
                    />
                    <div className="min-w-0">
                      <p className="truncate font-medium text-randi-ink">{item.product.name}</p>
                      <p className="truncate text-xs text-stone-500">{item.reason}</p>
                    </div>
                  </div>
                </td>
                <td className="truncate px-3 py-3 text-stone-600">{item.product.finish}</td>
                <td className="truncate px-3 py-3 text-right text-stone-600">
                  {item.quantity} <span className="text-stone-400">{item.product.unit}</span>
                </td>
                <td className="truncate px-3 py-3 text-right text-stone-600">
                  {formatDKK(item.product.priceDKK)}
                </td>
                <td className="truncate px-3 py-3 text-right text-stone-500">
                  {formatCo2e(item.product.epdCo2eKg * item.quantity)}
                </td>
                <td className="truncate px-5 py-3 text-right font-medium text-randi-ink">
                  {formatDKK(lineTotal(item))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
