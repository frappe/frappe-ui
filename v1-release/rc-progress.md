# RC implementation progress

Orchestration state for the work described in [rc-implementation-handoff.md](rc-implementation-handoff.md).
Another agent can resume from this file plus the per-track checkpoints in `checkpoints/`.

Base for every branch: `main` @ `2d65281be8` (`v1.0.0-beta.62`).

## Tracks

| Track | Branch | Worktree | Ticket | State |
| --- | --- | --- | --- | --- |
| Rail rename | `v1/rc-rail` | `~/Projects/worktrees/rc-rail` | #1116 | **done**, 5 commits, head `017c9acb97` |
| Input scale + form typography | `v1/rc-inputs` | `~/Projects/worktrees/rc-inputs` | #1117, #1118 | **done**, head `a576d0f4b0` |
| List responsive columns | `v1/rc-list` | `~/Projects/worktrees/rc-list` | #1097 | **done**, head `37c7853adc` |
| Integration | `v1/rc-api` | `~/Projects/worktrees/rc-integration` | #1029, #1091, #1098 | running |

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

## Inputs track result (done)

Branch `v1/rc-inputs`, head `a576d0f4b0`, 57 files. Checkpoint: `v1-release/checkpoints/inputs.md`.

Six declarations of the scale unified (`InputSize`, `SelectionSize`, `ItemListSize`, `ComboboxSize`,
`MultiSelectSize`, Select's inline union). 13 class maps gained `xs` and lost `xl`. `FormControl.size`
widened to the full scale, with an `lg` to `md` clamp for `type="checkbox"`, which renders on `ToggleSize`.
Every size lookup now routes through the existing `resolvePropValue`, so a stale `xl` falls back to `sm`
and warns once instead of shipping an element with no geometry classes.

Verified: type-check clean, `yarn test` 102 files / 1674 tests, `docs:check` matches, 17 input-family
Cypress specs 452/452. Measured in a real browser: 24/28/32/40px at xs/sm/md/lg bare, with prefix and
suffix, and in dark. Textarea and every label and description are 13px at all four sizes.

Contrast finding: the old `ink-gray-5` label and description measured 4.18:1 in both themes, a WCAG AA
failure. The accepted `ink-gray-6` gives 7.80:1 light and 6.29:1 dark. The disabled description moved
`ink-gray-3` to `ink-gray-4` to match the disabled label.

Consumer census (full-source grep of 25 local bench checkouts plus complete tarball greps of 24 remote
repositories, not `gh search code`): input `size="xl"` has **one** hit org-wide, a size-showcase story in
`frappe/frappe`'s `@framework/ui`, and no product call sites. `FormLabel.size` has 31 sites (helpdesk 21,
gameplan 4, books 3, suite 2, lms 1), every one the literal `size="md"` with no dynamic bindings, so the
migration is deleting an attribute. Unverified: frappe private repositories, `canvas-kit`, `lending`, and
all consumers outside the frappe organisation.

Open, not fixed, out of D2/D3 scope: `TextInput`, `Textarea`, `Password` and `Rating` render
`InputLabel` and `InputDescription` without passing `:disabled`, so a disabled stack field keeps a
full-strength label, while the inline-row controls dim theirs. Both components already have the prop
wired. Pre-existing. Worth deciding before the tag.

## List track result (done)

Branch `v1/rc-list`, head `37c7853adc`, base `1380a431d3`. Checkpoint: `v1-release/checkpoints/list.md`.

`columns` now takes `{ base, <screen>... }` beside the array. Resolution is pure CSS: `List.vue` writes one
inline carrier per supplied tier, and the new `tailwind/listColumns.js` reads the app's resolved
`theme('screens')` and emits a per-root reset plus one ascending media rule per screen, each picking the
highest supplied tier through a `var()` fallback chain down to `base`. The per-root reset is what makes
every List own its template, including roots with no `columns`. The generated rules use bare attribute
specificity rather than `:where()`, because in the dev build the package stylesheet's base tier lands
after the media rules and would win on source order alone.

Verified: Cypress `List.cy.ts` 33/33, `yarn test` 104 files / 1685 tests, type-check clean, `docs:check`
matches. Also verified in the browser at 500 / 900 / 1440px (header and rows identical at every width,
nested static list unaffected), template inference through a scratch SFC (missing `base` and a non-array
tier both rejected), and an app-customized screens map built through postcss with `md: 900px,
tablet: 850px`, which re-sorts correctly and lands the `md` tier in the same block as `.md:hidden`.

**Decision taken by the maintainer, 2026-09-09:** remove the public `--list-columns` hook and the
`list-cols-[...]` utility, and migrate the seven downstream call sites. Columns are prop-only; the resolved
variable is internal. `--list-gap` and `--list-row-padding-x` stay public and inherited, with their
utilities intact. ADR-0017 rules 3 to 6 and #1097's ancestor-override tests were rewritten to match.

Downstream sites to migrate after this pull request lands (every hit is a `max-<screen>:` variant, so
`max-md:list-cols-[X]` plus `:columns="[Y]"` becomes `:columns="{ base: [X], md: [Y] }"`):

- `frappe/gameplan`: `Configure/CommunitySpacesList.vue`, `Configure/CommunityMembersList.vue`,
  `Configure/CommunitiesList.vue`, `Configure/CommunityGuestsList.vue`
- `frappe/wiki`: `pages/Overview.vue` (two), `components/ContributionsPanel.vue`

No `[--list-columns:` usage was found. `gh search code` truncates silently, so treat seven as a floor.
