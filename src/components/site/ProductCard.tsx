import Link from "next/link";
import type { RandiProduct } from "@/types/catalog";
import { formatDKK } from "@/lib/pricing";
import { getSeriesSlugForName } from "@/lib/series";

interface ProductCardProps {
  product: RandiProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const seriesSlug = getSeriesSlugForName(product.series);

  return (
    <Link
      href={`/produkter/${seriesSlug}/${product.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-randi-line bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex aspect-square items-center justify-center bg-randi-cream p-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.imagePath}
          alt={product.name}
          className="h-full w-full object-contain transition-transform group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <p className="text-xs font-medium text-stone-400">{product.sku}</p>
        <p className="text-sm font-semibold text-randi-ink group-hover:text-randi-accent">
          {product.name}
        </p>
        <p className="text-xs text-stone-500">{product.finish}</p>
        <p className="mt-auto pt-2 text-sm font-semibold text-randi-ink">
          {formatDKK(product.priceDKK)}
        </p>
      </div>
    </Link>
  );
}
