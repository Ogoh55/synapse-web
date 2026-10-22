import type { KeyboardEvent } from "react";
import type { Tab } from "@/components/Shell";
import { AMBER, DIM, MONO } from "@/lib/constants";

interface ShellTabButtonProps {
  tab: Tab;
  active: boolean;
  mobile: boolean;
  onSelect: () => void;
  onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => void;
}

export function ShellTabButton({ tab, active, mobile, onSelect, onKeyDown }: ShellTabButtonProps) {
  return (
    <button
      id={`tab-${tab}`}
      role="tab"
      aria-selected={active}
      aria-controls={`tabpanel-${tab}`}
      tabIndex={active ? 0 : -1}
      data-tour={tab}
      onClick={onSelect}
      onKeyDown={onKeyDown}
      style={{
        padding: mobile ? "12px 16px" : "12px 22px",
        background: "none",
        border: "none",
        cursor: "pointer",
        fontFamily: MONO,
        fontSize: 11,
        letterSpacing: "0.1em",
        color: active ? "var(--fg-strong)" : DIM,
        borderBottom: active ? `2px solid ${AMBER}` : "2px solid transparent",
        marginBottom: -1,
        transition: "color 0.15s",
        flex: mobile ? "1 0 auto" : undefined,
        whiteSpace: "nowrap",
        outlineOffset: "-2px",
      }}
      onMouseEnter={(event) => {
        if (!active) event.currentTarget.style.color = "var(--fg-hover)";
      }}
      onMouseLeave={(event) => {
        if (!active) event.currentTarget.style.color = DIM;
      }}
    >
      {tab.toUpperCase()}
    </button>
  );
}
