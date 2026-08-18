"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Wraps a section and adds the `rv-in` class once it scrolls into view, driving the quiet
 * fade/rise defined by `.rv-reveal` in visualizer.css. Renders already-visible on first paint
 * if the browser has no IntersectionObserver (SSR-safe default: visible).
 */
export default function RevealOnScroll({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`rv-reveal ${visible ? "rv-in" : ""} ${className}`}>
      {children}
    </div>
  );
}
