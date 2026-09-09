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
| Integration | `v1/rc-api` | `~/Projects/worktrees/rc-integration` | #1029, #1091, #1098 | **done**, head `9ffb6372a7` + checkpoint |

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

## Integration track result (done)

Branch `v1/rc-api`, base `2d65281be8`. Checkpoint: `v1-release/checkpoints/integration.md`.
Nothing pushed, no pull request opened, no issue or pull-request comment posted.

### Merges

| Merge commit | Branch | Head merged | Conflicts |
| --- | --- | --- | --- |
| `853a9fb497` | `v1/rc-rail` | `017c9acb97` | none |
| `6a13955d1f` | `v1/rc-inputs` | `a576d0f4b0` | none |
| `45ae6f39af` | `v1/rc-list` | `37c7853adc` | none |
| `1cad8f0453` | `pr-1098` | `bd37c29581` | none |
| `673c68675a` | `pr-1091` | `ec08af334f` | none |

**Zero textual conflicts.** The three predicted collisions did not happen: the rail track
is the only one that touches `src/index.ts`; the changelog regions were disjoint (and the
inputs track added no entry at all); and #1091's `PickerShell` hunks are disjoint from the
inputs track's `size` widening. `yarn type-check` was clean after each merge.

Integration commits: `9b6b79b4bd`, `d35b728324`, `9ffb6372a7`.

### Checks (verbatim)

| Command | Result |
| --- | --- |
| `yarn type-check` | `Done in 8.49s.` — clean |
| `yarn test` | `Test Files 104 passed (104)`, `Tests 1689 passed (1689)` |
| `yarn docs:gen` + `yarn docs:check` | `The committed API tables match the source.` |
| Cypress, 29 touched specs | `All specs passed! 00:51 625 625 - - -` |

`src/charts/docs/{Area,Bar,Line}Chart.api.md` reverted after every `docs:gen`, as both
earlier tracks recorded. `yarn build` and `yarn docs:build` not run.

### What #1091 and #1098 needed after merging

- #1098's added JSDoc on the `defineModel` calls **appends** to the props-interface
  description in `propsgen`, so four Combobox/MultiSelect props rendered their description
  twice. Canonical text stays in `types.ts`; the SFC carries a plain comment.
- #1091 left `PickerShell.vue` with a stray `</slot>` after removing the `<slot name="target">`
  opening tag. `vue-tsc` passes (Vue's parser drops it with a warning); fixed anyway.
- #1091 duplicated `TreeProps.expanded`'s description the same way. Fixed.
- #1091 added `TabButtonsSlots` but never exported it, unlike every other `*Slots` type. Now
  exported. `ContextMenuEmits` also sorted into place in its barrel.
- The dead `#target` slot needed no changelog entry: `changelog.md:1335` and `migration.md:195`
  already document it as removed. The code contradicted the published docs.

### Public surface changed during integration

Additive only, and each revertible in one commit:

- `DividerAction` exported and documented. It was referenced by `DividerProps.action` and
  printed in the API table, but had no `export` keyword and no member docs — the §4 audit item.
- `InputSize`, `InputVariant`, `ToggleSize`, `RangeSize` exported from the root. Nine
  components print `size: InputSize` in their tables, and the derived aliases
  (`ComboboxSize`, `MultiSelectSize`, `ItemListSize`) were already exported while the base
  was not.
- `TabButtonsSlots` exported.

Method: every `type: '…'` string in every committed `*.api.md` was tokenized to 98
PascalCase names and imported from `./index` under `vue-tsc`. 22 did not resolve; the six
this release owns were fixed, the rest recorded in the checkpoint.

### Changelog

The inputs track shipped `migration.md` but **no changelog entry**, so the release's largest
break was missing from the log. Three entries added — input scale, form typography, and
#1098's removed emit interface members with a table of which members went and which runtime
events stayed. The three track entries were cross-read and do not contradict each other.

Also corrected: `docs/content/public/llms.txt` (hand-written, so the rail rename never
reached it — two stale entries, one pointing at a route that no longer exists) and
`skills/frappe-ui/CORE.md` (four stale claims: input sizes `sm | md | lg | xl`,
`FormControl` size `sm | md`, `ItemListRow` size, and `--list-columns` taught as a public
hook).

### Open finding for the maintainer — untyped `@update:model-value`

`update:modelValue` is declared twice — once by `defineModel`, once in the hand-written
emits type — on `Combobox`, `MultiSelect` and experimental `MultiEmailInput`, and
`update:collapsed` likewise on `Sidebar` and `SidebarSection`. That is exactly the
duplication #1098 removed for `open` and `query`, with the same effect: an explicit typed
listener does not compile, because `$emit` collapses to `(...args: unknown[]) => any`.
`v-model` is unaffected.

Pre-existing on `main`, and **not fixed here on purpose**. `Sidebar.vue:30` documents the
redeclaration as deliberate — it is the only place to write the emit's description, and
`propsgen` would otherwise synthesize "Fired when the collapsed changes." The real fix is a
`propsgen` change that lets a model emit carry a description without a second declaration.
Needs a decision; half-fixing two of the five would be worse.

### Consumer census

Full detail in `v1-release/checkpoints/integration.md`. Method: 35 frappe-org consumers
enumerated by reading every `package.json` in every public repo's HEAD tree (not
`gh search code`), swept from 31 local bench checkouts plus fresh tarballs of every remote
dependent — including the seven present locally, so bench staleness could not hide a hit.

| Repo | Rail | Rail `data-slot` | Input `xl` | `FormLabel.size` | `list-cols` |
| --- | --- | --- | --- | --- | --- |
| gameplan | 6 | 0 | 0 | 4 | 4 |
| helpdesk | 0 | 0 | 0 | 22 | 0 |
| frappe (`ui/`) | 0 | 0 | 3 | 0 | 0 |
| wiki | 0 | 0 | 0 | 0 | 4 |
| suite | 0 | 0 | 0 | 2 | 0 |
| lms | 0 | 0 | 0 | 1 | 2 (comments) |
| toolbox | 0 | 0 | 1 | 0 | 0 |
| studio | 1 (generated) | 0 | 12 (generated) | 0 | 0 |

Everything else reachable is clean on all five axes.

**The silent half of the rail rename has no downstream call sites** — zero
`data-slot="rail*"` hits anywhere. Rail touches one real consumer file, gameplan's
`AppRail.vue`. Input `xl` touches two, `frappe/toolbox`'s `ConversionField.vue:13` and
`frappe/frappe`'s `ui/` Phone island (which re-declares `InputSize` with `xl` and no `xs`,
so it drifts in both directions). `FormLabel.size` is the widest at 29 sites, every one a
literal `size="md"` to delete. `list-cols-` is 8 live class strings, one more than the list
track's floor of seven.

Two items need judgement rather than a find-and-replace: `frappe/studio` ships **generated**
prop schemas that still offer `xl` on twelve input components and export a `Rail.json` by
name, and `frappe/lms`'s `SettingsTable.vue` has comments claiming two grid containers share
one `--list-columns` track list — if that alignment relies on inheritance the prop-only model
does not reproduce, the failure is visual, not a build error. Highest-risk item found.

### Unverified

- **CRM, Helpdesk and Gameplan were not built or booted against the candidate.** That needs a
  bench which is not set up here. Recorded as unverified. #1029's one-week soak starts from a
  real boot, not from this checkout.
- Private `frappe` repositories, `frappe_calendar` among them.
- Every consumer outside the `frappe` organisation.
- `frappe/build_ctf` and `frappe/meet` remote HEAD (both archived, both on the v0 line that
  predates all three breaks — reasoning, not a grep).
- Runtime-constructed `size` values, and git-submodule references.

Also: the GitHub API reports `frappe/drive` as **not archived**, contradicting the note that
it was folded into `frappe/suite`. Swept anyway; clean.

### Not done

- Nothing pushed, no pull request, no comments. The orchestrator owns that.
- `yarn build`, `yarn docs:build`, full `yarn test:cypress`.
- The `update:modelValue` duplication (above).
- The inputs track's open question is still open: `TextInput`, `Textarea`, `Password` and
  `Rating` never pass `:disabled` to `InputLabel` / `InputDescription`, so a disabled stack
  field keeps a full-strength label while inline-row controls dim theirs. Pre-existing, both
  components already have the prop wired.

## Pull request

[#1133](https://github.com/frappe/frappe-ui/pull/1133), branch `v1/rc-api`, opened 2026-09-09.
It closes #1116, #1117 and #1118, and supersedes #1097, #1091 and #1098.

Independently reproduced after the merges, not carried over from the branches: `yarn type-check` clean,
`yarn test` 104 files / 1689 tests, `docs:check` reports the tables match, Cypress 625 passing across the
29 touched specs.

## Remaining work after this pull request

1. Migrate the downstream `list-cols-[...]` call sites. Maintainer approved 2026-09-09. Confirmed by the
   integration sweep: `frappe/gameplan` 4 and `frappe/wiki` 4, every one a `max-<screen>:` variant that
   maps exactly onto the object form.
2. `frappe/lms` `SettingsTable.vue` claims in comments that two grid containers share one
   `--list-columns` track list. If that alignment rests on inheritance, the prop-only model does not
   reproduce it and the symptom is misaligned columns, not a build error. Needs a look, not a grep.
3. `frappe/studio` generated schemas still offer `xl` on twelve input components and export `Rail.json`
   by name. Invisible to a `.vue` grep, so they need a schema-side edit.
4. Build and boot CRM, Helpdesk and Gameplan against the candidate. Still unverified; needs a bench.
5. Two pre-existing defects recorded in the pull request and deliberately not fixed there: the disabled
   stack-input label, and `@update:model-value` / `@update:collapsed` typing across five components,
   whose real fix is a `propsgen` change.
6. Then the RC cut itself: #1029's one-week app soak and maintainer sign-off.

## Review rounds on #1133

| Round | Greptile | Barista |
| --- | --- | --- |
| 1 | refused, 130 files against its 100-file limit | 2/5, three findings |
| 2 | 4/5, one P1 on bounded Tailwind screens | run cancelled, never reviewed |
| 3 | 5/5 | 4/5, two nits |
| 4 | 5/5, safe to merge | 5/5 |

Round 1 findings, all fixed: the `xs` addition left `MultiEmailInput`'s avatar ternary on an `sm` floor;
the six size declarations were still literal copies rather than aliases of `InputSize`; the stretched row
overlay in one story and three recipes had no `type="button"`.

Round 2's P1 was real and wider than reported. Bounded screens (`{ min, max }`) generated an unbounded
min-width rule, so above the max the tracks disagreed with the visibility utilities. `{ max }`, `{ raw }`
and array screens were dropped from the ladder entirely, and mixed-unit screens were sorted on a px scale
where Tailwind falls back to declaration order. Each tier now rides its own `--_list-tier-<screen>`
variable declared under the same condition Tailwind emits for that screen, with priority carried by
`var()` nesting rather than source order.

Round 3's first nit produced a dev-time warning for a `columns` key that names no screen. The second was
declined with a reproduction: wiring `ContextMenuEmits` into `defineEmits` recreates the `TS2322` collapse
#1098 removed, and six other exported `*Emits` interfaces on `main` are unwired for the same reason.
Barista withdrew it.

**The barista run in round 2 was cancelled by Greptile's own comment.** Every issue comment shares the
`manual` concurrency group with `cancel-in-progress`, so any later comment kills an in-flight
`/barista review` and the cancelling run then skips the job filter, leaving no review and no failure.
Order per round: push, tag Greptile, wait for its review, then post `/barista review` last. The workflow
fix is to join the manual group only when the comment body contains `/barista review`.

## Consumer validation — gameplan

Run against `/Users/netchampfaris/Projects/benches/frappe-bench`, `apps/gameplan`, by repointing
`frontend/node_modules/frappe-ui` at the candidate. Bench state recorded before and restored after, with
the restore verified. Detail in `v1-release/checkpoints/consumer-gameplan.md`.

Baseline was `main` @ `2d65281be8`, the RC's own base, rather than the checkout's beta.46, so 16 betas of
drift did not pollute the comparison.

- **Rail is a loud break, as intended.** Gameplan fails to build with `[MISSING_EXPORT] "Rail"` and
  `"RailItem"` at `AppRail.vue:20`. With that one file migrated it builds clean. The rendered shell is
  byte-identical between the two arms, so the `data-slot` rename costs gameplan nothing.
- **Inputs.** `FormLabel` measured 14px `srgb(0.479)` to 13px `srgb(0.600)` live. Input `xl` does not
  reach gameplan; its `xl` hits are Avatar and Dialog, which keep that size.
- **List.** Tailwind run standalone against gameplan's own config gives 4 `list-cols` rules to 0, with the
  `list-gap-*` rules identical on both arms as a control. On a live list the class no longer moves the
  tracks. The affected band is 640-767px only: below 640px gameplan swaps to MobileLayout, and the dialog
  hosting all four lists is desktop-only.

Two consequences not in the migration notes:

1. With `size` no longer a declared prop, `FormLabel size="md"` falls through to the DOM as a real
   attribute (`<label size="md">`, confirmed by `getAttribute`, absent on the baseline). Stale usage emits
   invalid HTML rather than being a harmless no-op.
2. `frappe-ui/vite` sets `emptyOutDir: true`, so a failed consumer build wipes the served frontend before
   it errors. Worth its own ticket.

**Separate blocker found, not caused by this branch.** Gameplan's Settings dialog opens on beta.46 and does
not on beta.62 or the candidate, same site and user and script. It mounts closed, logs no error,
`get_user_info` returns 200, and `usersReady` never flips because the `useCall(...).isFinished` it latches
never becomes true. `DevUserSwitcher`, gated on the same flag, is also absent. A bisect between
`73f9a49f2` and `2d65281be8` is running. #1029's soak starts from a real boot, so this wants an answer
before the tag even though it does not block this pull request.

CRM and Helpdesk remain unverified: neither has `node_modules/frappe-ui` installed in this bench, so
checking them needs a full install first.
