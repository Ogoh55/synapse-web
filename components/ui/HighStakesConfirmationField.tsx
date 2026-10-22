"use client";

import type { RefObject } from "react";
import { BG3, BORDER, DIM, MONO, STATUS_META } from "@/lib/constants";

const DANGER = STATUS_META.FAILED.color;

export function HighStakesConfirmationField({ label, confirmValue, typed, matched, inputRef, onChange }: { label: string; confirmValue: string; typed: string; matched: boolean; inputRef: RefObject<HTMLInputElement | null>; onChange: (value: string) => void }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <label htmlFor="hsc-input" style={{ display: "block", fontSize: 10, letterSpacing: "0.1em", color: DIM, marginBottom: 6 }}>{label}</label>
      <input id="hsc-input" data-testid="hsc-input" ref={inputRef} type="text" value={typed} onChange={(event) => onChange(event.target.value)} placeholder={confirmValue} spellCheck={false} autoComplete="off" aria-describedby="hsc-match-feedback" style={{ width: "100%", boxSizing: "border-box", padding: "9px 12px", background: BG3, border: `1px solid ${matched ? DANGER + "99" : BORDER}`, color: matched ? DANGER : "var(--fg)", fontFamily: MONO, fontSize: 11, outline: "none", transition: "border-color 0.15s, color 0.15s" }} />
      <div id="hsc-match-feedback" data-testid="hsc-feedback" aria-live="polite" style={{ fontSize: 10, marginTop: 5, letterSpacing: "0.04em", minHeight: 16, color: matched ? STATUS_META.COMPLETED.color : DANGER }}>
        {typed.length > 0 && !matched && "value mismatch — confirm button remains locked"}
        {matched && "✓ match confirmed"}
      </div>
    </div>
  );
}
