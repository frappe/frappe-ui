#!/usr/bin/env bun
// Reads the claude-code-action execution file and appends a one-line
// stats footer to the comment THIS run posted, per the marker file
// add-comment.ts writes when it posts (path from $BARISTA_COMMENT_ID_FILE,
// default /tmp/barista-comment-id).
//
// If no marker file exists, this run didn't post a comment (e.g. triage
// deciding there's nothing worth saying, or a bug that stopped it before
// posting) — skip rather than guessing at "the most recent barista
// comment", which could be a stale comment from an earlier run.
//
// Expected env:
//   EXECUTION_FILE  — path to action's JSON output
//   ISSUE_NUMBER    — issue we're triaging
//   REPO            — owner/repo
//   GH_TOKEN        — barista app token (must be able to PATCH the bot's own comment)
//
// Idempotent: re-running won't double-append because we check for the
// <!-- barista-stats --> marker and replace it.

import { $ } from "bun";

export const STATS_MARKER = "<!-- barista-stats -->";

export function* walk(obj: unknown): Generator<Record<string, unknown>> {
  if (obj && typeof obj === "object") {
    if (!Array.isArray(obj)) yield obj as Record<string, unknown>;
    for (const v of Array.isArray(obj) ? obj : Object.values(obj)) yield* walk(v);
  }
}

export function sumUsage(data: unknown, field: string): number {
  let total = 0;
  for (const o of walk(data)) {
    const usage = o.usage as Record<string, unknown> | undefined;
    if (usage && typeof usage[field] === "number") total += usage[field] as number;
  }
  return total;
}

export function firstField<T = unknown>(data: unknown, field: string): T | null {
  for (const o of walk(data)) {
    if (o[field] !== undefined && o[field] !== null) return o[field] as T;
  }
  return null;
}

export function fmtK(n: number): string {
  if (!Number.isFinite(n) || n < 0) return "0";
  if (n < 1000) return String(n);
  if (n < 10000) return (n / 1000).toFixed(1) + "k";
  return Math.round(n / 1000) + "k";
}

export interface Stats {
  inputTokens: number;
  outputTokens: number;
  cacheRead: number;
  totalCost: number | null;
  durationMs: number;
  model: string;
}

// Pulls run stats out of claude-code-action's execution JSON. The shape
// isn't stable across nested tool-call/result objects, so we walk the
// whole tree rather than assume a fixed path.
export function extractStats(data: unknown): Stats {
  return {
    inputTokens: sumUsage(data, "input_tokens"),
    outputTokens: sumUsage(data, "output_tokens"),
    cacheRead: sumUsage(data, "cache_read_input_tokens"),
    totalCost: firstField<number>(data, "total_cost_usd"),
    durationMs: firstField<number>(data, "duration_ms") ?? 0,
    model: firstField<string>(data, "model") ?? "claude",
  };
}

// Pure formatting — no I/O — so it's cheap to test against known-shape
// execution JSON without touching the network or the filesystem.
export function buildFooter(stats: Stats): string {
  const inputFmt = fmtK(stats.inputTokens);
  const outputFmt = fmtK(stats.outputTokens);
  const cacheReadFmt = fmtK(stats.cacheRead);
  const durationFmt = stats.durationMs > 0 ? `${Math.floor(stats.durationMs / 1000)}s` : "?";
  const costFmt = typeof stats.totalCost === "number" ? `$${stats.totalCost.toFixed(3)}` : "—";
  return `\n\n${STATS_MARKER}\n<sub><i>barista · ${stats.model} · ${inputFmt} in / ${outputFmt} out · ${cacheReadFmt} cached · ${durationFmt} · ${costFmt}</i></sub>`;
}

// Idempotent: strips a previous footer (if any) before appending the new
// one, so re-running on the same comment doesn't double-append.
export function applyFooter(currentBody: string, stats: Stats): string {
  const idx = currentBody.indexOf(STATS_MARKER);
  const stripped = (idx >= 0 ? currentBody.slice(0, idx) : currentBody).replace(/\s+$/, "");
  return stripped + buildFooter(stats);
}

export function resolveMarkerFile(env: NodeJS.ProcessEnv = process.env): string {
  return env.BARISTA_COMMENT_ID_FILE || "/tmp/barista-comment-id";
}

async function main() {
  const executionFile = process.env.EXECUTION_FILE;
  const issueNumber = process.env.ISSUE_NUMBER;
  const repo = process.env.REPO;
  if (!executionFile) { console.error("EXECUTION_FILE not set"); process.exit(1); }
  if (!issueNumber) { console.error("ISSUE_NUMBER not set"); process.exit(1); }
  if (!repo) { console.error("REPO not set"); process.exit(1); }

  const file = Bun.file(executionFile);
  if (!(await file.exists())) {
    console.error(`No execution file at ${executionFile} — skipping stats footer.`);
    process.exit(0);
  }

  const stats = extractStats(await file.json());

  const markerFile = resolveMarkerFile();
  const markerFileHandle = Bun.file(markerFile);
  if (!(await markerFileHandle.exists())) {
    console.log(`No comment posted this run (no ${markerFile}) — skipping stats footer.`);
    process.exit(0);
  }
  const commentId = (await markerFileHandle.text()).trim();
  if (!/^\d+$/.test(commentId)) {
    console.error(`Invalid comment id in ${markerFile}: ${commentId}`);
    process.exit(1);
  }
  const currentBody = await $`gh api repos/${repo}/issues/comments/${commentId} --jq .body`.text();
  const newBody = applyFooter(currentBody, stats);

  const tmp = `/tmp/barista-stats-${commentId}.json`;
  await Bun.write(tmp, JSON.stringify({ body: newBody }));
  await $`gh api -X PATCH repos/${repo}/issues/comments/${commentId} --input ${tmp}`.quiet();

  console.log(`Appended stats footer to comment ${commentId} on #${issueNumber}`);
}

if (import.meta.main) await main();
