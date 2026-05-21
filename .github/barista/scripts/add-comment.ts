#!/usr/bin/env bun
// Posts a single comment on the current issue. Issue number is sourced from
// $BARISTA_ISSUE with a fallback to the event payload.
//
// Usage:
//   ./add-comment.ts "Body text, multi-line OK"
//   ./add-comment.ts --file body.md

import { $ } from "bun";
import { readFileSync } from "node:fs";

let issue = process.env.BARISTA_ISSUE ?? "";
if (!/^\d+$/.test(issue)) {
  const eventPath = process.env.GITHUB_EVENT_PATH;
  if (!eventPath) {
    console.error("Error: GITHUB_EVENT_PATH not set");
    process.exit(1);
  }
  const event = JSON.parse(readFileSync(eventPath, "utf8"));
  issue = String(event?.issue?.number ?? "");
}
if (!/^\d+$/.test(issue)) {
  console.error("Error: no issue number resolved");
  process.exit(1);
}

const argv = process.argv.slice(2);
if (argv[0] === "--file") {
  const file = argv[1];
  if (!file) { console.error("Error: --file requires a path"); process.exit(1); }
  if (!(await Bun.file(file).exists())) {
    console.error(`Error: file not found: ${file}`);
    process.exit(1);
  }
  await $`gh issue comment ${issue} --body-file ${file}`;
} else {
  const body = argv[0];
  if (!body) { console.error("Error: body required"); process.exit(1); }
  await $`gh issue comment ${issue} --body ${body}`;
}

console.log(`Commented on #${issue}`);
