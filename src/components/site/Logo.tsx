import Link from "next/link";
import { DoorClosed } from "lucide-react";

interface LogoProps {
  variant?: "dark" | "light";
}

/** Original wordmark + icon for this prototype — not a reproduction of Randi A/S's trademarked logo. */
export default function Logo({ variant = "light" }: LogoProps) {
  const isLight = variant === "light";
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <div
        className={`flex h-9 w-9 items-center justify-center rounded-md ${
          isLight ? "bg-white text-randi-navy" : "bg-randi-navy text-white"
        }`}
      >
        <DoorClosed size={18} strokeWidth={2.25} />
      </div>
      <div className="leading-none">
        <p className={`text-base font-bold tracking-tight ${isLight ? "text-white" : "text-randi-ink"}`}>
          RANDI
        </p>
        <p className={`mt-0.5 text-[10px] tracking-wide ${isLight ? "text-white/60" : "text-stone-500"}`}>
          BuildingScan &amp; Visualizer
        </p>
      </div>
    </Link>
  );
}
