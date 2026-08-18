"use client";

import { useEffect, useRef, useState } from "react";
import type { RandiHandleProduct, DoorTypeKey } from "@/data/randi-real-products";
import { classifyDoorPhoto } from "@/lib/classifyDoorPhoto";
import type { UploadedPhoto } from "@/types/visualizer";

interface ProcessingStageProps {
  photo: UploadedPhoto;
  product: RandiHandleProduct;
  onDone: (doorType: DoorTypeKey) => void;
}

const CAPTION_MS = 950;

export default function ProcessingStage({ photo, product, onDone }: ProcessingStageProps) {
  const captions = [
    "Analyserer dit dørbillede...",
    "Genkender dørtype ud fra farvetone...",
    `Klargør Randi ${product.productNumber} på din dør...`,
    "Færdiggør din visualisering...",
  ];
  const [index, setIndex] = useState(0);
  const doneRef = useRef(false);

  useEffect(() => {
    const workPromise = classifyDoorPhoto(photo.dataUrl);

    const timer = setInterval(() => {
      setIndex((i) => Math.min(i + 1, captions.length - 1));
    }, CAPTION_MS);

    const minDisplay = new Promise((resolve) => setTimeout(resolve, CAPTION_MS * captions.length));

    Promise.all([workPromise, minDisplay]).then(([result]) => {
      if (doneRef.current) return;
      doneRef.current = true;
      clearInterval(timer);
      onDone(result.doorType);
    });

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="rv-processing-wrap">
      <div className="rv-proc-frame">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photo.dataUrl} alt="" />
        <div className="rv-proc-sweep" />
      </div>
      <p className="rv-proc-caption">{captions[index]}</p>
      <div className="rv-proc-dots">
        {captions.map((c, i) => (
          <span key={c} className={i <= index ? "on" : ""} />
        ))}
      </div>
    </div>
  );
}
