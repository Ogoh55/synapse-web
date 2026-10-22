"use client";

import { AMBER, BG2, BG3, DIM, STATUS_META } from "@/lib/constants";
import { shortId } from "@/lib/utils";

interface ContractOptionProps {
  contract: { id: string; name: string; isCustom?: boolean };
  selected: boolean;
  onSelect: (id: string) => void;
  onRemove: (id: string, name: string) => void;
}

export function ContractOption({ contract, selected, onSelect, onRemove }: ContractOptionProps) {
  return (
    <div role="button" tabIndex={0} aria-pressed={selected} onClick={() => onSelect(contract.id)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onSelect(contract.id); } }} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "7px 10px", background: selected ? "rgba(245,166,35,0.12)" : BG2, border: `1px solid ${selected ? AMBER : "transparent"}`, cursor: "pointer", transition: "all 0.15s" }} onMouseEnter={(event) => { if (!selected) event.currentTarget.style.background = BG3; }} onMouseLeave={(event) => { if (!selected) event.currentTarget.style.background = BG2; }}>
      <div style={{ display: "flex", flexDirection: "column", minWidth: 0, flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 11, fontWeight: selected ? 700 : 500, color: selected ? AMBER : "#eee", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{contract.name}</span>
          {selected && <span style={{ fontSize: 8, padding: "1px 4px", background: "rgba(245,166,35,0.2)", color: AMBER, border: `1px solid ${AMBER}66` }}>ACTIVE</span>}
        </div>
        <span style={{ fontSize: 9, color: DIM, wordBreak: "break-all" }}>{shortId(contract.id, 8)}</span>
      </div>
      {contract.isCustom && <button type="button" title="Remove contract" onClick={(event) => { event.stopPropagation(); onRemove(contract.id, contract.name); }} style={{ background: "none", border: "none", color: DIM, fontSize: 12, cursor: "pointer", padding: "2px 6px", marginLeft: 6 }} onMouseEnter={(event) => (event.currentTarget.style.color = STATUS_META.FAILED.color)} onMouseLeave={(event) => (event.currentTarget.style.color = DIM)}>✕</button>}
    </div>
  );
}
