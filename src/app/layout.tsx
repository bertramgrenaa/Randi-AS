import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Randi BuildingScan & Visualizer",
  description:
    "AI-konfigurator fra Randi A/S: upload dørbilleder eller dørskemaer og få øjeblikkeligt en produktanbefaling, visuelt preview, styk­liste, CO2e/EPD-beregning og tilbud.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="da" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-randi-cream text-randi-ink">{children}</body>
    </html>
  );
}
