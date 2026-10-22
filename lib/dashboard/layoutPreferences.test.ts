// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from "vitest";
import {
  getDefaultLayout,
  normalizeLayout,
  loadLayout,
  saveLayout,
  DASHBOARD_LAYOUT_STORAGE_KEY,
  DASHBOARD_WIDGETS,
} from "./layoutPreferences";
import type { DashboardLayoutPreferences } from "./layoutPreferences";

const WIDGET_IDS = DASHBOARD_WIDGETS.map((w) => w.id);

beforeEach(() => {
  localStorage.clear();
});

// ─── #333 getDefaultLayout ────────────────────────────────────────────────────

describe("getDefaultLayout", () => {
  it("returns all widget IDs in canonical order", () => {
    const layout = getDefaultLayout();
    expect(layout.order).toEqual(WIDGET_IDS);
  });

  it("returns an empty hidden array", () => {
    const layout = getDefaultLayout();
    expect(layout.hidden).toEqual([]);
  });

  it("returns a fresh copy each call (no shared reference)", () => {
    const a = getDefaultLayout();
    const b = getDefaultLayout();
    a.order.push("statCards");
    expect(b.order).toEqual(WIDGET_IDS);
  });

  it("returned layout has exactly the four known widget IDs", () => {
    const { order } = getDefaultLayout();
    expect(order).toHaveLength(4);
    for (const id of order) {
      expect(WIDGET_IDS).toContain(id);
    }
  });
});

// ─── #334 normalizeLayout ─────────────────────────────────────────────────────

describe("normalizeLayout", () => {
  it("returns the default layout when passed null", () => {
    expect(normalizeLayout(null)).toEqual(getDefaultLayout());
  });

  it("returns the default layout when passed undefined", () => {
    expect(normalizeLayout(undefined)).toEqual(getDefaultLayout());
  });

  it("returns the default layout when passed a non-object primitive", () => {
    expect(normalizeLayout(42)).toEqual(getDefaultLayout());
    expect(normalizeLayout("string")).toEqual(getDefaultLayout());
    expect(normalizeLayout(true)).toEqual(getDefaultLayout());
  });

  it("returns the default layout when passed an empty object", () => {
    expect(normalizeLayout({})).toEqual(getDefaultLayout());
  });

  it("preserves a valid complete order", () => {
    const input = { order: [...WIDGET_IDS], hidden: [] };
    expect(normalizeLayout(input).order).toEqual(WIDGET_IDS);
  });

  it("preserves a valid reordered layout", () => {
    const reversed = [...WIDGET_IDS].reverse();
    const { order } = normalizeLayout({ order: reversed, hidden: [] });
    expect(order).toEqual(reversed);
  });

  it("drops unknown widget IDs from order", () => {
    const { order } = normalizeLayout({
      order: ["statCards", "unknownWidget", "pipeline"],
      hidden: [],
    });
    expect(order).not.toContain("unknownWidget");
  });

  it("appends missing widgets in default order after known ones", () => {
    // Only 'statCards' supplied; remaining three should be appended in default order.
    const { order } = normalizeLayout({ order: ["statCards"], hidden: [] });
    expect(order[0]).toBe("statCards");
    expect(order).toHaveLength(4);
    for (const id of WIDGET_IDS) {
      expect(order).toContain(id);
    }
  });

  it("deduplicates repeated widget IDs, keeping first occurrence", () => {
    const { order } = normalizeLayout({
      order: ["statCards", "statCards", "pipeline"],
      hidden: [],
    });
    const statCardsCount = order.filter((id) => id === "statCards").length;
    expect(statCardsCount).toBe(1);
  });

  it("normalizes a valid hidden list", () => {
    const { hidden } = normalizeLayout({
      order: WIDGET_IDS,
      hidden: ["pipeline"],
    });
    expect(hidden).toEqual(["pipeline"]);
  });

  it("drops unknown IDs from the hidden list", () => {
    const { hidden } = normalizeLayout({
      order: WIDGET_IDS,
      hidden: ["pipeline", "notAWidget"],
    });
    expect(hidden).not.toContain("notAWidget");
    expect(hidden).toContain("pipeline");
  });

  it("deduplicates the hidden list", () => {
    const { hidden } = normalizeLayout({
      order: WIDGET_IDS,
      hidden: ["pipeline", "pipeline"],
    });
    expect(hidden.filter((id) => id === "pipeline")).toHaveLength(1);
  });

  it("handles a non-array order gracefully and still returns all widgets", () => {
    const { order } = normalizeLayout({ order: "bad", hidden: [] });
    expect(order).toEqual(WIDGET_IDS);
  });

  it("handles a non-array hidden gracefully, returning empty hidden", () => {
    const { hidden } = normalizeLayout({ order: WIDGET_IDS, hidden: "bad" });
    expect(hidden).toEqual([]);
  });
});

// ─── #335 loadLayout ──────────────────────────────────────────────────────────

describe("loadLayout", () => {
  it("returns the default layout when localStorage is empty", () => {
    expect(loadLayout()).toEqual(getDefaultLayout());
  });

  it("returns the default layout when the stored value is not valid JSON", () => {
    localStorage.setItem(DASHBOARD_LAYOUT_STORAGE_KEY, "not-json{{{");
    expect(loadLayout()).toEqual(getDefaultLayout());
  });

  it("returns the default layout when the stored value is a JSON primitive", () => {
    localStorage.setItem(DASHBOARD_LAYOUT_STORAGE_KEY, "42");
    expect(loadLayout()).toEqual(getDefaultLayout());
  });

  it("loads and returns a previously saved valid layout", () => {
    const stored: DashboardLayoutPreferences = {
      order: [...WIDGET_IDS].reverse(),
      hidden: ["pipeline"],
    };
    localStorage.setItem(DASHBOARD_LAYOUT_STORAGE_KEY, JSON.stringify(stored));
    const loaded = loadLayout();
    expect(loaded.order).toEqual([...WIDGET_IDS].reverse());
    expect(loaded.hidden).toEqual(["pipeline"]);
  });

  it("normalizes a partial layout loaded from storage", () => {
    const partial = { order: ["statCards"], hidden: [] };
    localStorage.setItem(DASHBOARD_LAYOUT_STORAGE_KEY, JSON.stringify(partial));
    const loaded = loadLayout();
    expect(loaded.order).toHaveLength(4);
    expect(loaded.order[0]).toBe("statCards");
  });

  it("strips unknown widget IDs that were persisted in a stale layout", () => {
    const stale = { order: ["statCards", "legacyWidget", "pipeline"], hidden: [] };
    localStorage.setItem(DASHBOARD_LAYOUT_STORAGE_KEY, JSON.stringify(stale));
    const loaded = loadLayout();
    expect(loaded.order).not.toContain("legacyWidget");
  });

  it("returns the default layout when the stored value is an empty string", () => {
    localStorage.setItem(DASHBOARD_LAYOUT_STORAGE_KEY, "");
    expect(loadLayout()).toEqual(getDefaultLayout());
  });
});

// ─── #336 saveLayout ──────────────────────────────────────────────────────────

describe("saveLayout", () => {
  it("persists a layout to localStorage under the correct key", () => {
    const layout = getDefaultLayout();
    saveLayout(layout);
    expect(localStorage.getItem(DASHBOARD_LAYOUT_STORAGE_KEY)).not.toBeNull();
  });

  it("persists JSON that round-trips back to an equivalent layout", () => {
    const layout: DashboardLayoutPreferences = {
      order: [...WIDGET_IDS].reverse(),
      hidden: ["recentTxTable"],
    };
    saveLayout(layout);
    const raw = localStorage.getItem(DASHBOARD_LAYOUT_STORAGE_KEY);
    expect(raw).not.toBeNull();
    const parsed = JSON.parse(raw!);
    expect(parsed.order).toEqual([...WIDGET_IDS].reverse());
    expect(parsed.hidden).toContain("recentTxTable");
  });

  it("normalizes the layout before persisting (drops unknown IDs)", () => {
    const layout = {
      order: ["statCards", "unknownWidget", "pipeline", "contractInfoPanel", "recentTxTable"],
      hidden: [],
    } as unknown as DashboardLayoutPreferences;
    saveLayout(layout);
    const stored = JSON.parse(localStorage.getItem(DASHBOARD_LAYOUT_STORAGE_KEY)!);
    expect(stored.order).not.toContain("unknownWidget");
  });

  it("overwrites any previously saved layout", () => {
    const first = getDefaultLayout();
    saveLayout(first);

    const second: DashboardLayoutPreferences = {
      order: [...WIDGET_IDS].reverse(),
      hidden: ["pipeline"],
    };
    saveLayout(second);

    const stored = JSON.parse(localStorage.getItem(DASHBOARD_LAYOUT_STORAGE_KEY)!);
    expect(stored.hidden).toContain("pipeline");
  });

  it("can be read back correctly by loadLayout", () => {
    const layout: DashboardLayoutPreferences = {
      order: [...WIDGET_IDS].reverse(),
      hidden: ["contractInfoPanel"],
    };
    saveLayout(layout);
    const loaded = loadLayout();
    expect(loaded.order).toEqual([...WIDGET_IDS].reverse());
    expect(loaded.hidden).toContain("contractInfoPanel");
  });

  it("saves an empty hidden array correctly", () => {
    saveLayout({ order: WIDGET_IDS, hidden: [] });
    const stored = JSON.parse(localStorage.getItem(DASHBOARD_LAYOUT_STORAGE_KEY)!);
    expect(stored.hidden).toEqual([]);
  });

  it("saves a layout with multiple hidden widgets correctly", () => {
    const layout: DashboardLayoutPreferences = {
      order: WIDGET_IDS,
      hidden: ["pipeline", "recentTxTable"],
    };
    saveLayout(layout);
    const stored = JSON.parse(localStorage.getItem(DASHBOARD_LAYOUT_STORAGE_KEY)!);
    expect(stored.hidden).toEqual(expect.arrayContaining(["pipeline", "recentTxTable"]));
  });
});
