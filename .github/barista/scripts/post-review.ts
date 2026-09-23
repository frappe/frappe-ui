#!/usr/bin/env bun
// Posts the final review from claude-code-action's execution JSON. Claude
// produces the review, while the workflow owns delivery to GitHub.

import { $ } from "bun";
import { unlink } from "node:fs/promises";
import { parseCommentId, resolveMarkerFile } from "./add-comment.ts";

export async function readPostedCommentId(markerFile: string): Promise<string | undefined> {
  const marker = Bun.file(markerFile);
  if (!(await marker.exists())) return undefined;

  const commentId = parseCommentId(await marker.text());
  if (!commentId) throw new Error(`Invalid comment id in ${markerFile}`);
  return commentId;
}

export function extractFinalReview(data: unknown): string | undefined {
  if (!Array.isArray(data)) return undefined;

  for (let index = data.length - 1; index >= 0; index--) {
    const message = data[index];
    if (!message || typeof message !== "object" || Array.isArray(message)) continue;

    const result = message as Record<string, unknown>;
    if (
      result.type === "result" &&
      result.subtype === "success" &&
      result.is_error === false &&
      typeof result.result === "string" &&
      result.result.trim()
    ) {
      return result.result.trim();
    }
  }

  return undefined;
}

async function main() {
  const markerFile = resolveMarkerFile();
  const existingCommentId = await readPostedCommentId(markerFile);
  if (existingCommentId) {
    console.log(`Review already posted as comment ${existingCommentId}`);
    return;
  }

  const executionFile = process.env.EXECUTION_FILE;
  if (!executionFile) { console.error("EXECUTION_FILE not set"); process.exit(1); }

  const file = Bun.file(executionFile);
  if (!(await file.exists())) {
    console.error(`No execution file at ${executionFile}`);
    process.exit(1);
  }

  const review = extractFinalReview(await file.json());
  if (!review) {
    console.error("Claude completed without a final review");
    process.exit(1);
  }

  const reviewFile = `/tmp/barista-review-${process.pid}.md`;
  await Bun.write(reviewFile, review);
  try {
    await $`./.github/barista/scripts/add-comment.ts --file ${reviewFile}`;
  } finally {
    await unlink(reviewFile).catch(() => undefined);
  }

  const commentId = await readPostedCommentId(markerFile);
  if (!commentId) {
    console.error(`Review command created no marker at ${markerFile}`);
    process.exit(1);
  }
  console.log(`Verified review comment ${commentId}`);
}

if (import.meta.main) {
  try {
    await main();
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}
