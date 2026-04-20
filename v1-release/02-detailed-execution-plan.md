# Detailed Execution Plan

## Planning assumptions

This plan assumes:

- v1 is narrow
- API freeze comes before breadth
- Gameplan is the proving ground for v3
- deprecations are acceptable if they are documented and warned
- Frappe v15 compatibility work does not block v1

## Workstreams

## 1. Component API research and freeze rules

### Goal

Define reusable rules for how core component APIs should evolve without painting `1.x` into a corner.

### Scope

- research mainly against shadcn/ui-style composition patterns
- define consistent rules for:
  - prop naming
  - `v-model` usage
  - slot strategy
  - extensibility points
  - behavior naming
  - controlled vs uncontrolled usage

### Deliverables

- short API design note or rubric
- accepted naming rules for common patterns
- freeze decisions for shared vocabularies such as `size`, `variant`, and `placement`

### Exit criteria

- the team agrees on component API rules before large-scale cleanup begins

### Suggested owners

- lead: `siduck`
- support: `netchampfaris`

---

## 2. Core component modernization

### Goal

Bring the full core component set to a minimum modern standard before v1.

### Scope

For every core component:

- TypeScript
- `<script setup>`
- docs page
- baseline stories
- baseline component test
- API audit

### Known current debt

Legacy/Options API still exists in multiple public components, including examples such as:

- `ConfirmDialog.vue`
- `TabButtons.vue`
- `Card.vue`
- `LoadingText.vue`
- `FormControl.vue`
- `ListItem.vue`
- `FileUploader.vue`
- `Input.vue`
- plus several TextEditor internals

### Deliverables

- migration of remaining core legacy components to the standard
- normalized exports where practical
- removal of internal `FeatherIcon` use in core components
- baseline docs/stories/tests coverage for all core components

### Exit criteria

- every core component meets the baseline modernization bar
- no core component remains on legacy public implementation patterns

### Suggested owners

- lead: shared component working group
- likely contributors: `siduck`, `netchampfaris`, `safwansamsudeen`

---

## 3. Selection/input family stabilization

### Goal

Turn the selection/input family into a clear, composable, stable set of building blocks.

### Scope

- split/deprecate Autocomplete
- finalize:
  - Combobox
  - Dropdown
  - Listbox
  - MultiSelect
  - FormControl
  - Switch
- deprecate `Input.vue`

### Why this is a dedicated workstream

This cluster has high surface area and currently affects:

- public API consistency
- FormControl behavior
- migration complexity
- app-level usage in Gameplan and elsewhere

### Deliverables

- clear responsibilities for each component
- migration guidance from `Autocomplete` to the new split model
- stabilized `FormControl` behavior across supported input types
- `Switch` aligned with the modern form-control conventions

### Exit criteria

- consumers can clearly choose between selection components
- deprecated selection components warn in dev
- no critical ambiguity remains between overlapping inputs

### Suggested owners

- lead: `siduck`
- support: `netchampfaris`

---

## 4. Floating and overlay primitives

### Goal

Stabilize the overlay/floating stack so core popups behave consistently before v1.

### Scope

- Dialog cleanup/finalization
- floating utilities consolidation
- resolve inconsistencies that affect:
  - Dialog
  - Popover
  - Dropdown
  - Select
  - Combobox
  - Tooltip

### Deliverables

- a coherent positioning strategy
- stable Dialog API
- fewer divergent internal primitive patterns

### Exit criteria

- floating behavior is consistent enough for v1 freeze
- Dialog is stable enough to document as a long-lived API

### Suggested owners

- lead: `siduck`
- support: component working group

---

## 5. TextEditor stabilization

### Goal

Make `TextEditor` stable for v1 without expanding its feature scope.

### Scope

- simplify internal structure
- deduplicate code where possible
- stabilize public API
- fix correctness and polish issues required for confidence

### Required items

- backtick block highlighting fix
- line-height cleanup
- public API stabilization
- baseline docs/stories/tests if not already sufficient

### Explicitly not required for v1

- major new features
- richer table editing UX
- broad expansion of editor capabilities

### Deliverables

- simplified internal architecture
- documented public API that can survive through `1.x`
- removal or reduction of unnecessary internal duplication

### Exit criteria

- editor public API is stable and documented
- correctness bugs that undermine confidence are fixed
- team agrees table UX can move to post-v1

### Suggested owners

- lead: `netchampfaris`
- support: `safwansamsudeen`

---

## 6. v3 data API finalization

### Goal

Make v3 the default recommended data API for new work.

### Scope

- finalize the public import surface for v3
- refine handle ergonomics through real migration work
- address parity gaps needed for production adoption
- define clear docs and migration guidance

### Required outcomes

- v3 import path story finalized
- v3 handle semantics finalized
- `.submit`, `.cancel`, and similar needed additions addressed
- v3 docs are good enough for adoption
- v1 resources and v2 composables are marked as deprecated and warned in dev

### Important constraint

- v3 may be recommended mainly for Frappe v16+
- Frappe v15 backport work is post-v1 unless it lands early

### Exit criteria

- v3 is production-viable in a real app
- docs recommend v3 without major caveats for v16+
- migration path from v1/v2 is explicit

### Suggested owners

- lead: `netchampfaris`
- support: anyone working on Gameplan migration and framework integration

---

## 7. Gameplan migration to v3

### Goal

Use Gameplan as the full proving ground for v3 before tagging v1.

### Current state snapshot

Gameplan currently relies heavily on legacy resource APIs in `frontend/src`, including:

- page-level `resources: {}`
- `createListResource(...)`
- `resourcesPlugin` in `main.js`
- global legacy config wiring for resource fetcher

v2 usage exists, but is comparatively small.

### Migration approach

Incremental by domain, but full before v1.

Suggested sequence:

1. app bootstrap and client setup
2. notifications and small data modules
3. pages/discussions/lists
4. forms and mutations
5. remaining legacy resources usage
6. final cleanup and removal of app-side legacy assumptions

### Deliverables

- Gameplan frontend fully on v3 data APIs
- no remaining usage of legacy v1 resources in `frontend/src`
- no new v2 usage
- migration notes collected as inputs to docs

### Exit criteria

- Gameplan is fully migrated
- migration reveals and resolves major v3 ergonomic gaps
- app behavior remains correct across key flows

### Suggested owners

- lead: `netchampfaris`
- support: Gameplan frontend contributors

---

## 8. Docs, legacy page, warnings, and RC

### Goal

Make the release understandable and adoptable.

### Scope

- docs refresh for core components
- v3 data docs
- migration guide
- single legacy APIs/components page
- deprecation warnings in dev mode
- release candidate validation

### Legacy page contents

At minimum:

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

### Warning policy

Medium-aggressive in dev:

- warn once per deprecated API/component per session or module lifecycle
- point to the replacement and migration docs

### Exit criteria

- docs are current enough for new adoption
- legacy page exists
- migration guide exists
- RC has been tested against the intended v1 surface

### Suggested owners

- lead: shared
- contributors: component owners + data API owners

---

## Phase plan

## Phase 0 — API research and freeze rules

### Goal

Agree on component API rules before broad cleanup.

### Includes

- component API research
- freeze rules for component conventions
- confirm core component expectations

### Exit criteria

- component API rubric approved

---

## Phase 1 — Finalize blocker scope and release contract

### Goal

Lock what actually blocks v1.

### Includes

- roadmap issue updates
- semver/release policy
- CI gate definition
- docs/migration/RC gates agreed

### Exit criteria

- blocker set is explicit and agreed

---

## Phase 2 — Core component modernization

### Goal

Bring the core component set to the baseline standard.

### Includes

- TS + `<script setup>` migrations
- docs/stories/tests baseline
- removal of internal legacy patterns in core components
- internal `FeatherIcon` migration in core components

### Exit criteria

- all core components meet the modernization bar

---

## Phase 3 — Selection/input family + floating stack

### Goal

Stabilize the highest-risk public component APIs.

### Includes

- Autocomplete split/deprecation
- FormControl
- Switch
- Input deprecation
- Combobox / Dropdown / Listbox / MultiSelect finalization
- Dialog and floating utilities

### Exit criteria

- selection/input family APIs are stable enough to freeze
- Dialog/floating behavior is reliable enough to freeze

---

## Phase 4 — v3 data API refinement + Gameplan migration

### Goal

Refine v3 using real production-like migration work.

### Includes

- v3 parity additions
- Gameplan migration by domain
- import surface finalization
- docs updates during migration

### Exit criteria

- Gameplan fully migrated to v3
- v3 recommended docs are credible

---

## Phase 5 — TextEditor stabilization

### Goal

Stabilize editor without expanding scope.

### Includes

- internal simplification
- bug fixes
- public API cleanup
- docs/stories/tests if needed

### Exit criteria

- TextEditor stable enough for v1 inclusion

---

## Phase 6 — Docs, deprecations, RC

### Goal

Finish the release surface and validate it.

### Includes

- complete docs pass
- complete legacy page
- migration guide
- dev warnings
- release candidate

### Exit criteria

- all release gates are satisfied

---

## Release gate checklist

Before `1.0.0`:

- [ ] lint passes
- [ ] typecheck passes
- [ ] unit tests pass
- [ ] component tests pass
- [ ] core components all meet the modernization bar
- [ ] v3 docs are complete enough for adoption
- [ ] legacy page exists
- [ ] migration guide exists
- [ ] deprecated APIs/components warn in dev
- [ ] Gameplan is fully on v3
- [ ] RC has been validated
