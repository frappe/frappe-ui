# RC implementation progress

Orchestration state for the work described in [rc-implementation-handoff.md](rc-implementation-handoff.md).
Another agent can resume from this file plus the per-track checkpoints in `checkpoints/`.

Base for every branch: `main` @ `2d65281be8` (`v1.0.0-beta.62`).

## Tracks

| Track | Branch | Worktree | Ticket | State |
| --- | --- | --- | --- | --- |
| Rail rename | `v1/rc-rail` | `~/Projects/worktrees/rc-rail` | #1116 | running |
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
