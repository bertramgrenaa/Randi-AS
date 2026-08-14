import Link from "next/link";
import { Layers, Search } from "lucide-react";
import { SERIES } from "@/lib/series";
import { getAllProducts } from "@/lib/catalog";
import ProductCard from "@/components/site/ProductCard";

export const metadata = { title: "Produkter — Randi BuildingScan & Visualizer" };

export default async function ProdukterPage(props: PageProps<"/produkter">) {
  const { q } = await props.searchParams;
  const query = typeof q === "string" ? q.trim() : "";

  if (query) {
    return <SearchResults query={query} />;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-center text-3xl font-semibold tracking-tight text-randi-ink">Serier</h1>
      <p className="mx-auto mt-2 max-w-lg text-center text-stone-500">
        Vælg en serie for at se det fulde produktsortiment — eller søg direkte i kataloget.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {SERIES.map((s) => (
          <Link
            key={s.slug}
            href={`/produkter/${s.slug}`}
            className="group flex flex-col rounded-2xl border border-randi-line bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-randi-navy text-white">
              <Layers size={20} />
            </div>
            <p className="mt-4 font-semibold text-randi-ink group-hover:text-randi-accent">
              {s.name}
            </p>
            <p className="mt-1.5 text-sm text-stone-500">{s.tagline}</p>
            <p className="mt-3 text-xs text-stone-400">{s.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

function SearchResults({ query }: { query: string }) {
  const needle = query.toLowerCase();
  const results = getAllProducts().filter((p) =>
    [p.name, p.sku, p.series, p.finish, p.category ?? "", ...p.tags].some((field) =>
      field.toLowerCase().includes(needle)
    )
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex items-center gap-2 text-sm text-stone-500">
        <Search size={15} />
        Søgeresultater for <span className="font-medium text-randi-ink">&quot;{query}&quot;</span>
      </div>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight text-randi-ink">
        {results.length} {results.length === 1 ? "produkt" : "produkter"} fundet
      </h1>

      {results.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-randi-line bg-randi-cream p-10 text-center text-sm text-stone-500">
          Ingen produkter matchede din søgning.{" "}
          <Link href="/produkter" className="font-medium text-randi-accent hover:underline">
            Se alle serier i stedet
          </Link>
          .
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {results.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
