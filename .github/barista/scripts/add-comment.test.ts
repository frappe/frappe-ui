import { describe, expect, test } from "bun:test";
import { parseCommentId, resolveMarkerFile } from "./add-comment.ts";

describe("parseCommentId", () => {
  test("extracts the id from a gh issue comment URL", () => {
    expect(parseCommentId("https://github.com/frappe/frappe-ui/issues/751#issuecomment-4603536352"))
      .toBe("4603536352");
  });

  test("extracts the id from a PR-thread comment URL", () => {
    expect(parseCommentId("https://github.com/frappe/frappe-ui/pull/896#issuecomment-5178987334"))
      .toBe("5178987334");
  });

  test("returns undefined for output with no comment id", () => {
    expect(parseCommentId("")).toBeUndefined();
    expect(parseCommentId("gh: something went wrong")).toBeUndefined();
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
