"use client";

import { useEffect, useState } from "react";
import { FileText, Loader2, Lock, ShieldCheck, X } from "lucide-react";
import type { AnalysisResult } from "@/types/analysis";

interface LeadGateModalProps {
  result: AnalysisResult;
  onClose: () => void;
}

interface LeadForm {
  name: string;
  email: string;
  company: string;
  phone: string;
  consent: boolean;
}

const EMPTY_FORM: LeadForm = { name: "", email: "", company: "", phone: "", consent: false };

export default function LeadGateModal({ result, onClose }: LeadGateModalProps) {
  const [form, setForm] = useState<LeadForm>(EMPTY_FORM);
  const [status, setStatus] = useState<"idle" | "submitting" | "error" | "success">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  function update<K extends keyof LeadForm>(key: K, value: LeadForm[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.consent) {
      setErrorMessage("Du skal acceptere at blive kontaktet vedr. dit tilbud.");
      return;
    }
    setStatus("submitting");
    setErrorMessage(null);

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          company: form.company,
          phone: form.phone,
          analysisId: result.id,
          totalDKK: result.totals.totalDKK,
          totalCo2eKg: result.totals.totalCo2eKg,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error ?? "Noget gik galt. Prøv igen.");
        setStatus("error");
        return;
      }

      sessionStorage.setItem(
        "randi-report-payload",
        JSON.stringify({ result, lead: { name: form.name, email: form.email, company: form.company } })
      );
      setStatus("success");
      // Intentionally no "noopener" here: /report is same-origin and reads the payload we just
      // wrote to sessionStorage, which browsers only clone into the new tab when an opener link
      // exists — severing it (as noopener would) leaves the report tab with no data.
      window.open("/report", "_blank");
    } catch {
      setErrorMessage("Kunne ikke sende data. Tjek din forbindelse og prøv igen.");
      setStatus("error");
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="lead-gate-title"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Luk"
          className="absolute right-4 top-4 rounded-full p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-700"
        >
          <X size={18} />
        </button>

        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-randi-copper/10 text-randi-copper">
          <Lock size={20} />
        </div>
        <h2 id="lead-gate-title" className="mt-3 text-lg font-semibold text-randi-ink">
          Lås din komplette rapport op
        </h2>
        <p className="mt-1 text-sm text-stone-500">
          Indtast dine kontaktoplysninger for at downloade den fulde Building Specifier Report
          (stykliste, EPD/CO2e-dokumentation og tilbud) som PDF og JSON.
        </p>

        {status === "success" ? (
          <div className="mt-6 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-700">
            Tak, {form.name.split(" ")[0] || "der"}! Rapporten åbner i en ny fane. Vi kontakter dig
            også via e-mail med et opfølgende tilbud.
            <button
              type="button"
              onClick={onClose}
              className="mt-3 block w-full rounded-lg bg-emerald-600 px-4 py-2 text-center text-sm font-medium text-white hover:bg-emerald-700"
            >
              Luk
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 space-y-3">
            <Field label="Fulde navn" required>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                className={inputClass}
                placeholder="Anna Jensen"
              />
            </Field>
            <Field label="Arbejds-e-mail" required>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                className={inputClass}
                placeholder="anna@virksomhed.dk"
              />
            </Field>
            <Field label="Virksomhed">
              <input
                type="text"
                value={form.company}
                onChange={(e) => update("company", e.target.value)}
                className={inputClass}
                placeholder="Virksomhedsnavn A/S"
              />
            </Field>
            <Field label="Telefon">
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                className={inputClass}
                placeholder="+45 12 34 56 78"
              />
            </Field>

            <label className="flex items-start gap-2 pt-1 text-xs text-stone-500">
              <input
                type="checkbox"
                checked={form.consent}
                onChange={(e) => update("consent", e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-stone-300 text-randi-copper focus:ring-randi-copper"
              />
              Jeg accepterer, at Randi A/S må kontakte mig vedrørende dette projekt og tilbud.
            </label>

            {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}

            <button
              type="submit"
              disabled={status === "submitting"}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-randi-ink px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-randi-graphite disabled:opacity-50"
            >
              {status === "submitting" ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Sender...
                </>
              ) : (
                <>
                  <FileText size={16} /> Download rapport
                </>
              )}
            </button>

            <p className="flex items-center gap-1.5 text-[11px] text-stone-400">
              <ShieldCheck size={13} /> Dine oplysninger bruges kun til opfølgning på dette tilbud.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

const inputClass =
  "mt-1 w-full rounded-lg border border-randi-line bg-white px-3 py-2 text-sm text-randi-ink placeholder:text-stone-400 focus:border-randi-copper focus:outline-none focus:ring-1 focus:ring-randi-copper";

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-xs font-medium text-stone-600">
      {label} {required && <span className="text-randi-copper">*</span>}
      {children}
    </label>
  );
}
