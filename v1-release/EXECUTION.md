# Executing the RC work list

Brief for the session that orchestrates the 18 PRs in `rc-work-list.md`. Give the orchestrator this file. Everything else it needs is linked from here.

## Inputs

| File | Use it for |
| --- | --- |
| `rc-work-list.md` | What to build. One section per PR: QIDs, files, consumer sites, migration-guide lines, dependencies, size. Record PR numbers here. |
| `rc-api-decisions.md` | Why, and the exact shapes. Every QID row has the chosen option and the maintainer's own words. Round 5 settles Tooltip (exempt) and row state (`active|inactive` plus `data-selected`). When a work-list line is ambiguous, this file wins. |
| `rc-open-questions.md` | Research behind the decisions: codemod coverage numbers, consumer call sites, type shapes that were tried. |
| `rc-migration-effort.md` | Per-app site counts. If a PR finds more sites than measured, stop and report. |
| `grilling/0N-*.html` | The context each decision was made against. Read only when a decision row is unclear. |

Codemods live in `scripts/` (see `scripts/migrate-shortcuts-v1.js` and its test for the pattern).

## Authority

- Pushing branches and opening PRs on `frappe/frappe-ui` is authorized.
- Merging, commenting on other people's PRs or issues, and changing any consumer app (gameplan, crm, helpdesk, builder, wiki, frappe_books, frappe/ui) are not. Consumer follow-ups come after the frappe-ui PR merges and need a separate go-ahead.
- Put these limits in every subagent prompt.
- Subagents run on Opus or the codex CLI, never Fable.

## Order

Follow "Suggested execution order" in the work list. PRs 1 to 7 go first and land before anything that depends on them. Base every branch on current `origin/main`, not on another PR's branch: stacked PRs get no bot review. Run in parallel only PRs whose "Dependencies" lines do not reference each other. The maintainer merges; the orchestrator waits for the merge before starting a dependent PR.

## One PR, start to finish

1. New worktree off `origin/main`, branch named `v1/<short-topic>`. Run `yarn install` there. Never bare `git stash`.
2. Read the PR section, then every QID row it names in `rc-api-decisions.md`.
3. Codemod first when the section says one exists, with a test. Run it on the frappe-ui tree itself, then diff for anything it missed.
4. Implement. Update the spec and ADR files the "Conflicts and gaps" list names for that PR.
5. `yarn test`, the Cypress specs for touched components, `yarn type-check` (baseline is red in `vitepress/`, nothing else), `yarn docs:gen` then `yarn docs:check`.
6. Add the section's migration-guide lines to `docs/content/docs/migration.md`.
7. Merge `origin/main` and re-run the codemod once more before pushing.
8. PR title exactly as the work list gives it, with the `!`. Body lists the QIDs, the migration lines, and the consumer site counts. Normal PR, not draft. Keep it under 100 files or Greptile skips it.
9. Wait for Greptile, fix real findings, then post `/barista review` once as the last comment. Any later comment cancels barista's run.
10. Write the PR number next to the section heading in `rc-work-list.md` and commit that on the `v1-rc-api-decisions` branch.

## Stop and ask when

- A decision row does not give the exact type or name the code needs.
- Consumer sites exceed the measured count, or a change breaks a site the effort file does not list.
- A test that is green on `main` goes red for a reason the PR did not intend.
- Two PRs need the same file in conflicting ways.
