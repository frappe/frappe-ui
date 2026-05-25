#!/usr/bin/env bun
// Adds/removes labels on an issue. Issue number is sourced from
// $BARISTA_ISSUE (set by the workflow) with a fallback to the event payload
// so this also works under workflow_dispatch where the payload lacks .issue.
//
// Usage:
//   ./edit-issue-labels.ts --add-label bug --add-label needs-repro
//   ./edit-issue-labels.ts --remove-label invalid

import { $ } from "bun";
import { readFileSync } from "node:fs";

let issue = process.env.BARISTA_ISSUE ?? "";
if (!/^\d+$/.test(issue)) {
  const eventPath = process.env.GITHUB_EVENT_PATH;
  if (eventPath) {
    const event = JSON.parse(readFileSync(eventPath, "utf8"));
    issue = String(event?.issue?.number ?? "");
  }
}
if (!/^\d+$/.test(issue)) {
  console.error("Error: no issue number resolved (set BARISTA_ISSUE or use an event with .issue)");
  process.exit(1);
}

const addLabels: string[] = [];
const removeLabels: string[] = [];
const argv = process.argv.slice(2);
for (let i = 0; i < argv.length; i++) {
  const arg = argv[i];
  if (arg === "--add-label") {
    const v = argv[++i];
    if (!v) { console.error("Error: --add-label requires a value"); process.exit(1); }
    addLabels.push(v);
  } else if (arg === "--remove-label") {
    const v = argv[++i];
    if (!v) { console.error("Error: --remove-label requires a value"); process.exit(1); }
    removeLabels.push(v);
  } else {
    console.error("Error: unknown argument (only --add-label and --remove-label are accepted)");
    process.exit(1);
  }
}

if (addLabels.length === 0 && removeLabels.length === 0) {
  console.error("Error: no labels supplied");
  process.exit(1);
}

const labelsRaw = (await $`gh label list --limit 500 --json name --jq .[].name`.text()).trim();
const validSet = new Set(labelsRaw.split("\n").filter(Boolean));

const filteredAdd: string[] = [];
for (const label of addLabels) {
  if (validSet.has(label)) filteredAdd.push(label);
  else console.error(`Skipping unknown label (does not exist in repo): ${label}`);
}
const filteredRemove = removeLabels.filter(l => validSet.has(l));

if (filteredAdd.length === 0 && filteredRemove.length === 0) process.exit(0);

const ghArgs: string[] = ["issue", "edit", issue];
for (const l of filteredAdd) ghArgs.push("--add-label", l);
for (const l of filteredRemove) ghArgs.push("--remove-label", l);
await $`gh ${ghArgs}`;

if (filteredAdd.length) console.log(`Added: ${filteredAdd.join(" ")}`);
if (filteredRemove.length) console.log(`Removed: ${filteredRemove.join(" ")}`);
