"use client";

import { BG2, BORDER, DIM, MONO, TEXT } from "@/lib/constants";

export function TourControls({ step, totalSteps, onSkip, onBack, onNext }: { step: number; totalSteps: number; onSkip: () => void; onBack: () => void; onNext: () => void }) {
  const isLast = step === totalSteps - 1;
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
      <button type="button" onClick={onSkip} style={{ background: "transparent", border: "none", color: DIM, fontFamily: MONO, fontSize: 11, cursor: "pointer", padding: 0 }}>Skip tour</button>
      <div style={{ display: "flex", gap: 8 }}>
        {step > 0 && <button type="button" onClick={onBack} style={{ background: "transparent", border: `1px solid ${BORDER}`, color: TEXT, fontFamily: MONO, fontSize: 11, cursor: "pointer", padding: "6px 12px" }}>Back</button>}
        <button type="button" onClick={onNext} style={{ background: TEXT, border: `1px solid ${TEXT}`, color: BG2, fontFamily: MONO, fontSize: 11, cursor: "pointer", padding: "6px 12px" }}>{isLast ? "Finish" : "Next"}</button>
      </div>
    </div>
  );
}
