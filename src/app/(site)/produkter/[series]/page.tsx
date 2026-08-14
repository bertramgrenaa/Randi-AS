import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { getProductsForSeries, getSeriesBySlug, SERIES } from "@/lib/series";
import ProductCard from "@/components/site/ProductCard";

export function generateStaticParams() {
  return SERIES.map((s) => ({ series: s.slug }));
}

export async function generateMetadata(props: PageProps<"/produkter/[series]">) {
  const { series } = await props.params;
  const info = getSeriesBySlug(series);
  return { title: info ? `${info.name} — Randi BuildingScan & Visualizer` : "Produkter" };
}

export default async function SeriesPage(props: PageProps<"/produkter/[series]">) {
  const { series } = await props.params;
  const info = getSeriesBySlug(series);
  if (!info) notFound();

  const products = getProductsForSeries(info.name);
  const groups = groupByCategory(products);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <nav className="flex items-center gap-1.5 text-xs text-stone-400">
        <Link href="/produkter" className="hover:text-randi-accent">
          Produkter
        </Link>
        <ChevronRight size={12} />
        <span className="text-stone-600">{info.name}</span>
      </nav>

      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-randi-ink">{info.name}</h1>
      <p className="mt-2 max-w-2xl text-stone-600">{info.description}</p>

      {groups.map(([groupLabel, items]) => (
        <section key={groupLabel} className="mt-10">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-500">
            {groupLabel}
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

const GROUP_LABELS: Record<string, string> = {
  doorHandles: "Dørgreb",
  windowHandles: "Paskvilgreb",
  sanitaryProducts: "Sanitetsudstyr",
  accessories: "Tilbehør",
};

function groupByCategory(products: ReturnType<typeof getProductsForSeries>) {
  const order: (keyof typeof GROUP_LABELS)[] = [
    "doorHandles",
    "windowHandles",
    "sanitaryProducts",
    "accessories",
  ];
  return order
    .map((group) => [GROUP_LABELS[group], products.filter((p) => p.group === group)] as const)
    .filter(([, items]) => items.length > 0);
}
