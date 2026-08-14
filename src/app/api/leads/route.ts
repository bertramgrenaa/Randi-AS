import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

interface LeadPayload {
  name?: string;
  email?: string;
  company?: string;
  phone?: string;
  analysisId?: string;
  totalDKK?: number;
  totalCo2eKg?: number;
}

/**
 * POST /api/leads
 *
 * Mock lead-capture endpoint for the "Building Specifier Report" gate. In a real
 * deployment this would write to a CRM (e.g. HubSpot/Dynamics) — for this MVP it
 * validates the payload and logs it server-side so the B2B lead-gen flow is fully
 * wired end to end, ready to swap in a real integration later.
 */
export async function POST(request: NextRequest) {
  let payload: LeadPayload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Ugyldig anmodning." }, { status: 400 });
  }

  if (!payload.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
    return NextResponse.json({ error: "Ugyldig e-mailadresse." }, { status: 400 });
  }
  if (!payload.name) {
    return NextResponse.json({ error: "Navn er påkrævet." }, { status: 400 });
  }

  const leadId = `lead-${Date.now().toString(36)}`;

  // In production: persist to CRM/DB here.
  console.log("[randi-lead-capture]", {
    leadId,
    ...payload,
    receivedAt: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true, leadId });
}
