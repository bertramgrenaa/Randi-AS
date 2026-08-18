import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Leaf, Sparkles, Tag } from "lucide-react";
import { getProductById, getAllProducts } from "@/lib/catalog";
import { getSeriesBySlug, getSeriesSlugForName } from "@/lib/series";
import { formatCo2e, formatDKK } from "@/lib/pricing";

export function generateStaticParams() {
  return getAllProducts().map((p) => ({
    series: getSeriesSlugForName(p.series),
    productId: p.id,
  }));
}

export async function generateMetadata(props: PageProps<"/produkter/[series]/[productId]">) {
  const { productId } = await props.params;
  const product = getProductById(productId);
  return { title: product ? `${product.name} — Randi` : "Produkt" };
}

export default async function ProductDetailPage(
  props: PageProps<"/produkter/[series]/[productId]">
) {
  const { series, productId } = await props.params;
  const info = getSeriesBySlug(series);
  const product = getProductById(productId);
  if (!info || !product || product.series !== info.name) notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <nav className="flex flex-wrap items-center gap-1.5 text-xs text-stone-400">
        <Link href="/produkter" className="hover:text-randi-accent">
          Produkter
        </Link>
        <ChevronRight size={12} />
        <Link href={`/produkter/${series}`} className="hover:text-randi-accent">
          {info.name}
        </Link>
        <ChevronRight size={12} />
        <span className="text-stone-600">{product.name}</span>
      </nav>

      <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div className="flex aspect-square items-center justify-center rounded-2xl border border-randi-line bg-randi-cream p-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={product.imagePath} alt={product.name} className="h-full w-full object-contain" />
        </div>

        <div>
          <p className="text-xs font-medium tracking-wide text-stone-400">
            {product.series} · {product.sku}
          </p>
          <h1 className="mt-1.5 text-3xl font-semibold tracking-tight text-randi-ink">
            {product.name}
          </h1>
          <p className="mt-3 text-stone-600">{product.description}</p>

          <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-stone-400">Finish</dt>
              <dd className="font-medium text-randi-ink">{product.finish}</dd>
            </div>
            <div>
              <dt className="text-stone-400">Materiale</dt>
              <dd className="font-medium text-randi-ink">{product.material}</dd>
            </div>
            <div>
              <dt className="text-stone-400">Pris (ekskl. moms)</dt>
              <dd className="font-medium text-randi-ink">
                {formatDKK(product.priceDKK)} / {product.unit}
              </dd>
            </div>
            <div>
              <dt className="flex items-center gap-1 text-stone-400">
                <Leaf size={12} /> EPD / CO2e
              </dt>
              <dd className="font-medium text-randi-ink">{formatCo2e(product.epdCo2eKg)}</dd>
            </div>
          </dl>

          {product.tags.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 rounded-full bg-randi-cream px-2.5 py-1 text-xs text-stone-500"
                >
                  <Tag size={10} /> {tag}
                </span>
              ))}
            </div>
          )}

          <div className="mt-8 rounded-2xl border border-dashed border-randi-accent/40 bg-randi-accent/5 p-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-randi-ink">
              <Sparkles size={16} className="text-randi-accent" />
              Brug dette produkt i AI-konfiguratoren
            </div>
            <p className="mt-1.5 text-sm text-stone-600">
              Upload et billede af dit projekt, og lad konfiguratoren bygge en komplet stykliste,
              pris og CO2e-beregning taget udgangspunkt i {product.name.toLowerCase()}.
            </p>
            <Link
              href={`/konfigurator?product=${encodeURIComponent(product.id)}`}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-randi-accent px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-randi-accent-dark"
            >
              Brug i AI-konfigurator
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
