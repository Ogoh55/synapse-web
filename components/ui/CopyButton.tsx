"use client";
import React from "react";
import { useToast } from "@/components/ui/Toast";
import { DIM, NEUTRAL } from "@/lib/constants";

interface CopyButtonProps {
  value: string;
  label?: string;
  style?: React.CSSProperties;
}

export function CopyButton({ value, label = "Value", style }: CopyButtonProps) {
  const { toast } = useToast();

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering row clicks / modal closures
    if (!value) return;

    navigator.clipboard
      .writeText(value)
      .then(() => {
        toast(`${label} copied to clipboard`, "success");
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
        toast("Failed to copy to clipboard", "error");
      });
  };

  return (
    <button
      onClick={handleCopy}
      title={`Copy ${label}`}
      aria-label={`Copy ${label}`}
      style={{
        background: "none",
        border: "none",
        color: DIM,
        cursor: "pointer",
        padding: "2px 4px",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "color 0.15s, transform 0.1s",
        verticalAlign: "middle",
        ...style,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = NEUTRAL;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = DIM;
      }}
      onMouseDown={(e) => {
        e.currentTarget.style.transform = "scale(0.9)";
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = "scale(1)";
      }}
    >
      <svg
        width="11"
        height="11"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
      </svg>
    </button>
  );
}
