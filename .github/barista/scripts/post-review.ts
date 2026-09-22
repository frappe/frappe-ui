#!/usr/bin/env bun
// Posts the final review from claude-code-action's execution JSON. Claude
// produces the review, while the workflow owns delivery to GitHub.

import { $ } from "bun";

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

  await $`./.github/barista/scripts/add-comment.ts ${review}`;
}

if (import.meta.main) await main();
