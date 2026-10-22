"use client";

import { useEffect } from "react";
import {
  ACCENT_WEAK,
  AMBER,
  BG1,
  BG2,
  BORDER,
  DIM,
  MONO,
  NEUTRAL,
  ON_ACCENT,
} from "@/lib/constants";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: 24,
        background: `linear-gradient(180deg, ${BG2}, ${BG1})`,
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: 560,
          padding: 24,
          border: `1px solid ${BORDER}`,
          borderRadius: 12,
          background: BG1,
          boxShadow: `0 0 0 1px ${ACCENT_WEAK}, 0 18px 80px rgba(0,0,0,0.45)`,
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "5px 10px",
            border: `1px solid ${BORDER}`,
            background: ACCENT_WEAK,
            color: AMBER,
            fontSize: 11,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          Application error
        </div>

        <h1 style={{ margin: "16px 0 10px", fontSize: 28, color: NEUTRAL }}>
          Something went wrong
        </h1>

        <p style={{ margin: 0, color: DIM, lineHeight: 1.6 }}>
          The app hit an unexpected render error. You can safely retry this route and recover the
          interface without restarting the whole page.
        </p>

        <button
          onClick={() => reset()}
          style={{
            marginTop: 18,
            padding: "10px 16px",
            background: AMBER,
            color: ON_ACCENT,
            border: "none",
            cursor: "pointer",
            fontWeight: 700,
            fontFamily: MONO,
            letterSpacing: "0.08em",
          }}
        >
          Try again
        </button>
      </section>
    </main>
  );
}
