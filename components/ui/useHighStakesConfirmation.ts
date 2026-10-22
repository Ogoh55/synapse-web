"use client";

import { useEffect, useRef, useState } from "react";

export function useHighStakesConfirmation(confirmValue: string, onCancel: () => void) {
  const [typed, setTyped] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onCancel]);

  return { typed, setTyped, inputRef, matched: typed === confirmValue };
}
