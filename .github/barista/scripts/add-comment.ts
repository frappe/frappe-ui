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

const USAGE = `Usage:
  ./add-comment.ts "Body text, multi-line OK"
  ./add-comment.ts --file body.md`;

type CommentArgs =
  | { type: "help" }
  | { type: "file"; file: string | undefined }
  | { type: "body"; body: string | undefined };

export function parseCommentArgs(argv: string[]): CommentArgs {
  if (argv[0] === "--help" || argv[0] === "-h") return { type: "help" };
  if (argv[0] === "--file") return { type: "file", file: argv[1] };
  return { type: "body", body: argv[0] };
}

// Exported for tests — pure parsing, no I/O.
export function parseCommentId(value: string): string | undefined {
  const commentId = value.trim();
  return /^\d+$/.test(commentId) ? commentId : undefined;
}

export function resolveMarkerFile(env: NodeJS.ProcessEnv = process.env): string {
  return env.BARISTA_COMMENT_ID_FILE || "/tmp/barista-comment-id";
}

async function main() {
  const input = parseCommentArgs(process.argv.slice(2));
  if (input.type === "help") {
    console.log(USAGE);
    return;
  }

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

  const repo = process.env.GITHUB_REPOSITORY ?? "";
  if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repo)) {
    console.error("Error: GITHUB_REPOSITORY must be an owner/repo name");
    process.exit(1);
  }

  let createdId: string;
  if (input.type === "file") {
    const file = input.file;
    if (!file) { console.error("Error: --file requires a path"); process.exit(1); }
    if (!(await Bun.file(file).exists())) {
      console.error(`Error: file not found: ${file}`);
      process.exit(1);
    }
    createdId = await $`gh api --method POST repos/${repo}/issues/${issue}/comments --field ${`body=@${file}`} --jq .id`.text();
  } else {
    const body = input.body ?? "";
    if (!body) { console.error("Error: body required"); process.exit(1); }
    createdId = await $`gh api --method POST repos/${repo}/issues/${issue}/comments --raw-field body=${body} --jq .id`.text();
  }

  const commentId = parseCommentId(createdId);
  if (!commentId) {
    console.error(`Error: GitHub returned an invalid comment id: ${createdId.trim()}`);
    process.exit(1);
  }
  await Bun.write(resolveMarkerFile(), commentId);

  console.log(`Commented on #${issue}`);
}

if (import.meta.main) await main();
