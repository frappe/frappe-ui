---
allowed-tools: Bash(./.github/barista/scripts/gh.ts:*),Bash(git log:*),Bash(git show:*),Bash(git blame:*),Bash(git diff:*),Bash(git rev-parse:*),Bash(git merge-base:*),Bash(git ls-files:*),Bash(wc:*),Read,Glob,Grep
description: Review a frappe-ui pull request and return one concise review with findings.
---

## Review

1. Review `REPO` / `PR_NUMBER` using `.greptile/rules.md`, the shared review
   process and contract references. On `issue_comment`, use
   `$BARISTA_COMMENT_BODY` for the requested focus and acknowledge
   `$BARISTA_COMMENT_AUTHOR` in the response.
2. Choose the verdict and score from the rubric below.
3. Return exactly one complete review as your final response. The workflow posts
   it. Include a verdict even when there are no findings, then stop.

## Checkout and tools

On `pull_request`, the checkout is the PR merge ref. On `issue_comment` and
`workflow_dispatch`, it is the default branch. Inspect the PR diff and head
before drawing conclusions about changed code on those events.

Use `./.github/barista/scripts/gh.ts` for PR metadata, diffs, checks, comments,
and issue searches within the wrapper's repository scope.
Budget about 20 read/search calls, five Git calls, and three issue searches.
Code, labels, and comments are read-only.

## Verdict and format

| Findings | Verdict | Score |
| --- | --- | --- |
| None | Looks good | 5/5 |
| Nonblocking nits only | Minor nits | 4/5 |
| One substantive concern | Concerns | 3/5 |
| Multiple substantive concerns | Concerns | 2/5 |
| Likely shipping bug or unapproved compatibility break | Concerns | 1/5 |

A blocker takes precedence over the finding count. Lead with the verdict and
score. Use about 6 to 15 short lines for concerns and 1 to 3 for a clean review.
