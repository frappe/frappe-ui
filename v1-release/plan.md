# Frappe UI v1 Plan

This is the main planning document for the `frappe-ui` v1 release.

Keep separate docs only where that genuinely helps:

- [`04-components-audit.md`](./04-components-audit.md) for the component audit matrix
- [`08-selection-and-menu-api-spec.md`](./08-selection-and-menu-api-spec.md) for the accepted menu/selection API direction
- [`09-input-components-spec.md`](./09-input-components-spec.md) for the accepted input-family API direction (TextInput, Textarea, Password, Checkbox, Switch, Rating, Slider, ErrorMessage; FileUploader covered separately)

## What v1 means

`frappe-ui` v1 is a **narrow, API-freeze-first** release.

The goal is not to make every part of the repository feature-complete. The goal is to make the core component surface and the recommended data API path stable enough to support a long-lived `1.x` line without immediate breaking corrections.

In practice, v1 means:

- core component APIs are stable and audited
- core components are modernized to TypeScript, `<script setup>`, docs, stories, and tests
- v3 data APIs are the recommended path for new work
- Gameplan is fully migrated to v3 before the tag
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

Use [`08-selection-and-menu-api-spec.md`](./08-selection-and-menu-api-spec.md) as the source of truth for that family.

### Still open

We have **not** yet agreed on broad reusable rules for every complex component family. Dialog, Tooltip, Tabs, and other overlay/component families still need separate design passes.

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
- deprecated
- not recommended
- should warn in dev mode
- documented only on the legacy page and migration guide

### v3 data APIs

Examples:

- `createClient`
- generated doctype handles
- `getDoc`
- `getList`
- `newDoc`
- `getCount`
- doctype-level operations

Status for v1:

- recommended path
- documented as the default data API for new work
- refined through full Gameplan migration
- recommended primarily for Frappe v16+

### v3 requirements before v1

- public import surface finalized
- public handle semantics finalized
- missing ergonomic operations added where needed during migration
- `.submit`, `.cancel`, and similar high-value parity gaps resolved where needed
- migration path from v1 and v2 documented
- Gameplan fully migrated to v3

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
- `FeatherIcon`: export retained, but internal core usage should be removed and docs should strongly discourage adoption

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

See [`08-selection-and-menu-api-spec.md`](./08-selection-and-menu-api-spec.md).

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

v1 stance:

- font family disabled by default
- font size disabled by default
- apps must explicitly opt in to both

Required work:

- internal simplification/refactor
- public API stabilization
- backtick block highlighting fix
- line-height cleanup
- docs/stories/tests updated as needed for the default-off behavior

Not a blocker:

- richer table editing UX
- broader formatting expansion
- major new editor features

### 5. v3 finalization and Gameplan migration

Use Gameplan as the proving ground for v3.

Required outcomes:

- v3 is production-viable in a real app
- Gameplan frontend is fully migrated to v3 data APIs
- legacy resource usage is removed from `frontend/src`
- no new v2 usage remains in the frontend
- migration findings are folded back into v3 API improvements and docs

Suggested migration order:

1. client/bootstrap layer
2. small and isolated data modules
3. list-heavy pages
4. form-heavy and mutation-heavy flows
5. remaining legacy edge cases
6. final cleanup

Gameplan migration acceptance criteria:

- `frontend/src` no longer uses:
  - `resources: {}`
  - `$resources`
  - `$getResource`
  - `createResource`
  - `createListResource`
  - `createDocumentResource`
  - v2 composables in active app codepaths
- Gameplan boots and works correctly on v3 data APIs
- key data flows are exercised in manual QA and RC validation

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
- `useCall`
- `useDoc`
- `useList`
- `useDoctype`
- `useNewDoc`
- `Input.vue`
- `Autocomplete`
- `FeatherIcon`

## Release blockers

v1 should not ship before all of these are done:

- release contract and quality gates are defined
- core components are migrated to TypeScript and `<script setup>` and have docs/stories/tests baselines
- selection/input family stabilization is complete enough for v1
- Dialog/floating stabilization is complete enough for v1
- `TextEditor` default-off font family and font size policy is implemented
- v3 is finalized enough for production use
- Gameplan is fully migrated to v3
- deprecation warnings and legacy docs exist
- internal core `FeatherIcon` usage is removed
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
- Gameplan is fully on v3 data APIs
- release candidate has been validated

## Immediate post-v1 roadmap

These are important, but should not block v1 unless they land naturally earlier.

### Data and framework

- Frappe v15 `/api/v2/*` backport
- session and user utilities
- first-class socket.io utilities
- broader internal migration of `frappe-ui/frappe/*` to v3

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
