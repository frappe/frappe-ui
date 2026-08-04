import { describe, expect, test } from "bun:test";
import {
  applyFooter,
  buildFooter,
  extractStats,
  fmtK,
  resolveMarkerFile,
  STATS_MARKER,
  type Stats,
} from "./append-stats.ts";

// Loosely mirrors claude-code-action's execution JSON: usage is nested a
// few levels deep inside per-turn message objects, and duration/cost/model
// live at the top-level result object.
const SAMPLE_EXECUTION = {
  type: "result",
  subtype: "success",
  duration_ms: 41118,
  total_cost_usd: 0.363063,
  model: "claude-opus-5",
  turns: [
    { role: "assistant", message: { usage: { input_tokens: 20, output_tokens: 1200, cache_read_input_tokens: 400000 } } },
    { role: "assistant", message: { usage: { input_tokens: 30, output_tokens: 1600, cache_read_input_tokens: 425000 } } },
  ],
};

describe("extractStats", () => {
  test("sums usage fields across nested turns", () => {
    const stats = extractStats(SAMPLE_EXECUTION);
    expect(stats.inputTokens).toBe(50);
    expect(stats.outputTokens).toBe(2800);
    expect(stats.cacheRead).toBe(825000);
  });

  test("picks up the first top-level cost/duration/model", () => {
    const stats = extractStats(SAMPLE_EXECUTION);
    expect(stats.totalCost).toBeCloseTo(0.363063);
    expect(stats.durationMs).toBe(41118);
    expect(stats.model).toBe("claude-opus-5");
  });

  test("defaults gracefully on a shape with no usage/cost data", () => {
    const stats = extractStats({ foo: "bar" });
    expect(stats.inputTokens).toBe(0);
    expect(stats.outputTokens).toBe(0);
    expect(stats.cacheRead).toBe(0);
    expect(stats.totalCost).toBeNull();
    expect(stats.durationMs).toBe(0);
    expect(stats.model).toBe("claude");
  });
});

describe("fmtK", () => {
  test("leaves small numbers as-is", () => {
    expect(fmtK(50)).toBe("50");
    expect(fmtK(0)).toBe("0");
  });

  test("formats thousands with one decimal below 10k", () => {
    expect(fmtK(2800)).toBe("2.8k");
  });

  test("rounds to whole k at 10k and above", () => {
    expect(fmtK(825000)).toBe("825k");
    expect(fmtK(10500)).toBe("11k"); // Math.round(10500/1000) = 11 (round-half-up)
  });

  test("guards against negative/non-finite input", () => {
    expect(fmtK(-5)).toBe("0");
    expect(fmtK(NaN)).toBe("0");
  });
});

describe("buildFooter / applyFooter", () => {
  const stats: Stats = {
    inputTokens: 50,
    outputTokens: 2800,
    cacheRead: 825000,
    totalCost: 0.363063,
    durationMs: 41118,
    model: "claude-opus-5",
  };

  test("footer contains the marker and formatted stats", () => {
    const footer = buildFooter(stats);
    expect(footer).toContain(STATS_MARKER);
    expect(footer).toContain("claude-opus-5");
    expect(footer).toContain("50 in / 2.8k out");
    expect(footer).toContain("825k cached");
    expect(footer).toContain("41s");
    expect(footer).toContain("$0.363");
  });

  test("falls back to an em dash when cost is missing", () => {
    const footer = buildFooter({ ...stats, totalCost: null });
    expect(footer).toContain("—");
  });

  test("appends to a body with no existing footer", () => {
    const body = applyFooter("Looks good, small change.", stats);
    expect(body.startsWith("Looks good, small change.")).toBe(true);
    expect(body).toContain(STATS_MARKER);
  });

  test("replaces a previous footer instead of double-appending (idempotent)", () => {
    const firstPass = applyFooter("Looks good, small change.", stats);
    const staleStats: Stats = { ...stats, durationMs: 999999, totalCost: 9.999 };
    const secondPass = applyFooter(firstPass, staleStats);

    expect(secondPass.match(new RegExp(STATS_MARKER, "g"))?.length).toBe(1);
    expect(secondPass).toContain("$9.999");
    expect(secondPass).not.toContain("$0.363");
    expect(secondPass.startsWith("Looks good, small change.")).toBe(true);
  });
});

describe("resolveMarkerFile", () => {
  test("uses BARISTA_COMMENT_ID_FILE when set", () => {
    expect(resolveMarkerFile({ BARISTA_COMMENT_ID_FILE: "/tmp/custom-marker" } as NodeJS.ProcessEnv))
      .toBe("/tmp/custom-marker");
  });

  test("falls back to /tmp/barista-comment-id", () => {
    expect(resolveMarkerFile({} as NodeJS.ProcessEnv)).toBe("/tmp/barista-comment-id");
  });
});
