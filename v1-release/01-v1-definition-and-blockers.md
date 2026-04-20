# v1 Definition and Blockers

## v1 definition

`frappe-ui` v1 is a **narrow**, **API-freeze-first** release.

The goal is not to make every part of the repository feature-complete. The goal is to make the **core component surface** and the **recommended data API path** stable enough to support a long-lived `1.x` line without immediate breaking corrections.

## Release philosophy

1. **Stabilize what people should use next.**
   - For components, that means the core public component set.
   - For data APIs, that means v3.
2. **Keep migration paths open.**
   - v1 resource APIs remain available.
   - v2 composables remain available.
   - Both should warn in dev mode and move out of the happy path.
3. **Use a real app to validate the new direction.**
   - Gameplan is the proving ground for v3.
4. **Avoid unnecessary breadth before freeze.**
   - Non-core areas should not silently become blockers.

## Core vs non-core

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

## Component API strategy

### Research direction

Component API research should focus mainly on:

- composition patterns
- slot strategy
- extensibility without future breaking changes
- consistent prop naming
- controlled vs uncontrolled patterns

Primary reference style:

- shadcn/ui

### API consistency rules for v1

These should guide core component audit and cleanup:

- Prefer behavior-oriented naming over interaction-oriented naming.
- Prefer consistent `modelValue` / `update:modelValue` patterns where appropriate.
- Prefer primitive props over overloaded object props unless the component genuinely needs structure.
- Prefer smaller focused components over overloaded multi-mode components.
- Keep slots intentional and documented.
- Stabilize a small set of shared vocabularies for `size`, `variant`, and `placement` where practical.

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

v3 does not need to be perfect, but it must be production-viable and validated by Gameplan.

Required outcomes:

- public import surface finalized
- public handle semantics finalized
- missing ergonomic operations added as needed during migration
- `.submit`, `.cancel`, and similar high-value parity gaps resolved where needed
- migration path from v1 and v2 documented
- Gameplan fully migrated to v3

### Frappe Framework compatibility

v3 depends on `/api/v2/*` endpoints in Frappe Framework.

Decision:

- Frappe v15 backport work is **not a v1 blocker**
- v3 can be recommended for **Frappe v16+**
- the v15 backport should remain in the roadmap

## Deprecation policy for v1

### Dev warnings

Use medium-aggressive warnings in development:

- warn once per deprecated API/component per session or module lifecycle
- include:
  - that the API is deprecated
  - the recommended replacement
  - a migration-doc reference when possible

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
- `Autocomplete`: deprecated in favor of split selection components
- `FeatherIcon`: export retained, but internal core usage should be removed and docs should strongly discourage adoption

## Tight blocker set

## 1. Release contract and quality gates

Blockers:

- Frappe UI Guidelines & Roadmap
- Semantic Versioning
- Automated GitHub action checks
- docs refresh
- migration guide
- release candidate validation

## 2. Core component audit and modernization

Blockers:

- all core components migrated to TypeScript and `<script setup>`
- baseline docs for all core components
- baseline stories for all core components
- baseline tests for all core components
- public API audit across the full core set

## 3. Selection/input family stabilization

Blockers:

- Separate Autocomplete components
- Deprecate Autocomplete
- finalize Combobox
- finalize Dropdown
- finalize Listbox
- finalize MultiSelect
- finalize FormControl
- finalize Switch
- deprecate Input.vue

## 4. Floating and overlay stabilization

Blockers:

- Dialog cleanup/finalization
- floating utilities consolidation

## 5. TextEditor stabilization

Blockers:

- internal simplification/refactor
- public API stabilization
- backtick block highlighting bug fix
- line-height cleanup

Not a blocker:

- table editing UX improvements

## 6. Data API transition

Blockers:

- v3 finalized enough for production use
- Gameplan fully migrated to v3
- v3 documented as recommended
- v1 resources warned and moved to legacy docs
- v2 composables warned and moved to legacy docs
- migration path documented

## 7. Deprecation cleanup

Blockers:

- `Resource.vue` deprecated and hidden from standard docs
- `Input.vue` deprecated
- `Autocomplete` deprecated
- `FeatherIcon` deprecated while retaining export
- internal core `FeatherIcon` usage removed

## Explicitly not blockers

These stay in the plan, but should not block `1.0.0`:

- Session and user utilities
- First-class socket.io utilities
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
