#!/usr/bin/env bun
// Posts a single comment on the current issue. Issue number is sourced from
// $BARISTA_ISSUE with a fallback to the event payload.
//
// Records the posted comment's id to a marker file on disk (path from
// $BARISTA_COMMENT_ID_FILE, default /tmp/barista-comment-id) so a later
// step in the same job — append-stats.ts — can attach the run's stats to
// the comment this run actually posted, instead of guessing.
//
// Usage:
//   ./add-comment.ts "Body text, multi-line OK"
//   ./add-comment.ts --file body.md

import { $ } from "bun";
import { readFileSync } from "node:fs";

// Exported for tests — pure parsing, no I/O.
export function parseCommentId(ghOutputUrl: string): string | undefined {
  return ghOutputUrl.match(/issuecomment-(\d+)/)?.[1];
}

export function resolveMarkerFile(env: NodeJS.ProcessEnv = process.env): string {
  return env.BARISTA_COMMENT_ID_FILE || "/tmp/barista-comment-id";
}

async function main() {
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
  let url: string;
  if (argv[0] === "--file") {
    const file = argv[1];
    if (!file) { console.error("Error: --file requires a path"); process.exit(1); }
    if (!(await Bun.file(file).exists())) {
      console.error(`Error: file not found: ${file}`);
      process.exit(1);
    }
    url = (await $`gh issue comment ${issue} --body-file ${file}`.text()).trim();
  } else {
    const body = argv[0];
    if (!body) { console.error("Error: body required"); process.exit(1); }
    url = (await $`gh issue comment ${issue} --body ${body}`.text()).trim();
  }

  const commentId = parseCommentId(url);
  if (commentId) {
    await Bun.write(resolveMarkerFile(), commentId);
  } else {
    console.error(`Warning: couldn't parse comment id from gh output: ${url}`);
  }

  console.log(`Commented on #${issue}`);
}

if (import.meta.main) await main();
