#!/usr/bin/env bun
// Read-only `gh` wrapper. Restricts subcommands and flags so the agent
// cannot mutate state via this script. Write operations live in
// sibling scripts (edit-issue-labels.ts, add-comment.ts) with their own
// allowlists.
//
// Usage:
//   ./gh.ts issue view 123
//   ./gh.ts issue view 123 --comments
//   ./gh.ts issue list --state open --limit 20
//   ./gh.ts search issues "query" --limit 10
//   ./gh.ts label list --limit 100
//   ./gh.ts pr view 123
//   ./gh.ts pr view 123 --comments
//   ./gh.ts pr diff 123
//   ./gh.ts pr checks 123
//   ./gh.ts pr status
//   ./gh.ts release list --limit 5
//   ./gh.ts release view <tag>

import { $ } from "bun";

const repo = process.env.GH_REPO || process.env.GITHUB_REPOSITORY || "";
if (!repo || repo.split("/").length !== 2 || !repo.split("/").every(Boolean)) {
  console.error("Error: GH_REPO or GITHUB_REPOSITORY must be set to owner/repo format");
  process.exit(1);
}
process.env.GH_REPO = repo;
process.env.GH_HOST = "github.com";

const ALLOWED_CMDS = new Set([
  "issue view", "issue list", "search issues", "label list",
  "pr view", "pr diff", "pr checks", "pr status",
  "release list", "release view",
]);
const ALLOWED_FLAGS = new Set(["--comments", "--state", "--limit", "--label"]);
const FLAGS_WITH_VALUES = new Set(["--state", "--limit", "--label"]);

const argv = process.argv.slice(2);
const sub1 = argv[0] ?? "";
const sub2 = argv[1] ?? "";
const cmd = `${sub1} ${sub2}`;

if (!ALLOWED_CMDS.has(cmd)) {
  const list = [...ALLOWED_CMDS].map(c => `'${c}'`).join(", ");
  console.error(`Error: only ${list} are allowed`);
  process.exit(1);
}

const positional: string[] = [];
const flags: string[] = [];
let skipNext = false;
for (const arg of argv.slice(2)) {
  if (skipNext) { flags.push(arg); skipNext = false; continue; }
  if (arg.startsWith("-")) {
    const flag = arg.split("=")[0];
    if (!ALLOWED_FLAGS.has(flag)) {
      console.error("Error: only --comments, --state, --limit, --label flags are allowed");
      process.exit(1);
    }
    flags.push(arg);
    if (!arg.includes("=") && FLAGS_WITH_VALUES.has(flag)) skipNext = true;
  } else {
    positional.push(arg);
  }
}

async function runGh(extra: string[]) {
  await $`gh ${sub1} ${sub2} ${extra}`;
}

if (cmd === "search issues") {
  const query = positional[0] ?? "";
  const lower = query.toLowerCase();
  if (lower.includes("repo:") || lower.includes("org:") || lower.includes("user:")) {
    console.error("Error: search query must not contain repo:, org:, or user: qualifiers");
    process.exit(1);
  }
  await runGh([query, "--repo", repo, ...flags]);
} else if (cmd === "issue view" || cmd === "pr view" || cmd === "pr diff" || cmd === "pr checks") {
  if (positional.length !== 1 || !/^\d+$/.test(positional[0])) {
    console.error(`Error: ${cmd} requires exactly one numeric number`);
    process.exit(1);
  }
  await runGh([positional[0], ...flags]);
} else if (cmd === "release view") {
  if (positional.length !== 1 || !/^[A-Za-z0-9._-]+$/.test(positional[0])) {
    console.error(`Error: ${cmd} requires exactly one tag (alphanumerics, dot, dash, underscore)`);
    process.exit(1);
  }
  await runGh([positional[0], ...flags]);
} else {
  if (positional.length !== 0) {
    console.error("Error: this subcommand does not accept positional arguments");
    process.exit(1);
  }
  await runGh([...flags]);
}
