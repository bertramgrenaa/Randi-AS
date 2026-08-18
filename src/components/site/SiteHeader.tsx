"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronDown, Search } from "lucide-react";
import Logo from "./Logo";
import { SERIES } from "@/lib/series";

const NAV_LINKS = [{ href: "/#dokumentation", label: "Dokumentation" }];

export default function SiteHeader() {
  const [produkterOpen, setProdukterOpen] = useState(false);
  const [query, setQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProdukterOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    router.push(query.trim() ? `/produkter?q=${encodeURIComponent(query.trim())}` : "/produkter");
  }

  return (
    <header className="sticky top-0 z-40 bg-randi-navy text-white shadow-sm">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-6 px-4 py-3 sm:px-6 lg:px-8">
        <Logo variant="light" />

        <nav className="hidden items-center gap-7 text-xs font-semibold tracking-wide uppercase lg:flex">
          <Link href="/" className="text-white/85 transition-colors hover:text-white">
            Forside
          </Link>

          <div ref={dropdownRef} className="relative">
            <button
              type="button"
              onClick={() => setProdukterOpen((v) => !v)}
              className="flex items-center gap-1 uppercase tracking-wide text-white/85 transition-colors hover:text-white"
              aria-expanded={produkterOpen}
            >
              Produkter <ChevronDown size={14} className={produkterOpen ? "rotate-180 transition-transform" : "transition-transform"} />
            </button>
            {produkterOpen && (
              <div className="absolute left-1/2 top-full mt-3 w-64 -translate-x-1/2 rounded-xl border border-randi-line bg-white p-2 normal-case text-randi-ink shadow-xl">
                {SERIES.map((s) => (
                  <Link
                    key={s.slug}
                    href={`/produkter/${s.slug}`}
                    onClick={() => setProdukterOpen(false)}
                    className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-randi-cream"
                  >
                    {s.name}
                    <span className="block text-xs font-normal text-stone-500">{s.tagline}</span>
                  </Link>
                ))}
                <div className="my-1 border-t border-randi-line" />
                <Link
                  href="/produkter"
                  onClick={() => setProdukterOpen(false)}
                  className="block rounded-lg px-3 py-2 text-sm font-semibold text-randi-accent hover:bg-randi-cream"
                >
                  Se alle produkter
                </Link>
              </div>
            )}
          </div>

          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-white/85 transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <span className="hidden items-center gap-1.5 rounded-md border border-white/15 bg-white/5 px-2.5 py-1.5 text-xs font-medium text-white/70 sm:flex">
            🇩🇰 Dansk
          </span>
          <form onSubmit={handleSearch} className="relative hidden sm:block">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Søg produkter..."
              className="w-40 rounded-md border border-white/15 bg-white/5 py-1.5 pl-3 pr-8 text-xs text-white placeholder:text-white/40 focus:w-56 focus:border-white/40 focus:outline-none transition-all"
            />
            <button
              type="submit"
              aria-label="Søg"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
            >
              <Search size={14} />
            </button>
          </form>
          <Link
            href="/konfigurator"
            className="rounded-md bg-randi-accent px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-randi-accent-dark"
          >
            Prøv konfigurator
          </Link>
        </div>
      </div>
    </header>
  );
}
