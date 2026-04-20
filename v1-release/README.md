# Frappe UI v1 Release Plan

This directory contains the agreed release planning documents for `frappe-ui` v1.

## Documents

- [`01-v1-definition-and-blockers.md`](./01-v1-definition-and-blockers.md)
  - Scope, blocker set, release gates, and deprecation policy.
- [`02-detailed-execution-plan.md`](./02-detailed-execution-plan.md)
  - Workstreams, phases, suggested owners, dependencies, and exit criteria.
- [`03-migration-and-post-v1-roadmap.md`](./03-migration-and-post-v1-roadmap.md)
  - Gameplan migration plan, legacy docs strategy, downstream migration plan, and post-v1 items.
- [`04-components-audit.md`](./04-components-audit.md)
  - First-pass core component audit for TS, `<script setup>`, docs, stories, and tests.

## Executive summary

`frappe-ui` v1 should be a **narrow, API-freeze-first** release.

### What v1 means

- Core component APIs are stable and audited.
- Core components are modernized to:
  - TypeScript
  - `<script setup>`
  - docs
  - stories
  - tests
- `TextEditor` is simplified and stable.
- v3 data APIs are the recommended path.
- Gameplan is fully migrated to v3 data APIs before the v1 tag.
- v1 and v2 data layers remain exported for migration, but are deprecated and warn in dev mode.
- Legacy APIs/components are moved out of the happy path and documented on a single legacy page.

### What does not block v1

- Session/user utilities
- First-class socket utilities
- Frappe v15 `/api/v2/*` backport
- Full internal migration of every `frappe-ui/frappe/*` package to v3
- TextEditor table UX improvements
- Calendar stabilization
- Downstream app migration PRs across all products

### Core component set for v1

Included in core audit/freeze:

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

Explicitly not core for v1:

- Calendar
- Resource
- VueGridLayout

### Key strategic decisions

- v1 data layer (`createResource`, `createListResource`, etc.) stays exported for migration.
- v2 composables (`useList`, `useDoc`, `useCall`, etc.) stay exported but are deprecated.
- v3 client APIs (`frappe/client/*`) become the recommended data path, primarily for Frappe v16+.
- `Resource.vue`, `Input.vue`, `Autocomplete`, and `FeatherIcon` remain exported for migration but are deprecated.
- `FeatherIcon` export remains, but internal core usage should be removed.
- Legacy APIs/components are documented on a single legacy page, not in normal docs navigation.

### Release gates

v1 should not be tagged until all of the following are true:

- lint passes
- typecheck passes
- unit tests pass
- component tests pass
- docs are refreshed
- legacy page exists
- migration guide exists
- Gameplan is fully migrated to v3 data APIs
- a release candidate has been validated

## Planning principles

- Freeze public APIs before adding more breadth.
- Prefer migration paths over hard removals.
- Use Gameplan as the proving ground for v3.
- Use component API research mainly to improve composability and future extensibility without introducing avoidable breaking changes.
- Keep the v1 story simple for new users, even if legacy compatibility remains in the package.
