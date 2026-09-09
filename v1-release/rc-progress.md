# RC implementation progress

Orchestration state for the work described in [rc-implementation-handoff.md](rc-implementation-handoff.md).
Another agent can resume from this file plus the per-track checkpoints in `checkpoints/`.

Base for every branch: `main` @ `2d65281be8` (`v1.0.0-beta.62`).

## Tracks

| Track | Branch | Worktree | Ticket | State |
| --- | --- | --- | --- | --- |
| Rail rename | `v1/rc-rail` | `~/Projects/worktrees/rc-rail` | #1116 | **done**, 5 commits, head `017c9acb97` |
| Input scale + form typography | `v1/rc-inputs` | `~/Projects/worktrees/rc-inputs` | #1117, #1118 | running |
| List responsive columns | `v1/rc-list` | `~/Projects/worktrees/rc-list` | #1097 | running |
| Integration | `v1/rc-api` | to be created | #1029, #1091, #1098 | not started |

Charts (#1128) stays with Saqib and is out of this queue.

## Decisions taken during orchestration

- **`v1/rc-list` is based on `main` + PR #1097 merged in** (merge commit `1380a431d3`, changelog conflict resolved by keeping both sections). #1097 froze the list CSS styling-hook contract and recorded ADR-0017; the responsive-columns work has to revise its ancestor-inheritance rule, so it revises it in place. The final pull request therefore supersedes #1097.
- Ticket reconciliation comments posted 2026-09-09 on #1116, #1117 and #1118, recording D1, D2 and D3. #1118's comment states the one override of its own body: Textarea text is a flat 13px, it does not scale per size.
- One pull request for all three tracks, per the request. Implementation agents commit locally only; the integration agent merges the three branches, then pushes and opens the pull request.

## Environment notes

- The data volume has roughly 690 MB free. Agents are told to skip `yarn build`, `yarn docs:build` and full Cypress runs, and to run Cypress with video off for touched specs only.
- Each worktree has its own `node_modules`, cloned copy-on-write from the primary checkout, so no agent runs `yarn install`.

## Notes for the integration track

- Public types (#1091, branch `fix/exported-types-1070`) and duplicate model emits (#1098, branch `fix/duplicate-emit-1096`) are both small and open. #1091 touches `shared/picker/PickerShell.vue`, which the input track also touches, so merge it after `v1/rc-inputs` and expect one conflict there.
- Local consumer clones for the read-only migration check: `~/Projects/gameplan` and `~/Projects/helpdesk`. There is no local CRM clone. `~/Projects/gameplan/frappe-ui` is itself a live worktree of this repository on another branch — read it, never write to it.
- Booting the consumer apps needs a bench that is not set up here. Record any consumer check that could not run as unverified rather than dropping it.

## Rail track result (done)

Branch `v1/rc-rail`, head `017c9acb97`, 24 files, +364/-140, all moves done with `git mv`.
Full detail in `v1-release/checkpoints/rail.md` on that branch, including the #1116 draft comment.

Verified there: `yarn type-check` clean before and after, `yarn docs:check` reports the committed
tables match, full `yarn test` 102 files / 1670 tests passed, Cypress `SidebarRail.cy.ts` 7/7 and
`DesktopShell.cy.ts` 3/3. Screenshots in `/tmp/rc-rail-shots/`.

Carried forward to integration:

- `data-slot` values gained the prefix (`rail` -> `sidebar-rail`, `rail-item`, `rail-item-indicator`,
  `rail-item-badge-dot`). That half of the break is silent, so consumer CSS needs a grep for
  `data-slot="rail` and `[data-slot=rail`.
- `SidebarRailItemProps` is now exported from the barrel. It existed but was unexported, unlike
  `SidebarItemProps`. One added line to the public surface; revert if unwanted.
- No codemod, by the rule in `migration.md`: only `tokens-v2` and `shortcuts-v1` have one, every other
  rename is a hand edit. The import break is loud.
- No v0 migration-guide section: `Rail` was added during the v1 betas and does not exist in v0.1.278.
- Cypress in an agent shell needs `env -u ELECTRON_RUN_AS_NODE` in front of it, or the Electron binary
  boots as plain Node and fails to find its app bundle. Not a code problem.
- `yarn docs:gen` reorders emit rows in `src/charts/docs/{Area,Bar,Line}Chart.api.md`. Pre-existing
  drift, `docs:check` ignores row order, so leave Saqib's files alone.
