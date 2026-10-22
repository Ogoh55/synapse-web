"use client";

import { AMBER, BORDER, DIM, MONO, STATUS_META } from "@/lib/constants";
import type { AppNotification } from "@/lib/notifications/NotificationStore";
import type { TxStatus } from "@/lib/types";

function timeAgo(timestamp: number): string {
  const difference = Math.floor((Date.now() - timestamp) / 1000);
  if (difference < 60) return `${difference}s ago`;
  if (difference < 3600) return `${Math.floor(difference / 60)}m ago`;
  return `${Math.floor(difference / 3600)}h ago`;
}

function statusColor(status?: string): string {
  if (!status) return AMBER;
  return STATUS_META[status.toUpperCase() as TxStatus]?.color ?? AMBER;
}

export function NotificationItem({ notification, onDismiss }: { notification: AppNotification; onDismiss: (id: string) => void }) {
  return (
    <div role="listitem" data-testid="notification-item" style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 14px", borderBottom: `1px solid ${BORDER}`, background: notification.read ? "transparent" : "rgba(245,166,35,0.04)" }}>
      <span aria-hidden="true" style={{ width: 6, height: 6, borderRadius: "50%", background: statusColor(notification.toStatus), marginTop: 4, flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 10, color: "#eee", fontFamily: MONO, wordBreak: "break-word", marginBottom: 3 }}>{notification.message}</div>
        <div style={{ fontSize: 8, color: DIM, fontFamily: MONO, letterSpacing: "0.08em" }}>{timeAgo(notification.timestamp)}</div>
      </div>
      <button onClick={() => onDismiss(notification.id)} aria-label="Dismiss notification" style={{ background: "none", border: "none", color: DIM, cursor: "pointer", fontSize: 11, padding: 2, flexShrink: 0, transition: "color 0.15s" }} onMouseEnter={(event) => (event.currentTarget.style.color = "#fff")} onMouseLeave={(event) => (event.currentTarget.style.color = DIM)}>✕</button>
    </div>
  );
}
