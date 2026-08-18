"use client";

import { useRef, useState } from "react";
import type { RandiHandleProduct } from "@/data/randi-real-products";
import type { UploadedPhoto } from "@/types/visualizer";

const ACCEPTED = ["image/png", "image/jpeg", "image/webp"];
const MAX_BYTES = 15 * 1024 * 1024;

interface UploadStageProps {
  product: RandiHandleProduct;
  onContinue: (photo: UploadedPhoto) => void;
  onBack: () => void;
}

const GUIDANCE = [
  "Fotografér døren så lige forfra som muligt, med hele døren i billedet.",
  "Dagslys eller god belysning gør resultatet tydeligere.",
  "Undgå stærk modlys/skygge hen over selve grebet.",
];

export default function UploadStage({ product, onContinue, onBack }: UploadStageProps) {
  const [photo, setPhoto] = useState<UploadedPhoto | null>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function acceptFile(file: File | undefined) {
    if (!file) return;
    if (!ACCEPTED.includes(file.type)) {
      setError("Filtypen understøttes ikke. Upload PNG, JPG eller WEBP.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("Filen er for stor. Maks. 15 MB.");
      return;
    }
    setError(null);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      const img = new Image();
      img.onload = () => {
        setPhoto({ dataUrl, width: img.naturalWidth, height: img.naturalHeight, fileName: file.name });
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="rv-upload-wrap rv-container">
      <div className="rv-upload-grid">
        <div
          className={`rv-dropzone ${dragging ? "drag" : ""}`}
          role="button"
          tabIndex={0}
          onClick={() => !photo && inputRef.current?.click()}
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && !photo && inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            acceptFile(e.dataTransfer.files[0]);
          }}
        >
          <input
            ref={inputRef}
            type="file"
            accept={[...ACCEPTED, "image/*"].join(",")}
            capture="environment"
            onChange={(e) => acceptFile(e.target.files?.[0])}
          />
          {photo ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo.dataUrl} alt="Din dør" />
              <button
                type="button"
                className="dz-clear"
                aria-label="Fjern billede"
                onClick={(e) => {
                  e.stopPropagation();
                  setPhoto(null);
                  if (inputRef.current) inputRef.current.value = "";
                }}
              >
                <XIcon />
              </button>
            </>
          ) : (
            <>
              <UploadIcon />
              <div>
                <p style={{ fontWeight: 600, fontSize: 15 }}>Upload et billede af din dør</p>
                <p style={{ fontSize: 13, color: "var(--rv-ink-soft)", marginTop: 6 }}>
                  Træk og slip, eller klik for at vælge — evt. direkte fra din telefons kamera
                </p>
              </div>
            </>
          )}
        </div>

        <div>
          <button type="button" className="rv-btn-ghost" onClick={onBack} style={{ marginBottom: 18 }}>
            ← Tilbage
          </button>
          <h2 style={{ fontSize: "clamp(24px,3.4vw,32px)" }}>Se {product.name} i dit eget rum</h2>
          <p style={{ marginTop: 12, fontSize: 14.5, color: "var(--rv-ink-soft)", maxWidth: "42ch" }}>
            Upload et foto af din dør, så viser vi det valgte Randi-greb sat i kontekst — direkte på dit eget
            billede.
          </p>

          <div className="rv-example-note" style={{ marginTop: 34 }}>
            <h4>Sådan får du det bedste resultat</h4>
            <div className="rv-example-list">
              {GUIDANCE.map((line) => (
                <div className="rv-example-item" key={line}>
                  <CheckIcon />
                  <span>{line}</span>
                </div>
              ))}
            </div>
          </div>

          {error && <p className="rv-field-error">{error}</p>}

          <div style={{ marginTop: 34 }}>
            <button
              type="button"
              className="rv-btn rv-btn-primary"
              disabled={!photo}
              onClick={() => photo && onContinue(photo)}
            >
              Brug dette billede
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function UploadIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M12 16V8" />
      <path d="M8.5 11.5L12 8l3.5 3.5" />
      <path d="M6 18h12a4 4 0 0 0 0-8 5.5 5.5 0 0 0-10.7-1.6A4 4 0 0 0 6 18z" />
    </svg>
  );
}
function XIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M18 6L6 18" />
      <path d="M6 6l12 12" />
    </svg>
  );
}
function CheckIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}
