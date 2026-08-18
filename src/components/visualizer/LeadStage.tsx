"use client";

import { useState } from "react";
import { BUILDING_TYPES, type LeadInfo } from "@/types/visualizer";
import type { RandiHandleProduct } from "@/data/randi-real-products";

interface LeadStageProps {
  product: RandiHandleProduct;
  lead: LeadInfo;
  onContinue: (lead: LeadInfo) => void;
  onBack: () => void;
}

export default function LeadStage({ product, lead, onContinue, onBack }: LeadStageProps) {
  const [form, setForm] = useState<LeadInfo>(lead);
  const [showOptional, setShowOptional] = useState(Boolean(lead.companyName || lead.projectName));
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof LeadInfo>(key: K, value: LeadInfo[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("Indtast en gyldig e-mailadresse.");
      return;
    }
    if (!form.buildingType) {
      setError("Vælg en projekttype.");
      return;
    }
    setError(null);
    onContinue(form);
  }

  return (
    <div className="rv-lead-wrap rv-container-narrow">
      <form className="rv-lead-card" onSubmit={handleSubmit}>
        <button type="button" className="rv-btn-ghost" onClick={onBack} style={{ marginBottom: 18 }}>
          ← {product.name}
        </button>
        <h2>Fortæl os lidt om dit projekt</h2>
        <p>
          Så vi kan vise {product.name} i den rigtige skala — og sende dig et præcist estimat bagefter, hvis du
          ønsker det.
        </p>

        <div className="rv-field">
          <label htmlFor="lead-email">E-mail</label>
          <input
            id="lead-email"
            type="email"
            required
            className="rv-input"
            placeholder="dig@firma.dk"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
          />
        </div>

        <div className="rv-field">
          <label>Projekttype</label>
          <div className="rv-chip-group">
            {BUILDING_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                className={`rv-chip ${form.buildingType === type ? "on" : ""}`}
                onClick={() => update("buildingType", type)}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="rv-field">
          <label>Antal døre</label>
          <div className="rv-stepper">
            <button
              type="button"
              aria-label="Færre døre"
              onClick={() => update("doorCount", Math.max(1, form.doorCount - 1))}
            >
              −
            </button>
            <span className="count">{form.doorCount}</span>
            <button type="button" aria-label="Flere døre" onClick={() => update("doorCount", form.doorCount + 1)}>
              +
            </button>
          </div>
        </div>

        {showOptional ? (
          <>
            <div className="rv-field">
              <label htmlFor="lead-company">Firmanavn (valgfrit)</label>
              <input
                id="lead-company"
                type="text"
                className="rv-input"
                placeholder="Firma A/S"
                value={form.companyName}
                onChange={(e) => update("companyName", e.target.value)}
              />
            </div>
            <div className="rv-field">
              <label htmlFor="lead-project">Projektnavn (valgfrit)</label>
              <input
                id="lead-project"
                type="text"
                className="rv-input"
                placeholder="F.eks. Havnepakhuset"
                value={form.projectName}
                onChange={(e) => update("projectName", e.target.value)}
              />
            </div>
          </>
        ) : (
          <button
            type="button"
            className="rv-expand-btn"
            style={{ marginTop: 26 }}
            onClick={() => setShowOptional(true)}
          >
            + Tilføj firma- og projektnavn
          </button>
        )}

        {error && <p className="rv-field-error">{error}</p>}

        <div className="rv-lead-actions">
          <button type="submit" className="rv-btn rv-btn-primary">
            Fortsæt
          </button>
          <span style={{ fontSize: 12, color: "var(--rv-ink-faint)" }}>Trin 2 af 4</span>
        </div>
      </form>
    </div>
  );
}
