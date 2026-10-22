"use client";
import { ACCENT_WEAK, AMBER, FG_MUTED, MONO } from "@/lib/constants";

export function SorobanTip({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 8,
        padding: "8px 12px",
        background: ACCENT_WEAK,
        borderLeft: `2px solid ${AMBER}`,
        marginTop: 10,
      }}
    >
      <span
        style={{
          color: AMBER,
          fontWeight: 700,
          fontSize: 10,
          fontFamily: MONO,
          whiteSpace: "nowrap",
          paddingTop: 1,
        }}
      >
        ⬡ SOROBAN:
      </span>
      <span
        style={{
          color: FG_MUTED,
          fontSize: 11,
          fontFamily: MONO,
          lineHeight: 1.6,
        }}
      >
        {children}
      </span>
    </div>
  );
}
