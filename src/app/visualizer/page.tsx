import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./visualizer.css";
import VisualizerApp from "@/components/visualizer/VisualizerApp";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Randi AI Visual Configurator",
  description:
    "Vælg et rigtigt Randi-dørgreb, upload et billede af din dør, og se grebet visualiseret på dit eget billede — med projektpris, klimaaftryk og relevante alternativer.",
};

export default function VisualizerPage() {
  return (
    <div className={inter.variable}>
      <VisualizerApp />
    </div>
  );
}
