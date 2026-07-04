# Frappe UI v1 Plan

This is the main planning document for the `frappe-ui` v1 release.

Keep separate docs only where that genuinely helps:

- [`../spec/selection.md`](../spec/selection.md) for the accepted menu/selection API direction
- [`../spec/dialog.md`](../spec/dialog.md) for the accepted Dialog + imperative `dialog.*` API direction
- [`../spec/inputs.md`](../spec/inputs.md) for the accepted input-family API direction (TextInput, Textarea, Password, Checkbox, Switch, Rating, Slider, ErrorMessage; FileUploader covered separately)

## What v1 means

`frappe-ui` v1 is a **narrow, API-freeze-first** release.

The goal is not to make every part of the repository feature-complete. The goal is to make the core component surface and the recommended data API path stable enough to support a long-lived `1.x` line without immediate breaking corrections.

In practice, v1 means:

- core component APIs are stable and audited
- core components are modernized to TypeScript, `<script setup>`, docs, stories, and tests
- v3 data APIs are the recommended path for new work
- v3 ships as the recommended path for new Frappe v16+ work
- v1 resource APIs and v2 composables remain exported for migration, but are deprecated
- legacy APIs/components move out of the happy path and into migration/legacy docs
- `TextEditor` ships with a narrower default surface for v1
- the release is backed by docs refresh, migration guidance, deprecation warnings, and an RC validation pass

## Release philosophy

1. **Stabilize what people should use next.**
   - for components, that means the core public component set
   - for data APIs, that means v3
2. **Keep migration paths open.**
   - deprecated APIs stay available during the transition
3. **Use a real app to validate the new direction.**
   - Gameplan is the proving ground for v3
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
- ListView
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

- Calendar
- Resource
- VueGridLayout

These can still exist in the package, but they are not part of the v1 stabilization contract.

### Exported but not yet classified for v1

These ship in the package but were never folded into the core-set contract above.
v1 must make an explicit keep / refine / remove decision on each — tracked in the
[v1 component refinement pass](#v1-component-refinement-pass).

- **Pill** — used only inside `TabButtons` in practice. Decision: stop exporting from the public package surface.
- **Duration** — publicly exported. Decision: whether it is core v1 surface; if it holds a value, align with the input-family contract.
- **ThemeSwitcher** — publicly exported for v1 migration, but deprecated. Prefer `Select` plus the `useTheme` composable for app-specific theme switching.
- **CodeEditor** — currently **not exported**. Decision: promote to public v1 API (then API-audit) or keep internal and out of scope.

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

Use [`../spec/selection.md`](../spec/selection.md) as the source of truth for that family.

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
| **CodeEditor** | Currently **not exported**. Decide: promote to public v1 API (then API-audit against the philosophy) or keep internal and out of the v1 contract. | decision | — | S→M | only if exposed |
| **Duration** | Exported, never classified. Decide if it is core v1 surface; if it holds a value, align with the input-family labeling contract (P5). | decision / refine | — | S→M | only if kept core |
| **FileUploader** | Bring to structural bar: TS + `<script setup>`, `types.ts`, `*.cy.ts`; declare/deprecate `success`/`failure` emits (P1); flat props over the `uploadArgs` blob (P3); default uploads to `is_private` (security #206). | refactor | #788 (closed unmerged), #673 (CSV MIME) | L | yes |
| **ListView** | Deprecate in favor of `frappe-ui/list`; do not refactor the legacy component for v1. | decision (deprecate) | — | S | no |
| **MonthPicker** | **Remove for v1** (recommended): deprecate the export with a warning + migration note and drop from the core set — it never moved onto the shared picker architecture. Alternative: rebuild on the DatePicker family arch. | decision (remove) | — | S→L | yes |
| **Pill** | **Stop exporting** — confirmed used only inside `TabButtons`. Deprecate the public export (P13), keep it internal; retain `PillSize` for internal use. | decision (un-expose) | — | S | yes |
| **Popover** | Refactor to the v1 floating vocab: `v-model:open`, `side`/`align`/`offset` (deprecate `placement`), `data-slot` hooks (drop `popoverClass`, P10), canonical slots, a11y. The last floating outlier. | refactor | — | M | yes |
| **Sidebar** | Refactor to **molecule-style composable sub-components, no slots**: expose `SidebarHeader` / `SidebarSection` / `SidebarItem` for composition instead of `header`/`sections` config blobs (P3) + generic slots (P10). | refactor | conflicts with #770 (adds a slot — redirect/close) | L | yes |
| **Switch + Checkbox** | Add the `padded` variant. | land PR | #751 (also adds a new **Radio** — decide if Radio enters v1 scope) | S | yes |
| **Tabs + TabButtons** | Unify the two overlapping public components — nest TabButtons' segmented rendering inside `Tabs`, or merge into one `Tabs` with a style axis (P8: a purely-visual variant → one component). Resolve before freeze. | refactor | branches: refactor-tabs, tabs-rewrite, improved-tab-buttons | M | yes |
| **ThemeSwitcher** | Keep exported for v1 compatibility, mark deprecated, and recommend `Select` + `useTheme` for new theme switchers. The composable remains the stable primitive. | decision (deprecate) | — | S | yes |
| **Tree** | Land the rework PR (adds the WAI-ARIA tree pattern + keyboard nav, P12; resolves the `options` config-blob, P3). | land PR | #783 (draft) | track PR | yes |

### Decisions to make first (they shrink scope)

- **MonthPicker → remove / deprecate** rather than rebuild.
- **Pill → un-export** (internal-only).
- **CodeEditor → keep internal** unless there is demand to promote it.
- **ThemeSwitcher → deprecated compatibility export**; `useTheme` stays available as the stable primitive.
- **Radio (from #751) → confirm** whether a new component enters v1 scope or lands post-v1.

Resolving these five as "remove / keep-internal / defer" turns five potential
modernization efforts into doc + deprecation edits.

### Open-PR alignment

- **Land / finish:** #751 (Switch/Checkbox padded), #783 (Tree rework), #788 (FileUploader chunked uploads — fold into the FileUploader pass).
- **Redirect / close** as conflicting with agreed direction: #770 (adds a Sidebar slot; the agreed direction is no-slots composable sub-components).
- **Consolidate** the tab branches (refactor-tabs, tabs-rewrite, improved-tab-buttons) into the single Tabs/TabButtons unification.

## Data API strategy

### v1 data APIs

Examples:

- `createResource`
- `createListResource`
- `createDocumentResource`
- `resourcesPlugin`
- `Resource.vue`

Status for v1:

- still exported
- supported as migration path
- deprecated for new usage
- hidden from standard docs
- documented only on the legacy page and migration guide
- should warn in dev mode

### v2 data APIs

Examples:

- `useList`
- `useDoc`
- `useCall`
- `useDoctype`
- `useNewDoc`

Status for v1:

- still exported
- **not** deprecated for 1.0 — supported
- recommended for Frappe v15 and for codebases not yet on v3
- no dev-mode deprecation warnings
- documented in main docs

Rationale: v3 ships in 1.0 but is recommended only for Frappe v16+. v2 remains
the supported path for v15 users and existing codebases. v2's eventual fate
is a post-v1 decision tied to v3 adoption and v15 backport status.

### v3 data APIs

Implemented in PR #610 (`frappe/client/`). Exports from
`frappe-ui/frappe/vue`:

- `createClient`
- `createDefaultCacheAdapter`
- `defineDoctype` (returned from `createClient`)
- doctype handles: doc / list / count / newDoc

Status for v1:

- ships in 1.0 (merged from PR #610)
- recommended path for new code on Frappe v16+
- **frozen public import surface** — `createClient` and the public types/exports above are stable for the 1.x line
- **internal signatures may evolve** in 1.x minors via deprecation cycles only — no breaking changes
- partial Gameplan migration provides the stress-test signal; full migration is post-v1

### v3 frozen surface contract

What is frozen for 1.0:

- import path `frappe-ui/frappe/vue`
- `createClient` exists and returns `{ defineDoctype, store }` plus the client object
- `createDefaultCacheAdapter(name: string)` exists
- doctype handles for doc / list / count / newDoc exist and are reactive
- public type exports (props, return types of `createClient`, handle types)

What may evolve (only via deprecation cycle in 1.x):

- specific method names on handles
- option keys on `createClient`
- ergonomic additions (new methods, new options)
- cache adapter contract internals

### v3 requirements before v1

- PR #610 self-reviewed against `frappe/client/spec/*.md`
- smoke-tested against the partial Gameplan v3 migration if available
- merged with a one-time dev-mode notice on `createClient` (e.g. "v3 is recommended for Frappe v16+")
- frozen surface contract documented (see section above)
- migration path from v1 resources documented on the legacy page (v2 → v3 deferred to post-v1)

### Frappe Framework compatibility

v3 depends on `/api/v2/*` endpoints in Frappe Framework.

Decision:

- Frappe v15 backport work does **not** block v1
- v3 can be recommended for Frappe v16+
- the v15 backport belongs in the post-v1 roadmap unless it lands naturally earlier

## Deprecation policy

### Dev warnings

Use medium-aggressive warnings in development:

- warn once per deprecated API/component per session or module lifecycle
- include the replacement and a migration-doc reference when possible

### Deprecated but retained exports

Keep exported for migration:

- v1 resource APIs
- v2 composables
- `Resource.vue`
- `Input.vue`
- `Autocomplete`
- `FeatherIcon`

### Special handling

- `Resource.vue`: deprecated and hidden from standard docs
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

See [`../spec/selection.md`](../spec/selection.md).

Key items:

- deprecate `Autocomplete` in favor of separate higher-level components
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
component ships in 1.0 as-is. A full refactor (internals + public API
redesign + the open behavioral fixes) lands in **1.1** with a documented
migration path. Until then, the existing TextEditor surface is supported
unchanged.

Required for 1.0:

- no changes to `TextEditor.vue` public API
- release notes explicitly state the carve-out

Deferred to 1.1 (bundled into a single refactor effort):

- default-off font family / font size policy
- backtick block highlighting fix
- line-height cleanup
- internal modernization (TS + `<script setup>` for sub-components)
- public API redesign with deprecation cycle / migration path
- table editing UX improvements
- collapsible section / additional editor features

### 5. v3 finalization and Gameplan migration

**v1 scope:** v3 ships in 1.0 via PR #610 with a frozen public import
surface (see "Data API strategy" above). Full Gameplan / downstream app
data-fetching migration is **post-v1** and must not block the 1.0 tag.

Required for 1.0:

- PR #610 self-reviewed and merged
- partial Gameplan migration used as a stress-test signal if ready before RC
- frozen surface contract documented
- one-time dev-mode notice on `createClient` ("v3 is recommended for Frappe v16+")

Post-v1 umbrella: full Gameplan migration off v1 resources, eventual v2
deprecation decision, Frappe v15 backport, DocType Meta composable, related
ergonomics. Tracked as a single post-v1 umbrella issue.

### 6. Docs, legacy page, warnings, and RC

Required outputs:

- docs refresh for core components
- v3 data docs
- migration guide
- single legacy APIs/components page
- deprecation warnings in dev mode
- release candidate validation

Legacy page should include at minimum:

- `createResource`
- `createDocumentResource`
- `createListResource`
- `Resource.vue`
- `resourcesPlugin`
- `Input.vue`
- `Autocomplete`
- `FeatherIcon`

v2 composables (`useCall`, `useDoc`, `useList`, `useDoctype`, `useNewDoc`)
stay in the **main** docs — they are not deprecated for 1.0.

## Release blockers

v1 should not ship before all of these are done:

- release contract and quality gates are defined
- core components are migrated to TypeScript and `<script setup>` and have docs/stories/tests baselines (FileUploader remaining; ListView is deprecated in favor of `frappe-ui/list`)
- the [v1 component refinement pass](#v1-component-refinement-pass) is complete: the refactors (FileUploader, Popover, Sidebar, Tabs/TabButtons, Tree) and refinements (Alert, Switch/Checkbox padded) land, and the keep/remove decisions (MonthPicker, Pill, Duration, ThemeSwitcher, CodeEditor, Radio) are made and executed
- selection/input family stabilization is complete enough for v1
- Dialog/floating stabilization is complete enough for v1
- TextEditor 1.0 carve-out documented (public API unchanged; refactor in 1.1)
- v3 PR #610 merged with frozen surface contract documented
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
- full migration of `frappe-ui/frappe/*` internals to v3
- Frappe v15 `/api/v2/*` backport
- TextEditor table editing UX improvements
- downstream migration PRs across all products
- Calendar stabilization
- VueGridLayout modernization

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

- Frappe v15 `/api/v2/*` backport
- session and user utilities
- first-class socket.io utilities
- broader internal migration of `frappe-ui/frappe/*` to v3
- full Gameplan / downstream app migration to v3 data APIs

### Components and editor

- TextEditor table editing UX improvements
- Calendar stabilization and future promotion into the core set if appropriate
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
