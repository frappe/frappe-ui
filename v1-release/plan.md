# Frappe UI v1 Plan

This is the main planning document for the `frappe-ui` v1 release.

Keep separate docs only where that genuinely helps:

- [`../spec/selection.md`](../spec/selection.md) and [`../spec/dropdown.md`](../spec/dropdown.md) for the selection and menu API contracts
- [`../spec/dialog.md`](../spec/dialog.md) for the accepted Dialog + imperative `dialog.*` API direction
- [`../spec/inputs.md`](../spec/inputs.md) for the accepted input-family API direction (TextInput, Textarea, Password, Checkbox, Switch, Rating, Slider, ErrorMessage; FileUploader covered separately)

## What v1 means

`frappe-ui` v1 is a **narrow, API-freeze-first** release.

The goal is not to make every part of the repository feature-complete. The goal is to make the core component surface and the recommended data API path stable enough to support a long-lived `1.x` line without immediate breaking corrections.

In practice, v1 means:

- core component APIs are stable and audited
- core components are modernized to TypeScript, `<script setup>`, docs, stories, and tests
- v2 composables are the recommended data-fetching path for new work; v3 lands in a later `1.x` minor, not this tag
- v1 resources and v2 composables both ship supported and un-deprecated — see "Data API strategy"
- legacy APIs/components move out of the happy path and into migration/legacy docs
- `TextEditor` ships with a narrower default surface for v1
- the release is backed by docs refresh, migration guidance, deprecation warnings, and an RC validation pass

## Release philosophy

1. **Stabilize what people should use next.**
   - for components, that means the core public component set
   - for data APIs, that means v2 composables for `1.0.0`; v3 later, once it ships
2. **Keep migration paths open.**
   - deprecated APIs stay available during the transition
3. **Use a real app to validate the new direction.**
   - Gameplan is v2's heaviest real consumer today (71 of 132 sites) and will be v3's proving ground once it ships
4. **Avoid unnecessary breadth before freeze.**
   - non-core areas should not silently become blockers

## Core scope

### Core components for v1

All core components must be:

- implemented in TypeScript
- implemented with `<script setup>`
- documented
- covered by baseline stories
- covered by baseline component tests
- audited for API consistency and stability

Core set:

- Alert
- Avatar
- Badge
- Breadcrumbs
- Button
- Checkbox
- Combobox
- DatePicker
- MonthPicker
- TimePicker
- Dialog
- Divider
- Dropdown
- ErrorMessage
- FileUploader
- FormControl
- MultiSelect
- Password
- Popover
- Progress
- Rating
- Select
- Sidebar
- Slider
- Switch
- TabButtons
- Tabs
- TextEditor
- TextInput
- Textarea
- Toast
- Tooltip
- Tree

### Explicitly not core for v1

- Calendar — moved from root to `frappe-ui/experimental` (#1020, P14). Parked
  as-is, API unchanged, until a redesigned calendar family replaces it.
- Charts (v1) — moved from root to `frappe-ui/experimental` (#942, P14). Parked
  as-is, API unchanged, while apps migrate to `frappe-ui/charts`.
- Resource

These can still exist in the package, but they are not part of the v1 stabilization contract.
(VueGridLayout was listed here; it's deleted now — see #943.)

### Exported but not yet classified for v1

These ship in the package but were never folded into the core-set contract above.
v1 must make an explicit keep / refine / remove decision on each — tracked in the
[v1 component refinement pass](#v1-component-refinement-pass).

- **Pill** — used only inside `TabButtons` in practice. Decision: stop exporting from the public package surface.
- **Duration** — publicly exported. Decision: whether it is core v1 surface; if it holds a value, align with the input-family contract.
- **ThemeSwitcher** — moved out of the root export to `frappe-ui/experimental` (#1094, P14), where it parks still deprecated. Prefer `Select` plus the `useColorScheme` composable for app-specific theme switching.
- **CodeEditor** — exported from `frappe-ui/experimental` (ADR-0010, #939). Decided: stays internal under P14 unless there is demand to promote it to a public entry point.
- **ListView** — moved from root to `frappe-ui/experimental` (#985, P14). The parity gap with `frappe-ui/list` is real and structural (resizable columns, per-column function props, tooltips, disabled-row exclusion, select banner). Decided: stays there, unstable, until `frappe-ui/list` reaches parity.

`MonthPicker` stays in the core list above for now but is under a remove-or-rebuild
decision (see the refinement pass).

## Agreed broad component direction

We have only agreed on a small set of broad component decisions so far.

### Broad rules we have agreed on

- keep component boundaries narrow across the library
- keep app-facing public APIs high-level where possible
- prefer props and slots for ordinary usage
- avoid giant do-everything components
- avoid exposing low-level composition as the default public API story
- use `v-model` / `modelValue` for the primary value state
- use `v-model:open` for visibility state
- expose named secondary models only when clearly needed
- keep query internal by default unless a stronger need emerges
- use stable styling hooks like `data-*` and ARIA state to simplify styling and testing
- prefer slots over `render` as the default customization pattern
- keep escape hatches limited and requirement-driven
- keep polymorphism limited to real needs, such as `Button` rendering as an anchor or router link

### Selection/menu family

For the selection/menu family, `ItemListRow` is the shared row primitive used internally by `Dropdown`, `Select`, `Combobox`, and `MultiSelect`. Each higher-level component owns its own listbox shell (keyboard nav, grouping, empty/footer slots, etc.); only the row presentation is shared.

Use [`../spec/selection.md`](../spec/selection.md) for the pickers and
[`../spec/dropdown.md`](../spec/dropdown.md) for the menu.

### Still open

We have **not** yet agreed on broad reusable rules for every complex component family. Dialog, Tooltip, Tabs, and other overlay/component families still need separate design passes.

## v1 component refinement pass

A focused, component-level pass identified after the beta.11 audit. These are the
components that still need work — or an explicit decision — before they meet the v1
bar; everything else in the core set is considered at-bar. (This section supersedes
the earlier `04-components-audit.md` matrix, which was a stale structural snapshot and
has been removed.)

Items typed **decision** are scope calls to make *first*: resolving several of them
*removes* work rather than adding it.

| Component | Direction | Type | Open PR / branch | Effort | Blocks v1 |
| --- | --- | --- | --- | --- | --- |
| **Alert** | Replace type-specific `#icon` slot with `#prefix` (deprecate `#icon`, P6); add uniform `icon?: string \| Component` prop (P11); reconcile `dismissible`/`theme` default drift (code vs JSDoc); add focus-visible on the dismiss button (P12). | refine | — | S | yes |
| **CodeEditor** | Exported from `frappe-ui/experimental` (ADR-0010, #939). Decided: keep internal under P14 unless there is demand to promote it. | decided | #939 | — | no |
| **Duration** | Exported, never classified. Decide if it is core v1 surface; if it holds a value, align with the input-family labeling contract (P5). | decision / refine | — | S→M | only if kept core |
| **FileUploader** | Bring to structural bar: TS + `<script setup>`, `types.ts`, `*.cy.ts`; declare/deprecate `success`/`failure` emits (P1); flat props over the `uploadArgs` blob (P3); default uploads to `is_private` (security #206). | refactor | #788 (closed unmerged), #673 (CSV MIME) | L | yes |
| **ListView** | ~~Deprecate in favor of `frappe-ui/list`; do not refactor the legacy component for v1.~~ ~~Superseded (sweep #882): parity isn't reached and can't close passively... ListView ships **frozen, not deprecated**, for v1.~~ **Superseded again** (#985): not taken to bar at root. Moved to `frappe-ui/experimental` (P14, no stability promise) instead of frozen at root — stays there until `frappe-ui/list` reaches full functional parity (config-driven columns, per-column functions, tooltips, disabled-row exclusion, select banner). | decided (moved to experimental) | #985 | — | no |
| **MonthPicker** | **Remove for v1** (recommended): deprecate the export with a warning + migration note and drop from the core set — it never moved onto the shared picker architecture. Alternative: rebuild on the DatePicker family arch. | decision (remove) | — | S→L | yes |
| **Pill** | **Stop exporting** — confirmed used only inside `TabButtons`. Deprecate the public export (P13), keep it internal; retain `PillSize` for internal use. | decision (un-expose) | — | S | yes |
| **Popover** | Refactor to the v1 floating vocab: `v-model:open`, `side`/`align`/`offset` (deprecate `placement`), `data-slot` hooks (drop `popoverClass`, P10), canonical slots, a11y. The last floating outlier. | refactor | — | M | yes |
| **Sidebar** | Refactor to **molecule-style composable sub-components, no slots**: expose `SidebarHeader` / `SidebarSection` / `SidebarItem` for composition instead of `header`/`sections` config blobs (P3) + generic slots (P10). | refactor | conflicts with #770 (adds a slot — redirect/close) | L | yes |
| **Switch + Checkbox** | Add the `padded` variant. | land PR | #751 (also adds a new **Radio** — decide if Radio enters v1 scope) | S | yes |
| **Tabs + TabButtons** | Unify the two overlapping public components — nest TabButtons' segmented rendering inside `Tabs`, or merge into one `Tabs` with a style axis (P8: a purely-visual variant → one component). Resolve before freeze. | refactor | branches: refactor-tabs, tabs-rewrite, improved-tab-buttons | M | yes |
| **ThemeSwitcher** | ~~Keep exported for v1 compatibility, mark deprecated.~~ **Superseded** (#1094): not taken to bar at root. Moved to `frappe-ui/experimental` (P14, no stability promise), where it stays deprecated, rather than shipping deprecated on the frozen surface. `Select` + `useColorScheme` remains the recommendation for new theme switchers, and the composable remains the stable primitive. | decided (moved to experimental) | #1094 | — | no |
| **Tree** | Land the rework PR (adds the WAI-ARIA tree pattern + keyboard nav, P12; resolves the `options` config-blob, P3). | land PR | #783 (draft) | track PR | yes |

### Decisions to make first (they shrink scope)

- **MonthPicker → remove / deprecate** rather than rebuild.
- **Pill → un-export** (internal-only).
- **CodeEditor → keep internal**, exported from `frappe-ui/experimental` (#939), unless there is demand to promote it.
- **ThemeSwitcher → parked in `frappe-ui/experimental`**, still deprecated (#1094); `useColorScheme` stays available at root as the stable primitive.
- **Radio (from #751) → confirm** whether a new component enters v1 scope or lands post-v1.

Resolving these five as "remove / keep-internal / defer" turns five potential
modernization efforts into doc + deprecation edits.

### Open-PR alignment

- **Land / finish:** #751 (Switch/Checkbox padded), #783 (Tree rework), #788 (FileUploader chunked uploads — fold into the FileUploader pass).
- **Redirect / close** as conflicting with agreed direction: #770 (adds a Sidebar slot; the agreed direction is no-slots composable sub-components).
- **Consolidate** the tab branches (refactor-tabs, tabs-rewrite, improved-tab-buttons) into the single Tabs/TabButtons unification.

## Data API strategy

Two data-fetching generations ship at `1.0.0`, both supported and both frozen.
A third does not ship yet. This section was rewritten by
[#934](https://github.com/frappe/frappe-ui/issues/934) after
[#886](https://github.com/frappe/frappe-ui/issues/886) settled the export
posture; see that ticket for the full census and reasoning.

### v1 resources — supported, frozen, un-deprecated

`createResource`, `createListResource`, `createDocumentResource`,
`getCachedResource`, `getCachedListResource`, `getCachedDocumentResource`,
`resourcesPlugin`, `saveLocal`, `getLocal`, `deleteLocal`, `onDocUpdate`
(`src/resources/`).

Status for v1:

- still exported, **not deprecated** — no `@deprecated` marker, so ADR-0008
  does not reach them
- documented in the docs site's own "Resources" section (three pages:
  Resource, List Resource, Document Resource) — not a legacy or
  migration-only page
- frozen at `1.0.0` like any other export, with one exception:
  [ADR-0013](../spec/adr/0013-v1-resources-implementation-freeze.md) keeps the
  implementation as hand-written JavaScript rather than requiring a
  TypeScript rewrite. Tests, docs, and `1.x` bug fixes stay allowed; renames,
  signature changes, and additions stay out until `2.0.0`, the same as any
  other frozen export.
- no dev-mode warnings

This is the larger of the two surviving data layers by a wide margin: **344
call sites across 204 files**, in helpdesk, crm, builder, insights, and
`frappe/frappe`'s `ui/` package — five of six apps counted. It is what most
consumers actually run, not a migration-path surface.

### v2 composables — the recommended layer for new code

`useList`, `useDoc`, `useCall`, `useDoctype`, `useNewDoc`
(`src/data-fetching/`).

Status for v1:

- still exported, **not deprecated** — supported
- recommended for new code, on Frappe v15 or v16+ alike (see "Frappe
  Framework compatibility" below)
- no dev-mode warnings
- the docs sidebar splits into two sections — **Data Fetching** (v2,
  carrying a line naming it the recommended layer for new code) and
  **Resources** (v1, carrying a line stating it is fully supported through
  `1.x`) — neither uses "legacy" or "deprecated" wording, since neither is
  true. Docs pages, the sidebar split, and the exports themselves are
  [#932](https://github.com/frappe/frappe-ui/issues/932); the at-bar pass
  (tests, P1–P15 audit) is
  [#933](https://github.com/frappe/frappe-ui/issues/933).

Recounted against freshly fetched trees, v2 usage is **132 call sites across
119 files**, in gameplan, central, suite, `frappe_calendar`, and
`frappe-ui-starter` — a different set of five apps than v1's. `suite` is the
one mixed consumer: v2 in its `writer` and parts of `mail`, v1 in `drive` and
`meet`. Neither generation is "legacy" in the sense earlier drafts of this
plan used the word — the split between them is which app happens to use
which, not which one is being migrated away from.

### v3 — not in `1.0.0`

[#867](https://github.com/frappe/frappe-ui/issues/867) ruled v3 out of the
tag: PR #610 (`frappe/client/`) was still open and unmerged when the
`frappe/` directory it lives under was deleted from the package, so
`frappe/client/` never enters the tree before `1.0.0` and the deletion cost
it nothing. Consequences:

- v3 ships in a later `1.x` minor, from whatever import path it lands at —
  `frappe-ui/frappe/vue` is not that path, since `frappe-ui/frappe` was
  removed for `1.0.0` (#867, #924). Nobody imported `frappe-ui/frappe/vue`
  (0 files across all consumer apps), so nothing is stranded.
- PR #610 needs a rebase off the deleted `frappe/client/` directory to a
  home decided when that minor is planned.
- The frozen-surface contract, the `createClient` dev notice, and the rest of
  v3's shape are questions for whenever that minor is planned. Nothing about
  v3 is frozen or required for `1.0.0`.
- v2 takes `useList`, `useDoc`, `useCall`, `useDoctype`, `useNewDoc` at the
  root export, frozen until `2.0.0` — so v3 either picks different names or
  earns a subpath under P15 when it lands.

### Frappe Framework compatibility

v2 depends on `/api/v2/*` endpoints in Frappe Framework. Confirmed against
`frappe/api/v2.py` on `origin/version-15` (Frappe `15.117.0`): every route v2
hits — `GET`/`POST /document/<doctype>`, `PUT`, `DELETE`,
`/document/.../method/...`, `/method/<doctype>/<method>` — already exists on
v15. **v2 works on Frappe v15 today; no backport is needed** to recommend it
there.

## Deprecation policy

### Dev warnings

Use medium-aggressive warnings in development:

- warn once per deprecated API/component per session or module lifecycle
- include the replacement and a migration-doc reference when possible

### Deprecated but retained exports

Superseded by [ADR-0008](../spec/adr/0008-no-deprecated-members-in-1-0-0.md):
nothing marked `@deprecated` ships in `1.0.0`, so each deprecated export is
removed before the tag rather than retained through `1.x`.

The full removal queue — verified against `src/index.ts`, with replacements —
is [`deprecated-removals.md`](./deprecated-removals.md). The short list below
is what this plan originally named; it is a subset and is kept only for
context.

- v1 resource APIs
- v2 composables
- `Resource.vue` (already gone — the file no longer exists)
- `Input.vue`
- `Autocomplete`
- `FeatherIcon`

Note that the v1 resource APIs and v2 composables are not actually marked
`@deprecated` in code, so ADR-0008 does not reach them. See
[`deprecated-removals.md`](./deprecated-removals.md#not-in-scope-for-adr-0008).

### Special handling

- `Input.vue`: deprecated in favor of the modern input/control stack
- `Autocomplete`: deprecated in favor of the split selection/menu components
- `FeatherIcon`: export retained for back-compat. Components that accept icon-name props (e.g. `Button.icon`, `Dialog.icon`, `Dropdown` item icons) continue to render feather names through `FeatherIcon` so existing call sites do not break. Internal **hardcoded** icon usages migrate to `lucide-*` strings via the shared Tailwind plugin. Docs recommend `lucide-*` (or a passed `Component`) for new code.

## Main workstreams

### 1. Core component modernization

Bring the full core component set to the baseline standard:

- TypeScript
- `<script setup>`
- docs
- stories
- tests
- API audit

Also remove internal `FeatherIcon` use across core components.

### 2. Selection/input family stabilization

See [`../spec/selection.md`](../spec/selection.md) and
[`../spec/dropdown.md`](../spec/dropdown.md).

Key items:

- ~~remove `Autocomplete` in favor of `Combobox` / `MultiSelect`~~ — done, see
  [#926](https://github.com/frappe/frappe-ui/issues/926)
- finalize `ItemListRow` as the shared row primitive
- finalize `Select`, `Combobox`, `Dropdown`, `MultiSelect`, `FormControl`, and `Switch`
- align the family on `v-model`, `v-model:open`, shared trigger/item slot vocabulary, and `@update:query`
- deprecate `Input.vue`

### 3. Floating and overlay stabilization

- Dialog cleanup/finalization
- floating utilities consolidation
- improve consistency across Dialog, Popover, Dropdown, Select, Combobox, and Tooltip
- align vocabulary like `open`, `side`, `align`, `placement`, and `offset` where practical

### 4. TextEditor stabilization

**v1 carve-out:** TextEditor's public API is **not** frozen for 1.0. The
component ships in 1.0 as-is — no changes to `TextEditor.vue`'s own props,
slots, or emits. A full refactor (internals + public API redesign + the open
behavioral fixes) lands in **1.1** with a documented migration path.

This carve-out is about the *component's own API*, not its export surface.
ADR-0008 still reaches the deprecated root exports (`TextEditor`,
`TextEditorBubbleMenu`, `TextEditorFixedMenu`, `TextEditorFloatingMenu`,
`TextEditorContent`, `createEditorButton`, and the `extensions/image` /
`extensions/suggestion` barrels) — those are removed from `frappe-ui` at 1.0
(#884), same as every other `@deprecated` export. The component files stay in
the package, unmodified, as `frappe-ui/editor`'s migration safety net; they're
just no longer reachable from any public import path until the 1.1 redesign
gives them one.

Required for 1.0:

- no changes to `TextEditor.vue` public API (the component's own props/slots/emits)
- the deprecated root exports removed per ADR-0008 (#884)
- release notes explicitly state the carve-out

Deferred to 1.1 (bundled into a single refactor effort):

- default-off font family / font size policy
- backtick block highlighting fix
- line-height cleanup
- internal modernization (TS + `<script setup>` for sub-components)
- public API redesign with deprecation cycle / migration path
- table editing UX improvements
- collapsible section / additional editor features

### 5. v2 at-bar pass

**v1 scope:** v2 composables ship at `1.0.0` as the recommended layer (see
"Data API strategy" above) and have to reach bar first: fix a shared-state
concurrency bug, then bring tests, docs, and the P1–P15 audit up to the
[at-bar](../spec/at-bar.md) checklist. v3 is **not** in scope for `1.0.0`;
see "Data API strategy" for where it stands.

Required for 1.0:

- [#931](https://github.com/frappe/frappe-ui/issues/931): fix the shared-`useCall`
  concurrency bug in `useDoctype` and `useList`
- [#932](https://github.com/frappe/frappe-ui/issues/932): v2 export surface,
  docs pages, and the docs sidebar split
- [#933](https://github.com/frappe/frappe-ui/issues/933): v2 tests and P1–P15
  audit
- [#934](https://github.com/frappe/frappe-ui/issues/934): v1 resources'
  ADR-0013, read-only audit, and `listResource.test.ts` (this document's
  rewrite)

Post-v1 umbrella: full Gameplan migration off v1 resources, v3's eventual
shape and shipping minor, DocType Meta composable, related ergonomics.
Tracked as a single post-v1 umbrella issue.

### 6. Docs, legacy page, warnings, and RC

Required outputs:

- docs refresh for core components
- v2 data-fetching docs and the sidebar split (see "Data API strategy")
- migration guide
- single legacy APIs/components page
- deprecation warnings in dev mode
- release candidate validation

Legacy page should include at minimum:

- `Input.vue`
- `FeatherIcon`

v1 resources (`createResource`, `createDocumentResource`,
`createListResource`, `resourcesPlugin`, and the rest — see "Data API
strategy") are **not** legacy-page material: they get their own "Resources"
docs section, since they are not deprecated. v2 composables (`useCall`,
`useDoc`, `useList`, `useDoctype`, `useNewDoc`) stay in the **main** "Data
Fetching" docs section — they are not deprecated either.

## Release blockers

v1 should not ship before all of these are done:

- release contract and quality gates are defined
- core components are migrated to TypeScript and `<script setup>` and have docs/stories/tests baselines (FileUploader remaining; ListView moved to `frappe-ui/experimental` and is out of the core set — see [ListView row](#v1-component-refinement-pass))
- the [v1 component refinement pass](#v1-component-refinement-pass) is complete: the refactors (FileUploader, Popover, Sidebar, Tabs/TabButtons, Tree) and refinements (Alert, Switch/Checkbox padded) land, and the keep/remove decisions (MonthPicker, Pill, Duration, ThemeSwitcher, CodeEditor, Radio) are made and executed
- selection/input family stabilization is complete enough for v1
- Dialog/floating stabilization is complete enough for v1
- TextEditor 1.0 carve-out documented (public API unchanged; refactor in 1.1)
- v2 composables reach bar: concurrency-bug fix (#931), export/docs (#932), tests and P1–P15 audit (#933)
- file uploads default to `is_private: true` (security #206)
- color tokens aligned with Figma
- deprecation warnings and legacy docs exist
- internal **hardcoded** `FeatherIcon` usage is migrated to `lucide-*` (prop-driven icon-name paths kept for back-compat)
- migration guide and release candidate validation are complete

More specifically, the selection/input family blocker set includes:

- `Autocomplete` deprecated in favor of separate higher-level components
- `ItemListRow` finalized as the shared styled row primitive used by `Dropdown`, `Select`, `Combobox`, and `MultiSelect`
- `Select`, `Combobox`, `Dropdown`, and `MultiSelect` finalized on top of that foundation
- `FormControl` finalized
- `Switch` finalized
- `Input.vue` deprecated

## Explicitly not blockers

These stay in the plan, but should not block `1.0.0`:

- session and user utilities
- first-class socket.io utilities
- full migration of `frappe-ui/frappe/*` internals to v3 (moot — the
  directory is deleted, see #924)
- TextEditor table editing UX improvements
- downstream migration PRs across all products
- Calendar stabilization
- VueGridLayout modernization (moot — the component is deleted, see #943)

## Release gates

Do not tag `1.0.0` until all of the following are true:

- lint passes
- typecheck passes
- unit tests pass
- component tests pass
- core component docs are complete
- legacy docs page exists
- migration guide exists
- deprecation warnings exist for v1/v2/legacy components
- release candidate has been validated

## Immediate post-v1 roadmap

These are important, but should not block v1 unless they land naturally earlier.

### Data and framework

- session and user utilities
- first-class socket.io utilities
- full Gameplan / downstream app migration to v3 data APIs

### Components and editor

- TextEditor table editing UX improvements
- Calendar stabilization and future promotion into the core set if appropriate
  (the v0 family is parked in `frappe-ui/experimental` meanwhile, #1020)
- deeper component coverage beyond the baseline docs/stories/tests standard

### Ecosystem

- downstream app migration wave
- broader deprecation cleanup follow-through
- eventual removal strategy for legacy exports in a future major version

## Suggested post-v1 success metric

Within the first `1.x` cycle, the project should be able to say:

- new apps use v3 by default
- core components no longer depend on deprecated internal primitives
- Gameplan is stable on v3
- deprecated usage across products is decreasing
