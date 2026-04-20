# Migration and Post-v1 Roadmap

## Gameplan migration plan

Gameplan is the primary validation target for v3 data APIs before v1.

## Why Gameplan matters

- It currently uses legacy v1 resource APIs heavily.
- It has real-world UI complexity across discussions, pages, notifications, and forms.
- Migrating it fully is the most practical way to expose missing v3 ergonomics before the v1 tag.

## Current migration surface in Gameplan

Gameplan frontend currently contains legacy usage patterns such as:

- page-level `resources: {}` blocks
- `createListResource(...)`
- `resourcesPlugin` in `main.js`
- legacy fetcher config for resources
- legacy `Input` global registration

v2 usage in Gameplan source is comparatively limited.

## Migration goals

Before `frappe-ui` v1:

- Gameplan frontend is fully migrated to v3 data APIs
- legacy resource usage is removed from `frontend/src`
- no new v2 usage remains in the frontend
- migration findings are folded back into v3 API improvements and docs

## Incremental migration approach

Gameplan should be migrated by domain rather than as a single big-bang rewrite.

Suggested order:

### 1. Client/bootstrap layer

- introduce/finalize the v3 client setup in Gameplan
- establish the import path and generated doctype usage pattern
- keep boot logic clean while removing legacy assumptions over time

### 2. Small and isolated data modules

Examples:

- notifications
- simple counts
- lightweight fetches

Goal:

- validate basic `getDoc`, `getList`, operations, and error handling

### 3. List-heavy pages

Examples:

- discussions
- pages
- list views

Goal:

- validate list ergonomics, filters, mutations, and pagination behaviors

### 4. Form-heavy and mutation-heavy flows

Examples:

- create flows
- update flows
- quick actions
- dialogs

Goal:

- validate operations ergonomics and fill parity gaps such as `.submit`, `.cancel`, or other high-value behaviors

### 5. Remaining legacy edge cases

Examples:

- places that still depend on legacy global plugin behavior
- places that rely on legacy resource conveniences

Goal:

- flush out remaining migration blockers before freeze

### 6. Final cleanup

- remove stale migration helpers if no longer needed in the app
- ensure the app no longer depends on v1/v2 data APIs in active codepaths
- record migration lessons in docs

## Suggested migration acceptance criteria

Gameplan migration should be considered complete when:

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

---

## Legacy docs strategy

## Goal

Keep migration information available without advertising deprecated APIs to new adopters.

## Rules

- Legacy APIs/components should not appear in standard docs navigation as first-class recommendations.
- A single legacy page should collect deprecated surfaces and link to replacements.
- Dev warnings should reinforce the same migration story.

## Legacy page contents

Include at minimum:

### Legacy data APIs

- `createResource`
- `createDocumentResource`
- `createListResource`
- `resourcesPlugin`
- `Resource.vue`

### Deprecated v2 data APIs

- `useCall`
- `useDoc`
- `useList`
- `useDoctype`
- `useNewDoc`

### Deprecated components/utilities

- `Input.vue`
- `Autocomplete`
- `FeatherIcon`

### For each item, document

- why it is deprecated
- what to use instead
- whether it still exists only for migration compatibility
- any notable migration caveats

---

## FeatherIcon migration stance

## v1 stance

- Keep the `FeatherIcon` export for migration compatibility.
- Strongly discourage new usage in docs and dev warnings.
- Remove internal usage from core components before v1.
- Add migration guidance for moving to Lucide.

## Post-v1 follow-up

- scan downstream repos for usage
- open small migration PRs where practical
- gradually reduce ecosystem dependence on `FeatherIcon`

---

## Internal `frappe-ui/frappe/*` migration stance

This should continue, but it is not a blocker for v1.

### Ideal direction

- move internal Frappe-facing packages to v3 over time
- reduce continued dependence on legacy resources in internal packages
- use the same migration patterns proven in Gameplan where possible

### Candidate areas

- `frappe/Link`
- `frappe/Filter`
- `frappe/DataImport`
- `frappe/drive/*`

---

## Frappe Framework v15 backport roadmap

## Current situation

v3 depends on `/api/v2/*` endpoints in Frappe Framework.

## v1 decision

- this does **not** block `frappe-ui` v1
- v3 can be recommended for Frappe v16+

## Post-v1 direction

- identify the minimum `/api/v2/*` framework changes needed for v3 consumers on v15
- backport those changes into the Frappe Framework v15 line where feasible
- update docs once the support story is concrete

---

## Downstream app migration campaign

This is not a blocker for v1, but it should be planned early because deprecations are only successful if migration actually happens.

## Goals

- scan downstream repos for deprecated usage
- open small migration PRs where possible
- prioritize low-risk replacements first

## Good candidates for automated or semi-automated migration

- `FeatherIcon` -> Lucide in common cases
- `Input.vue` -> `TextInput` / `FormControl`
- `Autocomplete` -> split selection components in straightforward cases
- legacy resource usage -> v3 in apps ready for it

## Suggested migration workflow

1. scan repos for deprecated imports/usages
2. classify by migration complexity
3. open simple PRs first
4. document recurring patterns in migration docs
5. keep a running migration checklist across products

---

## Post-v1 roadmap

These items belong in the immediate post-v1 roadmap unless they land naturally earlier.

### Data and framework

- Frappe v15 `/api/v2/*` backport
- session and user utilities
- first-class socket.io utilities
- broader internal migration of `frappe-ui/frappe/*` to v3

### Components and editor

- TextEditor table editing UX improvements
- Calendar stabilization and future promotion into the core set if appropriate
- additional component coverage depth beyond the baseline docs/stories/tests standard

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
