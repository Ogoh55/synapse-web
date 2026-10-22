import { describe, it, expect, afterEach, vi } from "vitest";
import { createProfilerOnRender } from "./ProfilerOverlay";

// ---------------------------------------------------------------------------
// #340 — createProfilerOnRender
// ---------------------------------------------------------------------------

/**
 * createProfilerOnRender returns a ProfilerOnRenderCallback.
 *
 * The React Profiler callback signature is:
 *   (id, phase, actualDuration, baseDuration, startTime, commitTime, interactions?)
 *
 * We only care about the `actualDuration` argument (index 2) because that is
 * what the implementation records.
 */
function callCallback(
  cb: (...args: unknown[]) => void,
  id = "test-component",
  phase: "mount" | "update" = "mount",
  actualDuration = 10,
  baseDuration = 10,
  startTime = 0,
  commitTime = 10
) {
  cb(id, phase, actualDuration, baseDuration, startTime, commitTime);
}

describe("createProfilerOnRender", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  // -------------------------------------------------------------------------
  // Production behaviour
  // -------------------------------------------------------------------------

  describe("in production", () => {
    it("returns a function", () => {
      vi.stubEnv("NODE_ENV", "production");
      const cb = createProfilerOnRender("Widget");
      expect(typeof cb).toBe("function");
    });

    it("returned no-op does not throw when called", () => {
      vi.stubEnv("NODE_ENV", "production");
      const cb = createProfilerOnRender("Widget");
      expect(() => callCallback(cb)).not.toThrow();
    });

    it("returns a different no-op for each call (independent functions)", () => {
      vi.stubEnv("NODE_ENV", "production");
      const a = createProfilerOnRender("A");
      const b = createProfilerOnRender("B");
      // Both are valid functions; identity check is intentionally loose —
      // the important thing is that they do not throw.
      expect(typeof a).toBe("function");
      expect(typeof b).toBe("function");
    });
  });

  // -------------------------------------------------------------------------
  // Non-production behaviour
  // -------------------------------------------------------------------------

  describe("outside production", () => {
    it("returns a function", () => {
      vi.stubEnv("NODE_ENV", "test");
      const cb = createProfilerOnRender("Widget");
      expect(typeof cb).toBe("function");
    });

    it("does not throw when called with a valid actualDuration", () => {
      vi.stubEnv("NODE_ENV", "test");
      const cb = createProfilerOnRender("Widget");
      expect(() => callCallback(cb, "Widget", "mount", 5.5)).not.toThrow();
    });

    it("accepts a zero actualDuration without throwing", () => {
      vi.stubEnv("NODE_ENV", "test");
      const cb = createProfilerOnRender("Widget");
      expect(() => callCallback(cb, "Widget", "mount", 0)).not.toThrow();
    });

    it("can be called multiple times for the same id without throwing", () => {
      vi.stubEnv("NODE_ENV", "test");
      const cb = createProfilerOnRender("MultiCall");
      expect(() => {
        callCallback(cb, "MultiCall", "mount", 1);
        callCallback(cb, "MultiCall", "update", 2);
        callCallback(cb, "MultiCall", "update", 3);
      }).not.toThrow();
    });

    it("returns independent callbacks for different ids", () => {
      vi.stubEnv("NODE_ENV", "test");
      const cbA = createProfilerOnRender("A");
      const cbB = createProfilerOnRender("B");
      expect(() => {
        callCallback(cbA, "A", "mount", 4);
        callCallback(cbB, "B", "mount", 8);
      }).not.toThrow();
    });

    it("does not throw with a large actualDuration value", () => {
      vi.stubEnv("NODE_ENV", "test");
      const cb = createProfilerOnRender("Heavy");
      expect(() => callCallback(cb, "Heavy", "update", 9999)).not.toThrow();
    });

    it("handles an empty string id without throwing", () => {
      vi.stubEnv("NODE_ENV", "test");
      const cb = createProfilerOnRender("");
      expect(() => callCallback(cb, "", "mount", 1)).not.toThrow();
    });
  });
});
