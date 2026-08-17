import type { Metadata } from "next";
import "./visualizer.css";
import VisualizerApp from "@/components/visualizer/VisualizerApp";

export const metadata: Metadata = {
  title: "Randi AI Visual Configurator",
  description:
    "Vælg et rigtigt Randi-dørgreb, upload et billede af din dør, og se grebet visualiseret på dit eget billede — med projektpris, klimaaftryk og relevante alternativer.",
};

export default function VisualizerPage() {
  return <VisualizerApp />;
}
