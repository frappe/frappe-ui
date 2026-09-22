import { describe, expect, test } from "bun:test";
import { extractFinalReview, parsePostedCommentId } from "./post-review.ts";

describe("extractFinalReview", () => {
  test("returns the final successful result", () => {
    const execution = [
      { type: "assistant", message: { content: "Investigating" } },
      {
        type: "result",
        subtype: "success",
        is_error: false,
        result: "**Looks good (5/5)** — the change is covered.",
      },
    ];

    expect(extractFinalReview(execution)).toBe(
      "**Looks good (5/5)** — the change is covered.",
    );
  });

  test("rejects missing, empty, and failed results", () => {
    expect(extractFinalReview([])).toBeUndefined();
    expect(
      extractFinalReview([
        {
          type: "result",
          subtype: "success",
          is_error: false,
          result: "  ",
        },
      ]),
    ).toBeUndefined();
    expect(
      extractFinalReview([
        {
          type: "result",
          subtype: "success",
          is_error: true,
          result: "API error",
        },
      ]),
    ).toBeUndefined();
  });
});

describe("parsePostedCommentId", () => {
  test("accepts only a numeric marker", () => {
    expect(parsePostedCommentId("12345\n")).toBe("12345");
    expect(parsePostedCommentId("issuecomment-12345")).toBeUndefined();
    expect(parsePostedCommentId("  ")).toBeUndefined();
  });
});
