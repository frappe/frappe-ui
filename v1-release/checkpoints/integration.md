# Checkpoint — integration track (#1029, #1091, #1098)

- **Branch**: `v1/rc-api`
- **Worktree**: `~/Projects/worktrees/rc-integration`
- **Base**: `2d65281be8` (`v1.0.0-beta.62`) on `main`
- **Head at checkpoint**: `9ffb6372a7` (this file adds one more commit)
- **Contract**: `rc-implementation-handoff.md` §4 and §5
- **Status**: three tracks merged, both pull requests integrated, all checks green.
  Nothing pushed. No pull request opened, no issue or pull-request comment posted.

## Merges, in order

| Merge commit | Branch | Head merged | Conflicts |
| --- | --- | --- | --- |
| `853a9fb497` | `v1/rc-rail` | `017c9acb97` | none |
| `6a13955d1f` | `v1/rc-inputs` | `a576d0f4b0` | none |
| `45ae6f39af` | `v1/rc-list` | `37c7853adc` | none |
| `1cad8f0453` | `pr-1098` (`fix/duplicate-emit-1096`) | `bd37c29581` | none |
| `673c68675a` | `pr-1091` (`fix/exported-types-1070`) | `ec08af334f` | none |

**Zero textual conflicts across all five merges.** The predicted ones did not
happen:

- `src/index.ts` — the rail track changed one line (`./components/Rail` →
  `./components/SidebarRail`); the other two touched no barrel line, because
  `frappe-ui/list` has its own barrel and the input scale is re-exported per
  component. Nothing to reconcile.
- `docs/content/docs/changelog.md` — the rail and list tracks appended in
  different regions and `ort` merged them cleanly. The inputs track added **no
  changelog entry at all**, which is why nothing collided. See "Changelog gap".
- `src/components/shared/picker/PickerShell.vue` — #1091 edits the template's
  first ten lines and the `slots`/`anchorEl`/`hasCustomTrigger` block; the
  inputs track only widened the forwarded `size` type. Disjoint hunks.

`yarn type-check` was run after each merge and was clean every time, so no
merge is implicated in any later failure.

## Integration commits

| SHA | Subject |
| --- | --- |
| `9b6b79b4bd` | `fix(docs): keep model-prop docs single-sourced in types, balance the PickerShell trigger slot` |
| `d35b728324` | `fix(types): export DividerAction and the shared input scales, and TabButtonsSlots` |
| `9ffb6372a7` | `docs(release): one changelog for the RC, and docs that match the final exports` |

## What #1098 and #1091 needed after merging

Both pull requests were written against an older `main` and both had defects
that only show up once the tables are regenerated.

### #1098 — duplicate model emits

The change itself is right: `ComboboxEmits` and `MultiSelectEmits` no longer
declare `update:open` / `update:query`, which both components already declare
through `defineModel`. Declaring an event twice makes Vue's generated
`__VLS_ModelEmit & __VLS_Emit` an intersection of two tuples, and TypeScript
cannot infer named rest arguments back out of that, so `$emit` collapses to
`(event, ...args: unknown[])`. Verified after the merge: a typed
`@update:open="(v: boolean) => …"` listener on `Combobox` and `MultiSelect`
now compiles, and did not before.

Fixed during integration: the pull request added JSDoc blocks to the
`defineModel('open')` and `defineModel('query')` calls. `propsgen` **appends**
a model's JSDoc to the description already on the props interface rather than
replacing it, so `docs:gen` produced

```
'Controls the popover visibility.\nControls the popover visibility. Fires `update:open` when toggled.'
```

for four props. The canonical description stays on the props interface in
`types.ts`; the SFC now carries a plain `//` comment naming that file, so the
next person does not re-add the JSDoc.

**Public interface members removed while the runtime event stays** (documented
in the changelog, with this table):

| Removed member | Runtime event |
| --- | --- |
| `ComboboxEmits['update:open']` | still emitted |
| `ComboboxEmits['update:query']` | still emitted |
| `MultiSelectEmits['update:open']` | still emitted |
| `MultiSelectEmits['update:query']` | still emitted |

All four still appear as rows in the generated API tables — `propsgen` reads
them out of `__VLS_ModelEmit` and synthesizes the description. `MultiSelect`'s
`update:query` description changed from "Fired when the search query changes."
to the synthesized "Fired when the query changes.", which now matches
`Combobox`. Accepted.

### #1091 — exported public types

Kept as-is: `ContextMenuEmits`, `TabButtonsSlots` and `defineSlots` on
`TabButtons` (the slots table gained real types and descriptions instead of a
truncated inline object), and the `open` / `expanded` props on `HoverCardProps`,
`KeyboardShortcutsDialogProps` and `TreeProps`.

Three defects fixed during integration:

1. **Unbalanced template.** The pull request deleted the
   `<slot name="target">` *opening* tag from `PickerShell.vue` and left its
   `</slot>`. `vue-tsc` passes — Vue's parser drops a stray end tag with an
   `x-invalid-end-tag` warning — but the source was malformed and the
   `TextInput` block was indented one level too deep. Removed the stray tag and
   re-indented; `prettier --check` is clean.
2. **`TreeProps.expanded` documented twice.** The rich description already lived
   on the `defineModel` in `Tree.vue`; the new interface member added a second,
   shorter sentence, and `propsgen` concatenated them. The canonical text moved
   to `TreeProps` (where a consumer reads it) and the SFC JSDoc was dropped.
   `Tree.api.md` is byte-identical to what was committed.
3. **`TabButtonsSlots` was never exported.** The pull request added the
   interface and wired it into `defineSlots`, but left it out of
   `src/components/TabButtons/index.ts`, unlike every other `*Slots` type in the
   library (`AlertSlots`, `ComboboxSlots`, `DialogSlots`, …). Now exported.
   `ContextMenuEmits` was also out of alphabetical order in its barrel; sorted.

**The dead `#target` slot needed no changelog entry.** `changelog.md:1335` and
`migration.md:195` already tell consumers `#target` is removed and that content
in a leftover `<template #target>` stops rendering. The fallback slot in
`PickerShell` contradicted the published docs; deleting it makes the code
honest. No new break.

## DividerAction audit (§4)

`DividerAction` was **not exported** — `interface DividerAction` with no
`export`, referenced by the exported `DividerProps.action`. Every generated
table printed `type: 'DividerAction'`, a name the reader could not look up and
the consumer could not import. It was also the only option type in the library
with no member documentation: all four `DividerProps` members rendered with an
empty description.

Fixed: `DividerAction` is exported from `src/components/Divider/index.ts` and
therefore from the root, and both interfaces are documented.

## Root barrel versus the docs, in both directions

Method: every `type: '…'` string in every committed `*.api.md` was tokenized to
PascalCase identifiers, and the resulting 98 names were imported from
`./index` in a scratch module that `vue-tsc` checked. Twenty-two did not
resolve.

Fixed here, because this release owns them:

- `InputSize`, `InputVariant`, `ToggleSize`, `RangeSize` — nine components print
  `size: InputSize` in their tables, and the *derived* aliases (`ComboboxSize`,
  `MultiSelectSize`, `ItemListSize`) were already exported while the base was
  not. The input scale is this release's headline change, so a consumer writing
  a typed wrapper should be able to name it.
- `DividerAction` — above.

Not fixed, recorded instead (all pre-existing, none touched by this release):

- Exported from a subpath, not the root, and correctly so:
  `ListColumns`, `ListColumnsByBreakpoint`, `ListDivider`, `ListSortDirection`,
  `ListVirtualOptions` all come from `frappe-ui/list`. Verified present there.
- Genuinely unexported: `FrappeUIError`, `MenuOptions`, `MenuPrimitives`,
  `NormalizedMenuGroup`, `SpinnerSize`, `SpinnerTheme`, `TextInputTypes`,
  `BreadcrumbItem`.
- Generator artefacts rather than real names: `Label`, `Size`, `Theme`,
  `Variant`, `Tt`, `PropertyKey`, `Dayjs`. `propsgen` prints these when a type
  resolves to a bare or ambient alias. Worth a separate ticket.

The reverse direction — a root export the docs never mention — was not swept.
The barrel is 200-odd lines of hand-written re-exports and every entry there is
deliberate; no cheap check exists.

## Changelog gap the integration had to close

The inputs track wrote 100 lines of `migration.md` and **no changelog entry**,
so the release's largest break was absent from the log that `changelog.md`
promises covers "breaking changes, deprecations, observable behavior changes".
Both documents are expected: `Badge theme="orange"`, the `#target` removal and
every other v0-era break appear in both.

Three entries were added, all describing the same final state as
`migration.md`:

- `Inputs — the size scale is xs / sm / md / lg`
- `Form typography — 13px labels, descriptions and Textarea text`
- `Combobox and MultiSelect — update:open and update:query leave the emit interfaces`

Also fixed: the list entry's heading had lost the blank line before it when it
was appended after the Calendar section (pre-existing on `v1/rc-list`, not a
merge artefact).

Cross-checked the three track entries against each other. No contradictions:
the rail entry's `data-slot` rename, the input entry's scale, and the list
entry's hook freeze each describe state the other two do not touch.

## Documentation swept against the final exports

- `docs/content/public/llms.txt` — **hand-written, so the rename never reached
  it.** Line 38 still said DesktopShell "arranges `Rail` and `Sidebar`"; line 63
  was a `- [Rail](…/docs/components/rail)` entry naming `RailItem` cells and
  pointing at a route that no longer exists (the sidebar is generated from
  folder names, so the page is now `/docs/components/sidebarrail`). Renamed and
  moved into alphabetical position after `Sidebar`.
- `skills/frappe-ui/CORE.md` — four stale claims corrected: text-family sizes
  `sm | md | lg | xl`; `FormControl` size `sm | md`; `ItemListRow` size
  `sm | md | lg | xl`; and two places that taught `--list-columns` as a public
  CSS hook, one of them describing `columns` as an array only.
- `docs/content/docs/migration.md` — checked, correct as the inputs track left
  it. The rail rename correctly has no migration section: `Rail` was added
  during the v1 betas and does not exist in v0.1.278.
- Story files, playgrounds and recipes — swept for `'xl'` on an input-family
  component. Every remaining hit is `Avatar`, `Dialog`, `Progress`, `Button` or
  `Badge`, all of which keep their own scales.
- `skills/frappe-ui/evals/findings-2026-08.md:317` cites
  `src/components/Rail/RailItem.vue:126`. **Left alone deliberately** — it is a
  dated record of evidence gathered in August; rewriting past evidence to match
  the present would make the record dishonest.

## Verification

Run from `/Users/netchampfaris/Projects/worktrees/rc-integration`.

**Cypress needs `env -u ELECTRON_RUN_AS_NODE`**, as both earlier tracks found:
the agent environment inherits `ELECTRON_RUN_AS_NODE=1` and the Cypress Electron
binary then boots as plain Node and fails to find its app bundle.

| Command | Result |
| --- | --- |
| `yarn type-check` | `Done in 8.49s.` — clean |
| `yarn test` | `Test Files 104 passed (104)`, `Tests 1689 passed (1689)` |
| `yarn docs:gen` + `yarn docs:check` | `The committed API tables match the source.` |
| Cypress, 29 specs | `All specs passed! 00:51 625 625 - - -` |

The 29 Cypress specs are every spec belonging to a directory the merges
touched: Checkbox, Combobox, ContextMenu, DatePicker, DateRangePicker,
DateTimePicker, DesktopShell, Divider, Duration, FormControl, FormLabel,
HoverCard, ItemListRow, KeyboardShortcutsDialog, MultiSelect, Password, Radio,
Rating, Select, Sidebar, SidebarRail, Slider, Switch, TabButtons, Textarea,
TextInput, TimePicker, Tree, and `molecules/list`. Sidebar and the three
DatePicker specs are there because `PickerShell` and the shared selection
helpers are upstream of them.

`yarn build` and `yarn docs:build` were not run. Nothing in the required checks
needs them, and the disk budget says skip them.

`src/charts/docs/{Area,Bar,Line}Chart.api.md` were reverted after every
`docs:gen`, as the rail and inputs tracks both recorded. `docs:gen` reorders
`update:hiddenSeries` after `select` in all three. `docs:check` ignores emit row
order, so this is not a gate. Charts is Saqib's track (#1128).

### Type-level acceptance, checked with scratch modules

Two scratch files (`src/__rc_scratch__.ts`, `src/__rc_scratch__.vue`) were
type-checked and then deleted. They are not committed; the assertions are
recorded here so they can be rebuilt.

Passing, each with a `@ts-expect-error` that fired:

- `InputSize` accepts `xs | sm | md | lg` and rejects `'xl'`.
- `FormLabelProps` rejects `size`.
- All four removed `ComboboxEmits` / `MultiSelectEmits` members are gone.
- `ListColumnsByBreakpoint` rejects an object with no `base`.

Passing positively: `SidebarRail`, `SidebarRailItem`, `SidebarRailItemProps`,
`ContextMenuEmits['update:open']`, `TabButtonsSlots` with its scoped-slot
signature, `HoverCardProps.open`, `KeyboardShortcutsDialogProps.open`,
`TreeProps.expanded`, `DividerAction`, and `ComboboxProps` / `MultiSelectProps`
still carrying `open` and `query`.

In the SFC scratch, `v-model`, `v-model:open`, `v-model:query`,
`v-model:expanded`, and explicit `@update:open` / `@update:query` listeners with
typed parameters all compile on `Combobox`, `MultiSelect`, `ContextMenu`,
`Tree` and `HoverCard`.

There is **no** `SidebarRailProps`: `SidebarRail.vue` declares slots only, no
props. Nothing to export.

## Open finding — `@update:model-value` is still untyped on five components

`update:modelValue` is declared **twice** on `Combobox`, `MultiSelect`,
`Sidebar` (`update:collapsed`), `SidebarSection` (`update:collapsed`) and
experimental `MultiEmailInput` — once by `defineModel`, once in the hand-written
emits type. That is exactly the duplication #1098 removed for `open` and
`query`, and it has the same effect:

```
src/__rc_scratch__.vue(12,6): error TS2322: Type '(v: ComboboxOptionValue | null) => …'
  is not assignable to type '(...args: unknown[]) => any'.
```

`v-model` is unaffected. Only an explicit listener with a typed parameter fails.

**Pre-existing on `main`** — `git show main:src/components/Combobox/types.ts`
declares `update:modelValue` at line 313 while `Combobox.vue:90` calls
`defineModel`, and no track touched `src/components/Sidebar/`.

**Not fixed here, on purpose.** `Sidebar.vue:30` carries a comment saying the
redeclaration is deliberate: "`defineModel` already declares this event, but it
carries no place to write the event's own description. Redeclaring it here is
what puts the sentence in the generated API table." So removing the duplicates
trades a typed listener for a worse description — `propsgen` would synthesize
"Fired when the collapsed changes." That trade needs a decision, and the real
fix is a `propsgen` change that lets a model emit take a description without a
second declaration. Escalated rather than half-done on two of the five.

## Consumer census (read-only)

Method reused from `inputs.md` and widened. Consumers were enumerated by
walking `git/trees/HEAD?recursive=1` for all 192 public non-archived + 23
archived `frappe/*` repos, reading every non-`node_modules` `package.json`
through the contents API, and grepping for `"frappe-ui"` — **35 frappe-org
consumers**, not the 6-8 a `gh search code` sweep suggests. Sources: all 31
local `~/Projects/benches/*/apps/*` checkouts plus the standalone
`~/Projects/gameplan` and `~/Projects/helpdesk` clones, and `gh api
repos/frappe/<r>/tarball` for every dependent not present locally *and* for the
7 that are, so a stale bench checkout could not hide a hit. `frappe/frappe` is
too large to tarball, so its 334 `ui/**` source blobs were fetched individually.
`gh search code` was not relied on for any zero.

Nested `frappe-ui*` directories were excluded: bench `gameplan` embeds four
library checkouts and bench `helpdesk` one, which otherwise produce ~200 false
rail hits.

| Repo | Rail idents | Rail `data-slot` | Input `xl` | `FormLabel.size` | `list-cols` / `--list-columns` | Dynamic size |
| --- | --- | --- | --- | --- | --- | --- |
| gameplan | 6 | 0 | 0 | 4 | 4 | 0 |
| helpdesk | 0 | 0 | 0 | 22 | 0 | 0 |
| frappe (`ui/`) | 0 | 0 | 3 | 0 | 0 | 2 |
| wiki | 0 | 0 | 0 | 0 | 4 | 0 |
| suite | 0 | 0 | 0 | 2 | 0 | 0 |
| lms | 0 | 0 | 0 | 1 | 2 (comments) | 2 |
| toolbox | 0 | 0 | 1 | 0 | 0 | 0 |
| studio | 1 (generated) | 0 | 12 (generated) | 0 | 0 | 0 |
| crm | 0 | 0 | 0 | 0 | 0 | 1 |
| pilot | 0 | 0 | 0 | 0 | 0 | 10 (safe) |
| frappe_books | 0 | 0 | 0 | 0 | 0 | 2 |

Clean on every axis: press, drive, education, hrms, changemakers, builder,
insights, ff_assignment_portal, slides, frappe-ui-starter, writer, flow_client,
sheets, Letters, frappe-forms, release_manager, canvas-kit, draw, whatsapp,
chef, shop, mail, and the local-only apps build2026, codeoff, expensify, ijr,
inventory, logs, mytodo, numo, sae, scribekit, splitit, todos, frappe_search,
frappe_vue_ssr, meet, erpnext, payments, raven, telephony.

**The silent half of the rail rename has no downstream call sites.** Zero
`data-slot="rail*"` or `[data-slot=rail*]` hits in any reachable consumer,
confirmed by a structured scan and a raw `grep -rIn` over every root.

### Files needing a hand edit

Rail — one real consumer file:

- `frappe/gameplan` `frontend/src/components/AppRail/AppRail.vue` — `<Rail>` at
  :2, `<RailItem` at :13 and :49, `</RailItem>` at :59, `</Rail>` at :81
  (:80 in the local bench copy), and
  `import { Rail, RailItem } from 'frappe-ui'` at :90 (:89 local).
- `frappe/gameplan` `frontend/src/components/AppDropdown.vue:4` — a prose
  comment mentioning `RailItem`. Cosmetic.

Input `xl` — two real consumers:

- `frappe/frappe` `ui/src/components/types.ts:9` —
  `export type InputSize = "sm" | "md" | "lg" | "xl";`. It **re-declares** the
  scale instead of importing it, so it silently keeps offering `xl` and never
  gained `xs`. `ui/src/components/Phone/Phone.vue:2` and `:107` forward that
  `size` straight into `Combobox` and `ItemListRow`.
- `frappe/frappe` `ui/src/components/Phone/stories/Sizes.vue:10` —
  `<PhoneInput size="xl">`, and `ui/src/components/Phone/PhoneInput.cy.ts:200`
  loops `['sm','md','lg','xl']`, which will fail once `xl` is gone.
- `frappe/toolbox`
  `frontend/src/tools/unit-converter/ConversionField.vue:13` — the only genuine
  `size="xl"` on a frappe-ui input in any consumer. It already overrides the
  height with `[&_input]:h-14`, so `size="lg"` plus that class is the migration.

`FormLabel.size` — 29 sites, every one the literal `size="md"`, so the migration
is deleting an attribute:

- helpdesk 22, in `desk/src/components/Settings/**` (Holiday, SavedReplies,
  Sla, Teams, Assignment Rules, General) and `desk/src/pages/call-logs/CallLogModal.vue`
  (5 sites, :24 :33 :44 :53 :64).
- gameplan 4 — `ProfileBento/ProfileImageField.vue:3`,
  `ProfileBento/ProfileBentoEditorPanel.vue:96` and `:108`,
  `ProfileBento/boundFields/ProfileBoundRichTextField.vue:5`.
- suite 2 — `frontend/src/apps/writer/components/WriterSettings.vue:41`, `:72`.
- lms 1 — `frontend/src/components/Quiz/QuestionEditor.vue:76`.

`list-cols-` — 8 live class strings, seven of them `max-*` variants that need
the breakpoint direction inverted by hand (`max-md:list-cols-[X]` plus
`:columns="[Y]"` becomes `:columns="{ base: [X], md: [Y] }"`):

- gameplan 4 — `pages/Configure/CommunitiesList.vue`,
  `CommunityMembersList.vue`, `CommunityGuestsList.vue`,
  `CommunitySpacesList.vue`.
- wiki 4 at remote HEAD `5bba767` — `components/ContributionsPanel.vue:25`
  (comment) and `:32`, `pages/Overview.vue:89` and `:102`. `Overview.vue:102`
  is the only unconditional `list-cols-` in the census and converts directly.
  The local bench checkout of wiki is stale and has three hits in different
  files, including `components/SpaceList.vue:110`.

This is one more site than the list track's floor of seven, which is what that
track meant by "treat seven as a floor".

### Needs judgement, not a find-and-replace

1. **`frappe/studio` ships generated schemas.** `frontend/src/json_types/index.ts:40`
   is `export { default as Rail } from "./frappeui/Rail.json"`, and twelve
   input-family schemas still advertise `"xl"` in their size enum (Combobox,
   DatePicker, Duration, ItemListRow, MultiSelect, Password, Rating, Select,
   TextInput, Textarea, TimePicker, CodeEditor). Studio's visual builder will
   keep offering `xl` until someone regenerates. Nothing regenerates
   automatically, and a grep for `size="xl"` in `.vue` files will not find it.
2. **`frappe/lms` may depend on `--list-columns` inheritance without writing
   it.** `frontend/src/components/Layouts/SettingsTable.vue:151` and
   `frontend/src/tests/settingsList.test.ts:186` are comments describing two
   grid containers "sharing one `--list-columns` track list". No literal
   `list-cols-` or `--list-columns` is written, so no build error will fire —
   but if the alignment relies on the variable propagating from a header to a
   rows container, the prop-only model may not reproduce it and the failure is
   visual. The single highest-risk item in the census.
3. **Pass-through wrappers where `xl` is reachable but never literal.**
   crm `Controls/Link.vue:6` (`:size="attrs.size || 'sm'"`),
   lms `Controls/Link.vue:3` and `Controls/Select.vue:2`,
   frappe `ui/Phone/Phone.vue:2,107`, frappe_books `Controls/TableRow.vue:35`.
   lms's `as ComboboxSize` cast will start rejecting `xl`, which is the type
   doing its job.
4. **frappe_books `pages/CommonForm/CommonFormSection.vue:48`** passes the
   string `'form'` as a `FormControl` size. Not in the old scale either;
   pre-existing, unrelated, but it surfaces in the same type check.
5. pilot's 10 dynamic bindings are all `:size="isMobile ? 'md' : 'sm'"`. Safe;
   listed so a re-run does not re-flag them.

### Unverified — recorded as unverified, not as zero

- **Private `frappe` repositories.** `orgs/frappe/repos?type=public` cannot see
  them. `frappe_calendar` is a known consumer and is **not** covered.
- **Every consumer outside the `frappe` organisation.** `frappe-ui` is public on
  npm; community, partner and in-house apps were not enumerated at all. Largest
  blind spot.
- **Building and booting CRM, Helpdesk and Gameplan against the candidate.**
  This needs a bench that is not set up in this environment. It was **not done**.
  A passing library CI does not stand in for it, and #1029's one-week app soak
  starts from a real boot, not from this checkout.
- `frappe/build_ctf` (archived, `frappe-ui 0.1.108`) and `frappe/meet` remote
  HEAD (archived, `^0.1.271`) not tarballed. Both sit on the v0 line, which
  predates `Rail`, the `InputSize` scale and the List family, so none of the
  three breaks can reach them until they upgrade — but that is reasoning, not a
  grep.
- `frappe/frappe` outside `ui/`. Only `ui/**` was fetched from remote. No other
  `package.json` in the repo declares a frappe-ui dependency and the full local
  checkout was swept clean, but the remote non-`ui/` tree was not fetched.
- Pinned-v0 dependents were swept and are clean, but the result is moot until
  they upgrade: education `^0.1.17`, hrms `0.1.105`, changemakers `^0.0.112`,
  ff_assignment_portal `^0.1.51`, frappe-ui-starter `^0.1.261`, press `0.1.277`
  and `0.1.168`, pilot's `editor` workspace `^0.1.278`.
- Git submodules and lockfile-only references were not followed.
- A `size` assembled at runtime from an API response or a Frappe DocType field
  appears in no grep. The wrappers in item 3 are where that is plausible.

### Census disagreements worth knowing

- The inputs track counted `FormLabel.size` at 31 sites including 3 in
  `frappe_books`; this sweep finds 29 and none in `frappe_books`. The
  `frappe_books` hits are `FormControl`, not `FormLabel`.
- The inputs track reported input `size="xl"` as one hit org-wide.
  `frappe/toolbox` `ConversionField.vue:13` is a second, and it is a product
  call site rather than a story.
- The standalone `~/Projects/helpdesk` clone is a **different and much older**
  checkout than the bench one (`frappe-ui 1.0.0-beta.24`, no `size` on its
  `FormLabel`s). The bench checkout and remote HEAD are authoritative.
- The GitHub API reports `frappe/drive` as **not archived**
  (`archived: false`), which contradicts the note that it was folded into
  `frappe/suite` on 2026-07-03. It was fetched and swept anyway: clean.

## Not done

- Nothing pushed. No pull request opened. No issue or pull-request comment
  posted. The orchestrator owns all of that.
- Consumer apps not built or booted (no bench).
- `yarn build`, `yarn docs:build` and a full `yarn test:cypress` not run.
- The reverse barrel sweep (root exports the docs never mention).
- The `update:modelValue` duplication on five components. See the open finding.
- The 8 unexported and 7 artefact type names `propsgen` prints, beyond the six
  this release owns.
- The inputs track's own open question is still open: `TextInput`, `Textarea`,
  `Password` and `Rating` render `InputLabel` and `InputDescription` without
  `:disabled`, so a disabled stack field keeps a full-strength label while the
  inline-row controls dim theirs. Pre-existing, both components already have the
  prop wired. Worth a decision before the tag.

---

# Review round 1 — barista findings on #1133

Three findings, all addressed. Commits `1bd4edbc2b`, `d5a57173ef`, `8a26478afb`
and this checkpoint.

## Finding 1 — `MultiEmailInput` drew an `md` avatar in an `xs` row

`experimental/MultiEmailInput/MultiEmailInput.vue:169` computed the option-row
avatar as `props.size === 'sm' ? 'sm' : 'md'`. That was written when `sm` was
the floor of the input scale, so the new `xs` fell into the else branch and got
the 24px `md` avatar.

**Changed.** The ternary now steps down for `xs` and `sm` and keeps the `md` cap
above, in the same shape as the `FormControl` checkbox clamp:

```ts
props.size === 'xs' ? 'xs' : props.size === 'sm' ? 'sm' : 'md'
```

`lg` deliberately stays on `md`: Avatar's `lg` is 28px and an `md` row is 32px
before padding, so promoting it would recreate the bug one size up.

**Verified.** Four Cypress cases measure the rendered avatar
(`MultiEmailInput.cy.ts`): 16 / 20 / 24 / 24 px at `xs` / `sm` / `md` / `lg`.
The `xs` case fails against the old ternary and passes against the new one —
checked by reverting the line and re-running. Also measured in Chrome: `xs`
avatar 16px (was 24px), `sm` 20px.

**One correction to the finding.** The avatar never literally overflowed. The
row is `min-h-*`, not a fixed height, so an oversized avatar grows the row
instead of spilling out of it. The defect is density — the biggest avatar and
an inflated row on the smallest control — not clipping.

## Sweep for the same class of miss

Every branch and map that could have assumed `sm` was the floor was checked:
`=== 'sm'`, `!== 'sm'`, `'sm' ?`, every `size ===` / `size !==` in `src/` and
`experimental/`, and every size-keyed map that has an `sm:` key but no `xs:`.

`MultiEmailInput:169` was the only miss. Everything else is either on a scale
that never had `xs` at all, or already exhaustive:

| Site | Why it is fine |
| --- | --- |
| `Checkbox` `Radio` `Switch` | `ToggleSize` (`xs \| sm \| md`); their ternary chains already end on `xs`, not `sm` |
| `Slider` | `RangeSize` (`sm \| md`), no `xs` by design |
| `shared/tabs/styles.ts`, `Pill.vue` | `TabsSize` (`sm \| md`) |
| `Button` | own scale, branches on `xs` explicitly |
| `Badge`, `Progress` | own scales, no `xs` |
| `*.playground.vue` (`if (v.size !== 'sm')`) | omits the default attribute from the printed snippet; not a render branch |

### Left alone, with the reason

`MultiEmailInput.vue:391` — the create-row's mail-icon box is a fixed
`grid size-7` (28px) at every size, so it is taller than its own row at `xs`
and `sm` and does not line up with the avatar beside it in the suggestion rows.
That is **pre-existing**: it was already 28px in a 28px `sm` row before this
release, so it is not an `xs` regression and not what the finding is about.
Fixing it is a rendering change on an experimental component, outside the scope
of a review round. Worth a ticket.

## Finding 2 — five copies of the input scale collapsed to aliases

`Select` declared `size` and `variant` as inline literal unions; `ComboboxSize`,
`MultiSelectSize`, `SelectionSize` and `ItemListSize` were literal copies of
`InputSize`, and `ComboboxVariant`, `MultiSelectVariant` and `SelectionVariant`
were copies of `InputVariant`.

**Changed.** Each renderer implements exactly the input scale, so each type is
now an alias:

| Name | Now |
| --- | --- |
| `SelectProps['size' \| 'variant']` | `InputSize` / `InputVariant` |
| `ComboboxSize` / `ComboboxVariant` | `InputSize` / `InputVariant` |
| `MultiSelectSize` / `MultiSelectVariant` | `InputSize` / `InputVariant` |
| `SelectionSize` / `SelectionVariant` | `InputSize` / `InputVariant` |
| `ItemListSize` | `InputSize` |

Every exported name survives, so no consumer import breaks, and there is one
declaration left to keep in sync. `inputTypes.ts` is types-only, so the new
`import type` edges are erased at build and add no runtime cycle.

The variant aliases were not named in the finding. They were collapsed anyway:
leaving `ComboboxVariant` a literal copy on the line under an aliased
`ComboboxSize` would have been the same debt in the same file, and the argument
for one is the argument for the other.

**Nothing was left as a copy.** No family here implements a different set —
`SelectionSize`'s own doc comment already said it mirrors `InputSize` value for
value, and `triggerSizeMap` / `itemRootSizeMap` / `ItemListRow`'s map all
implement the same four. The narrower scales (`ToggleSize`, `RangeSize`) were
already separate types and stay separate.

**The generated tables did change — see the escalation below.**

`inputs.md`'s "six copies" table is updated to point here.

## Finding 3 — the stretched row overlay is now a real button

`src/molecules/list/stories/RowActions.vue` plus **three** recipes —
`docs/components/recipes/FilesDesktop.vue:665`, `FilesMobile.vue:617`,
`TasksDesktop.vue:1050`. The finding says four; there are three.
`AccountingDesktop.vue` also matches `absolute inset-0`, but that is a scroll
region, not a row overlay.

**Changed.** Each overlay gets `type="button"` (a button with no `type`
defaults to `submit`, which is exactly what `ListRowBase.vue:10` guards
against), and the row's own corner radius so the focus outline follows the
row's corners. `list.md`'s description of the pattern says both.

**The suggested class string was not copied verbatim.** Two differences, both
because the codebase does it differently:

1. **No `focus-visible:focus-ring`.** `tailwind/plugin.js:181` already applies
   `outline: var(--focus-outline-default)` to `:focus-visible` globally, in the
   base layer. Measured on the focused overlay: `matches(':focus-visible')` is
   true and the computed outline is `rgba(201,201,201,.898) solid 2px`. So the
   keyboard user was never seeing nothing — the ring was there, drawn square
   over a rounded row. The utility would have been a redundant restatement of
   the base rule.
2. **`sm:rounded-[10px]`, not `rounded-[10px]`.** The rows are
   `sm:rounded-[10px]`, so below the `sm` breakpoint they are square and the
   outline should be too. `FilesMobile`'s row has no radius at all (`h-17`),
   so its overlay stays square at every width.

## Verification

Run from `/Users/netchampfaris/Projects/worktrees/rc-integration`.
Cypress needs `env -u ELECTRON_RUN_AS_NODE`, as the earlier tracks found.

| Command | Result |
| --- | --- |
| `yarn type-check` | `Done in 22.68s.` — clean |
| `yarn test` | `Test Files 104 passed (104)`, `Tests 1689 passed (1689)` |
| `yarn docs:gen` + `yarn docs:check` | `The committed API tables match the source.` |
| Cypress, 6 specs | `All specs passed! 189 189` |
| Cypress, `MultiEmailInput` after the new cases | `All specs passed! 17 17` |

The six specs: `MultiEmailInput`, `list/List`, `ItemListRow`, `Select`,
`MultiSelect`, `Combobox`.

`docs:gen` again reordered `update:hiddenSeries` in the three chart tables.
Same pre-existing drift the inputs track recorded; reverted, not committed.

### Screenshots

Rendered through `vite` on a temporary `App.vue` harness, restored afterwards.

- `/tmp/rc-fix-shots/00-multiemailinput-xs-before.png` — `xs`, old ternary,
  24px avatars.
- `/tmp/rc-fix-shots/01-multiemailinput-xs-fixed.png` — `xs`, 16px avatars.
- `/tmp/rc-fix-shots/02-multiemailinput-sm-fixed.png` — `sm`, 20px, unchanged.
- `/tmp/rc-fix-shots/03-rowactions-overlay-focus.png` — the overlay focused,
  ring following the row's 10px corners.

## Escalation — the generated API tables changed

The finding claims aliasing "keeps the printed API table". It does not.
`propsgen` resolves an alias of an alias down to the ultimate name, so seven
rows moved:

```
Select.api.md       size     '"xs" | "sm" | "md" | "lg"'      -> 'InputSize'
Select.api.md       variant  '"subtle" | "outline" | "ghost"' -> 'InputVariant'
Combobox.api.md     size     'ComboboxSize'                   -> 'InputSize'
Combobox.api.md     variant  'ComboboxVariant'                -> 'InputVariant'
MultiSelect.api.md  size     'MultiSelectSize'                -> 'InputSize'
MultiSelect.api.md  variant  'MultiSelectVariant'             -> 'InputVariant'
ItemListRow.api.md  size     'ItemListSize'                   -> 'InputSize'
```

Kept, on the argument that it is a docs change and not a type change:

- The types are identical and every alias is still exported, so no consumer
  breaks and no `.d.ts` shape moves.
- `TextInput` and `Textarea` already printed `InputSize` / `InputVariant`. The
  whole input family now prints one name instead of five synonyms for it.
- `InputSize` and `InputVariant` are exported from the root and announced in
  the changelog for exactly this reason. `src/index.ts:155` already claimed
  "every generated API table prints these alias names as a prop's type" —
  that claim is only now true.

The cost is real and worth naming: `Select`'s table used to spell the four
values out and now shows an opaque `InputSize`. `PropsTable` does not resolve
type names, so a reader has to look the name up. That matches how `TextInput`
already reads, so it is a consistency call, not an improvement.

Revert is `git revert d5a57173ef` if the orchestrator wants the tables held.

## Also worth knowing

The pull-request body says the scale is "declared once in meaning rather than
six times in copies". That was aspirational when written — there were six
copies that happened to agree. It is now literally true. The diff block under
it still lists all six names as if they were separate declarations; the
orchestrator owns the body.

---

# Review round 2 — barista's last two nits on #1133

Both addressed. Commits `1327eced22`, `de00c4a49a`, `7386681505` and this
checkpoint. Nothing posted to the pull request; the orchestrator owns that.

## Nit 1 — `ContextMenuEmits` is exported but never wired

**Kept exported, kept unwired, and said why in the source.** No type change, no
runtime change — `src/components/ContextMenu/types.ts` gains a comment above the
interface.

### Why not wire it

Passing `ContextMenuEmits` to `defineEmits` alongside `defineModel('open')`
declares `update:open` twice, which is the #1096 defect this pull request just
removed. Measured rather than assumed: `defineEmits<ContextMenuEmits>()` was
added to `ContextMenu.vue` and `vue-tsc` run against a scratch consumer SFC.

```
src/__nit_scratch__.vue(4,31): error TS2322: Type '(value: boolean) => void'
  is not assignable to type '(...args: unknown[]) => any'.
src/__nit_scratch__.vue(6,31): error TS2322: Type '(v: boolean) => boolean'
  is not assignable to type '(...args: unknown[]) => any'.
```

The line was reverted immediately. `v-model:open` still compiled in that state,
which matches the earlier finding: only an explicit typed listener breaks.

### Why not delete it either

The finding reads the wiring of `ComboboxEmits` and `MultiSelectEmits` as the
house rule. It is not. **Seven** exported `*Emits` interfaces in
`src/components/` are never passed to `defineEmits`, and six of them are on
`main`, untouched by this release:

| Interface | Component's declaration |
| --- | --- |
| `DropdownEmits` | `defineModel('open')` |
| `SelectEmits` | `defineModel()` + `defineModel('open')` |
| `SettingsDialogEmits` | `defineModel('open')` |
| `RatingEmits` | `defineModel()` |
| `DurationEmits` | `defineModel()` |
| `RadioGroupEmits` | `defineModel()` |
| `ContextMenuEmits` | `defineModel('open')` — new in #1091 |

The actual rule is narrower and both halves of the pull request obey it: **an
`*Emits` interface is passed to `defineEmits` only when the component has an
event no model declares.** `Combobox` has `focus`, `blur` and
`update:selectedOption`; `MultiSelect` has `update:selectedOptions`. That is why
they are wired, and #1098 deleted `update:open` / `update:query` from them for
exactly the reason we are not adding a `defineEmits` call here. `ContextMenu`
has no non-model event, so `defineEmits` would add nothing and cost the typed
listener.

So the pull request "deleting `update:open` from two components and adding one
to a third" is consistent, not contradictory — the two are wired and the third
is not.

Deleting the export instead would single `ContextMenu` out against those six
siblings and re-open the gap #1091 (issue #1070) existed to close.

### Why no new drift guard

Considered and declined: deriving the interface from the component's real emit
type. `types.ts` is imported *by* `ContextMenu.vue`, so deriving back from the
SFC is a cycle through the type the SFC compiler is mid-way through resolving.
A separate `vue-tsc`-checked assertion module would work, but it is the wrong
size for one interface and would have to cover all seven to be honest — that is
a `propsgen` job, and it lands next to the deferred `update:modelValue` item
(same tool, same argument). Recorded as one ticket, not started.

Drift is not silent today in any case. `propsgen` reads emits out of
`__VLS_ModelEmit`, so renaming or retyping the model changes the committed
`ContextMenu.api.md` and `docs:check` — a CI gate — fails until the table is
regenerated, with the stale hand-written interface visible in the same diff.

**No public API decision was needed.** `ContextMenuEmits` does not exist on
`main` (`git show main:src/components/ContextMenu/types.ts` has no `Emits`, and
the barrel does not export it); it arrives with this pull request, so nothing
released changes either way.

## Nit 2 — an unrecognised breakpoint key is silently ignored

**The plugin can help, so it does.** The doc sentence is written too, but it is
not the whole fix.

### What changed

`tailwind/listColumns.js` publishes the keys the resolved chain actually reads
on `--_list-screens` — `base` plus every screen that got a tier, in the same
lowest-first order as the chain. `src/molecules/list/style.css` declares
`--_list-screens: base` as the floor. `List.vue` reads it back off the resolved
style in a `flush: 'post'` effect and warns for any `columns` key that is not in
it:

```
[frappe-ui] List: `columns` key `medium` is not one of this app's Tailwind
screens (base, sm, md, lg, xl), so its template is ignored and the list keeps
the one below it. If `medium` is a screen in your Tailwind config, this app is
not using frappe-ui's Tailwind preset.
```

### Why this is worth the machinery

The deciding fact is that **frappe-ui ships source**: `exports["."]` is
`./src/index.ts`, so `import.meta.env.DEV` is substituted by the *consumer's*
build. The warning therefore reaches a consumer's dev server and is stripped
from their production build. That is a different proposition from a warning that
only fires when running this repo from source, and it is what makes the check
better than prose — the failure is silent and the person hitting it has no
reason to re-read the prop docs.

Cost, itemised:

- **Public surface: none.** `--_list-screens` carries the `--_list` prefix that
  `changelog.md:221` and `style.css` already declare internal and not API, the
  same as the carriers it describes.
- **CSS: one declaration in one base rule.** Not per element.
- **Runtime: none in production**, and in development one `getComputedStyle`
  per list, only when `columns` is an object, only when it changes.
- **SSR: nothing.** Post-flush watchers do not run server-side;
  `List.ssr.test.ts` passes.

### The floor in style.css is what makes it precise

Without it, an absent property would mean either "this key is not a screen" or
"no CSS resolved at all" (jsdom, or a bare SSR string), and the check would have
to guess. `frappe-ui/list`'s style.css always declares at least `base`, so:

| Property reads | Means | Check does |
| --- | --- | --- |
| `base sm md lg xl` | preset installed | names any key outside the list |
| `base` | list CSS loaded, no preset | names every key above `base` — correct, and the message says the preset may be missing |
| empty | no CSS at all (test environment) | stays silent |

### What was declined

- **A build-time error instead of a dev warning.** The plugin cannot see the
  prop — `:columns` is a runtime value. Catching it at build would take a lint
  rule over template source, which is a great deal more machinery for the same
  message.
- **Closing the index signature on `ListColumnsByBreakpoint`.** It is open on
  purpose: screen names belong to the consuming app. Module augmentation would
  close it at the cost of breaking every app with custom screens that does not
  augment.
- **Reformatting `list.md` and `tailwind/listColumns.test.js`.** Both are
  already prettier-nonconforming at `bee26aa349` under the repo's own config
  (verified by checking `git show HEAD:` copies from inside the repo, not from
  `/tmp` — prettier resolves no config there and reports false differences).
  Prettier is not a CI gate. The added prose and the added test block are
  prettier-clean; the pre-existing drift is left alone.

### Documentation

`ListProps.columns`, `ListColumnsByBreakpoint`, `list.md`'s responsive-columns
section and the `frappe-ui/list` changelog entry all now state it plainly: a key
that is not one of the app's screens is ignored, the type cannot reject it, and
a development build warns.

## Verification

Run from `/Users/netchampfaris/Projects/worktrees/rc-integration`. Cypress needs
`env -u ELECTRON_RUN_AS_NODE`, as every earlier round found.

| Command | Result |
| --- | --- |
| `yarn type-check` | `Done in 7.43s.` — clean |
| `yarn test` | `Test Files 104 passed (104)`, `Tests 1698 passed (1698)` |
| `yarn docs:gen` + `yarn docs:check` | `The committed API tables match the source.` |
| Cypress, `list/List` + `ContextMenu` | `All specs passed! 00:04 49 49 - - -` |

1698 tests is 1689 plus the two `listColumns` cases added here and the seven
added by `7e5f640a22` and `17a9d93499` after round 1's count.

`docs:gen` reordered `update:hiddenSeries` in the three chart tables again.
Same pre-existing drift; reverted, not committed.

### New tests

- `tailwind/listColumns.test.js` — `--_list-screens` lists `base` first then the
  tiers in chain order, uses the app's own screen names (`base phone tablet`),
  omits a screen with no condition to emit, and is `base` alone with no usable
  screens. One preset-built case proves it survives a real Tailwind build.
- `src/molecules/list/List.cy.ts` — an unrecognised key warns once, names the
  app's real screens (`base, sm, md, lg, xl`, read from the preset's CSS, not
  hard-coded in the component), does not warn about the keys beside it, and the
  ignored key really is ignored — `md` still wins above 768px. A second case
  asserts a fully valid object warns not at all, so the check cannot go noisy.

The ContextMenu runtime event needed no new test: `ContextMenu.cy.ts:144`
already drives `update:open` through a typed `(val: boolean)` handler and
asserts the menu opens and closes. It passes, and nothing in this round touched
the declaration it exercises.

### Type-level acceptance, checked with a scratch SFC

`src/__nit_scratch__.vue` was type-checked and deleted. It is not committed;
the assertions are recorded here so they can be rebuilt. Against the committed
state, all of these compile on `ContextMenu`:

- `@update:open="onOpen"` with `function onOpen(value: boolean)`.
- `@update:open="(v: boolean) => (isOpen = v)"`.
- `v-model:open="isOpen"`.
- `ContextMenuEmits['update:open']` imported and used as a tuple type, with a
  `@ts-expect-error` on `['yes']` that fired.

## Left for the orchestrator

- Nothing posted to #1133 or any issue. No `gh` write command was run.
- The `propsgen` ticket: one check that every exported `*Emits` interface agrees
  with the emits the component really declares, which would also carry the
  deferred `update:modelValue` fix for the five components in the open finding
  above.
