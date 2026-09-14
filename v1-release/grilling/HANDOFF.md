# Handoff: folding grilling answers into the RC decisions

Read this when the maintainer pastes answers copied from one of the grilling pages in this folder. The paste looks like:

```
## <area-slug> <QID> — <title>
choice: <option text or (not answered)>
answer: <free text or (none)>
```

## Where everything is

All under `v1-release/` in this worktree (`.claude/worktrees/agent-a47f898eabb187fe2`, branch main, untracked files, nothing committed yet):

- `rc-api-audit.md` — the audit findings (source of every question).
- `rc-api-decisions.md` — the running decision log, rounds 1 to 4. Append; do not rewrite earlier rounds.
- `rc-medium-triage.md` — MEDIUM findings sorted into A mechanical / B real decision / C can wait.
- `rc-open-questions.md` — researched answers to the maintainer's earlier questions.
- `rc-migration-effort.md` — measured consumer migration cost per change (tiers T0 to T3, per-app site counts).
- `grilling/*.html` — the nine area pages; `_shared.js` defines the storage and copy format; `README.md` the page contract.
- `rc-api-audit-review.html` — the earlier single-page review (superseded by the grilling pages, keep for history).

Delegated elsewhere: charts → https://github.com/frappe/frappe-ui/issues/1139 (nextchamp-saqib); Tree → https://github.com/frappe/frappe-ui/issues/1142 (shahzeelahmed).

## What to do with a paste

1. Append a section `## Grilling answers: <area> (<date>)` to `rc-api-decisions.md` with one table row per question: QID, covered source ids (from the page's `QUESTIONS` array), status (decided / open / skipped), the chosen option, and the free-text answer verbatim.
2. For every answer that asks a question or requests research, get the facts before replying: use codex CLI (`codex exec -s workspace-write ... < /dev/null`) or an Opus subagent, never Fable subagents. Put the answer in `rc-open-questions.md` under a new heading and summarise it in the reply.
3. If an answer overrides an earlier decision, say so explicitly in the reply and in the table.
4. If an answer asks for a GitHub issue, confirm the assignee's login from `git log` or `gh api` before creating it, then link it from the table.
5. Do not edit the grilling pages while the maintainer is mid-review. Section ids, option order, and the localStorage key prefix `frappe-ui-rc-grill:` must stay as they are, or saved answers are lost.
6. When all nine pages are folded in, build the RC work list: one PR per family, mechanical items and decided items first, with the API decisions listed at the top of each PR. The maintainer does not want unnecessary renames or breaks; use `rc-migration-effort.md` numbers when a decision is still marginal.

## Standing rules for this work

- Subagents must not post, comment, push, merge, or write outside this repo without the maintainer's confirmation; put that limit in every subagent prompt.
- Plain English in everything user-facing. No metaphors.
- Never bare `git stash` in this worktree.

## Execution stage (from 2026-09-14)

All nine pages are folded in; every question is decided or deferred. `v1-release/rc-work-list.md` is the plan: 18 PRs in a fixed order, each listing the QIDs it implements, files, consumer sites, migration-guide lines, dependencies, and size. Both conflicts in its "Conflicts and gaps" list were settled on 2026-09-14 (row state is `active|inactive` plus `data-selected`; Tooltip is exempt from the open controls rule). The remaining gaps are spec/ADR edits that belong inside the PR they relate to. The orchestration brief is `v1-release/EXECUTION.md`.

How to run one PR in a fresh session: start from the work-list section for that PR, create a branch off current main in a new worktree (never bare `git stash`), write the codemod first when the PR has one and run it on this tree, regenerate API docs (`yarn docs:gen`, `yarn docs:check`), add the migration-guide lines to `docs/content/docs/migration.md`, update the specs named in the gaps list, title the PR with `!` when anything breaks, and open it as a normal PR (not draft). Consumer follow-ups happen after the frappe-ui PR merges. Record the PR number next to its work-list section when opened.
