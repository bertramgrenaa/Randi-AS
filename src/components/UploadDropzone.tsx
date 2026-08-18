"use client";

import { useCallback, useRef, useState } from "react";
import { FileText, ImageIcon, Loader2, UploadCloud, X } from "lucide-react";

const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp", "application/pdf"];
const MAX_SIZE_BYTES = 15 * 1024 * 1024;

interface UploadDropzoneProps {
  onSubmit: (file: File, notes: string) => void;
  isSubmitting?: boolean;
}

export default function UploadDropzone({ onSubmit, isSubmitting }: UploadDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const acceptFile = useCallback((candidate: File | undefined) => {
    if (!candidate) return;
    if (!ACCEPTED_TYPES.includes(candidate.type)) {
      setError("Filtypen understøttes ikke. Upload PNG, JPG/JPEG, WEBP eller PDF.");
      return;
    }
    if (candidate.size > MAX_SIZE_BYTES) {
      setError("Filen er for stor. Maks. 15 MB.");
      return;
    }
    setError(null);
    setFile(candidate);
    setPreviewUrl(candidate.type.startsWith("image/") ? URL.createObjectURL(candidate) : null);
  }, []);

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
    acceptFile(e.dataTransfer.files?.[0]);
  }

  function clearFile() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(null);
    setPreviewUrl(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="w-full">
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload billede eller dørskema"
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`relative flex min-h-64 w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-8 text-center transition-colors ${
          isDragging
            ? "border-randi-accent bg-randi-accent/5"
            : "border-randi-line bg-white hover:border-randi-accent/50 hover:bg-randi-accent/[0.03]"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_TYPES.join(",")}
          className="hidden"
          onChange={(e) => acceptFile(e.target.files?.[0])}
        />

        {!file && (
          <>
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-randi-accent/10 text-randi-accent">
              <UploadCloud size={28} />
            </div>
            <div>
              <p className="text-base font-medium text-randi-ink">
                Træk et billede eller dørskema hertil
              </p>
              <p className="mt-1 text-sm text-stone-500">
                eller klik for at vælge en fil — PNG, JPG, WEBP eller PDF (maks. 15 MB)
              </p>
            </div>
          </>
        )}

        {file && (
          <div
            className="flex w-full max-w-md items-center gap-4 rounded-xl border border-randi-line bg-randi-cream p-4 text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white ring-1 ring-randi-line">
              {previewUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
              ) : (
                <FileText className="text-stone-400" size={26} />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-randi-ink">{file.name}</p>
              <p className="text-xs text-stone-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
            <button
              type="button"
              onClick={clearFile}
              aria-label="Fjern fil"
              className="rounded-full p-1.5 text-stone-400 hover:bg-stone-200 hover:text-stone-700"
            >
              <X size={16} />
            </button>
          </div>
        )}
      </div>

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

      <div className="mt-4">
        <label htmlFor="notes" className="text-sm font-medium text-randi-ink">
          Noter til projektet <span className="font-normal text-stone-400">(valgfrit)</span>
        </label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder='F.eks. "Kontorbygning, 3 etager, ønsker et gennemgående look i stål"'
          rows={2}
          className="mt-1.5 w-full rounded-lg border border-randi-line bg-white px-3 py-2 text-sm text-randi-ink placeholder:text-stone-400 focus:border-randi-accent focus:outline-none focus:ring-1 focus:ring-randi-accent"
        />
      </div>

      <div className="mt-5 flex items-center gap-3">
        <ImageIcon size={16} className="text-stone-400" />
        <p className="text-xs text-stone-500">
          Billedet analyseres kun til dette projekt og gemmes ikke permanent.
        </p>
      </div>

      <button
        type="button"
        disabled={!file || isSubmitting}
        onClick={() => file && onSubmit(file, notes)}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-randi-ink px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-randi-graphite disabled:cursor-not-allowed disabled:opacity-40"
      >
        {isSubmitting ? (
          <>
            <Loader2 size={18} className="animate-spin" /> Analyserer...
          </>
        ) : (
          "Start AI-analyse"
        )}
      </button>
    </div>
  );
}
