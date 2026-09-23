import { describe, expect, test } from "bun:test";
import {
  parseCommentArgs,
  parseCreatedCommentId,
  resolveMarkerFile,
} from "./add-comment.ts";

describe("parseCommentArgs", () => {
  test("treats help flags as help requests", () => {
    expect(parseCommentArgs(["--help"])).toEqual({ type: "help" });
    expect(parseCommentArgs(["-h"])).toEqual({ type: "help" });
  });

  test("preserves comment bodies and files", () => {
    expect(parseCommentArgs(["Review complete"])).toEqual({
      type: "body",
      body: "Review complete",
    });
    expect(parseCommentArgs(["--file", "review.md"])).toEqual({
      type: "file",
      file: "review.md",
    });
  });
});

describe("parseCreatedCommentId", () => {
  test("extracts the id returned by the GitHub API", () => {
    expect(parseCreatedCommentId("5791950878\n")).toBe("5791950878");
  });

  test("rejects a missing or invalid id", () => {
    expect(parseCreatedCommentId("")).toBeUndefined();
    expect(parseCreatedCommentId("null")).toBeUndefined();
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
