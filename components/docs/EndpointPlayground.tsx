"use client";

import { useState } from "react";
import { ABI_ENDPOINTS, AMBER, BORDER, DIM, MONO } from "@/lib/constants";
import { encodeArg } from "@/lib/soroban/args";
import { simulateCall, submitCall } from "@/lib/soroban/contract";

const STATE_CHANGING = new Set(["one-time", "relay_signer", "admin"]);

export function EndpointPlayground({ endpoint }: { endpoint: (typeof ABI_ENDPOINTS)[number] }) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const params = endpoint.params ?? [];

  function buildArgs() {
    return params.map((parameter) => encodeArg(parameter.type, values[parameter.name] ?? ""));
  }

  async function execute(action: "simulate" | "submit") {
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const response = action === "simulate"
        ? await simulateCall(endpoint.name, buildArgs())
        : await submitCall(endpoint.name, buildArgs());
      setResult(JSON.stringify(response, null, 2));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : String(caught));
    } finally {
      setBusy(false);
      if (action === "submit") setConfirming(false);
    }
  }

  return (
    <div style={{ marginTop: 12, borderTop: `1px solid ${BORDER}`, paddingTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
      {params.length === 0 && <div style={{ fontFamily: MONO, fontSize: 10, color: DIM }}>No parameters — call directly.</div>}
      {params.map((parameter) => (
        <label key={parameter.name} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span style={{ fontFamily: MONO, fontSize: 9, color: DIM, letterSpacing: "0.08em" }}>{parameter.name} · {parameter.type}</span>
          <input value={values[parameter.name] ?? ""} onChange={(event) => setValues((current) => ({ ...current, [parameter.name]: event.target.value }))} placeholder={parameter.type} style={{ background: "#0E1116", border: `1px solid ${BORDER}`, color: "#fff", fontFamily: MONO, fontSize: 11, padding: "6px 8px", outline: "none" }} />
        </label>
      ))}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button type="button" onClick={() => execute("simulate")} disabled={busy} style={{ fontFamily: MONO, fontSize: 10, letterSpacing: "0.08em", padding: "6px 14px", background: "transparent", border: `1px solid ${AMBER}`, color: AMBER, cursor: busy ? "wait" : "pointer" }}>SIMULATE</button>
        {STATE_CHANGING.has(endpoint.access) && <button type="button" onClick={() => setConfirming(true)} disabled={busy} style={{ fontFamily: MONO, fontSize: 10, letterSpacing: "0.08em", padding: "6px 14px", background: "transparent", border: "1px solid #EF5350", color: "#EF5350", cursor: busy ? "wait" : "pointer" }}>SUBMIT</button>}
      </div>
      {confirming && (
        <div style={{ border: "1px solid #EF5350", background: "#1A1113", padding: "10px 12px", display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ fontFamily: MONO, fontSize: 10, color: "#EF5350", lineHeight: 1.6 }}>WARNING: {endpoint.name} is a state-changing entrypoint. Submitting will sign and broadcast a real transaction on the connected network. Continue?</div>
          <div style={{ display: "flex", gap: 8 }}>
            <button type="button" onClick={() => execute("submit")} disabled={busy} style={{ fontFamily: MONO, fontSize: 10, padding: "5px 12px", background: "#EF5350", border: "none", color: "#0E1116", cursor: busy ? "wait" : "pointer" }}>CONFIRM SUBMIT</button>
            <button type="button" onClick={() => setConfirming(false)} disabled={busy} style={{ fontFamily: MONO, fontSize: 10, padding: "5px 12px", background: "transparent", border: `1px solid ${BORDER}`, color: DIM, cursor: "pointer" }}>CANCEL</button>
          </div>
        </div>
      )}
      {error && <pre style={{ fontFamily: MONO, fontSize: 10, color: "#EF5350", whiteSpace: "pre-wrap", margin: 0 }}>{error}</pre>}
      {result && <pre style={{ fontFamily: MONO, fontSize: 10, color: "#66BB6A", whiteSpace: "pre-wrap", margin: 0 }}>{result}</pre>}
    </div>
  );
}
