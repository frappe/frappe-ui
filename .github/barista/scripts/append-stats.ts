#!/usr/bin/env bun
// Reads the claude-code-action execution file and appends a one-line
// stats footer to barista's most recent comment on the issue.
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

const data = await file.json();

function* walk(obj: unknown): Generator<Record<string, unknown>> {
  if (obj && typeof obj === "object") {
    if (!Array.isArray(obj)) yield obj as Record<string, unknown>;
    for (const v of Array.isArray(obj) ? obj : Object.values(obj)) yield* walk(v);
  }
}

function sumUsage(field: string): number {
  let total = 0;
  for (const o of walk(data)) {
    const usage = o.usage as Record<string, unknown> | undefined;
    if (usage && typeof usage[field] === "number") total += usage[field] as number;
  }
  return total;
}

function firstField<T = unknown>(field: string): T | null {
  for (const o of walk(data)) {
    if (o[field] !== undefined && o[field] !== null) return o[field] as T;
  }
  return null;
}

const inputTokens = sumUsage("input_tokens");
const outputTokens = sumUsage("output_tokens");
const cacheRead = sumUsage("cache_read_input_tokens");
const totalCost = firstField<number>("total_cost_usd");
const durationMs = firstField<number>("duration_ms") ?? 0;
const model = firstField<string>("model") ?? "claude";

function fmtK(n: number): string {
  if (!Number.isFinite(n) || n < 0) return "0";
  if (n < 1000) return String(n);
  if (n < 10000) return (n / 1000).toFixed(1) + "k";
  return Math.round(n / 1000) + "k";
}

const inputFmt = fmtK(inputTokens);
const outputFmt = fmtK(outputTokens);
const cacheReadFmt = fmtK(cacheRead);
const durationFmt = durationMs > 0 ? `${Math.floor(durationMs / 1000)}s` : "?";
const costFmt = typeof totalCost === "number" ? `$${totalCost.toFixed(3)}` : "—";

const commentsJson = await $`gh api repos/${repo}/issues/${issueNumber}/comments --paginate`.text();
const comments = JSON.parse(commentsJson) as Array<{
  id: number;
  created_at: string;
  user?: { type?: string; login?: string };
}>;
const last = comments
  .filter(c => c.user?.type === "Bot" && c.user.login?.startsWith("barista"))
  .sort((a, b) => a.created_at.localeCompare(b.created_at))
  .at(-1);

if (!last) {
  console.log(`No barista comment found on #${issueNumber} — nothing to append stats to.`);
  process.exit(0);
}

const commentId = last.id;
const currentBody = await $`gh api repos/${repo}/issues/comments/${commentId} --jq .body`.text();

const MARKER = "<!-- barista-stats -->";
const idx = currentBody.indexOf(MARKER);
const stripped = (idx >= 0 ? currentBody.slice(0, idx) : currentBody).replace(/\s+$/, "");

const footer = `\n\n${MARKER}\n<sub><i>barista · ${model} · ${inputFmt} in / ${outputFmt} out · ${cacheReadFmt} cached · ${durationFmt} · ${costFmt}</i></sub>`;
const newBody = stripped + footer;

const tmp = `/tmp/barista-stats-${commentId}.json`;
await Bun.write(tmp, JSON.stringify({ body: newBody }));
await $`gh api -X PATCH repos/${repo}/issues/comments/${commentId} --input ${tmp}`.quiet();

console.log(`Appended stats footer to comment ${commentId} on #${issueNumber}`);
