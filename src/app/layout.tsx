import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Randi BuildingScan & Visualizer",
  description:
    "AI-konfigurator fra Randi A/S: gennemse dørgreb, paskvilgreb, sanitet og tilbehør, og upload et dørbillede for øjeblikkeligt at få en produktanbefaling, visuelt preview, stykliste, CO2e/EPD-beregning og tilbud.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="da" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-white text-randi-ink">{children}</body>
    </html>
  );
}
