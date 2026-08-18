import Link from "next/link";
import Logo from "./Logo";
import { SERIES } from "@/lib/series";

export default function SiteFooter() {
  return (
    <footer className="border-t border-randi-line bg-randi-ink text-white/70">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-10 px-4 py-12 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div>
          <Logo variant="dark" />
          <p className="mt-4 max-w-xs text-sm text-white/50">
            AI-konfigurator til dørgreb, paskvilgreb, sanitet og tilbehør. Prototype/MVP —
            produktdata og priser er simulerede til demoformål.
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-white/40">Serier</p>
          <ul className="mt-3 space-y-2 text-sm">
            {SERIES.map((s) => (
              <li key={s.slug}>
                <Link href={`/produkter/${s.slug}`} className="hover:text-white">
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-white/40">Navigation</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/produkter" className="hover:text-white">
                Alle produkter
              </Link>
            </li>
            <li>
              <Link href="/konfigurator" className="hover:text-white">
                AI-konfigurator
              </Link>
            </li>
            <li>
              <Link href="/#dokumentation" className="hover:text-white">
                Dokumentation
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-white/40">Kontakt</p>
          <p className="mt-3 text-sm text-white/60">
            Interesseret i et konkret projekt? Upload et dørbillede i AI-konfiguratoren, så
            samler vi stykliste og tilbud — og du bliver kontaktet direkte.
          </p>
          <Link
            href="/konfigurator"
            className="mt-3 inline-block text-sm font-semibold text-randi-accent hover:text-white"
          >
            Start konfigurator →
          </Link>
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-5 text-center text-xs text-white/40 sm:px-6 lg:px-8">
        Randi BuildingScan &amp; Visualizer — prototype/MVP. Produktdata, priser og
        AI-visualiseringer er simulerede til demoformål.
      </div>
    </footer>
  );
}
