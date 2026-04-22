---
description: 'frappe-ui library development standards and best practices'
applyTo: 'src/**, docs/**, vite/**, tailwind/**, icons/**, frappe/**, v1-release/**'
---

# Project Name: frappe-ui

**frappe-ui** is a Vue 3 component library and utilities package designed for
rapid development of modern Frappe-based web applications.

## Overview

frappe-ui provides a broad set of Vue 3 components, utility layers,
Frappe-oriented integrations, docs tooling, and styling primitives used across
multiple Frappe products.

This file defines the **general development guidance for the repository**.

## How to use v1-release docs

The docs in `v1-release/` are important **planning and direction documents**.
They should **inform** implementation decisions in areas they cover, but they
should not replace this file as the general repo-wide guidance.

Use them primarily when working on:

- core component stabilization
- component API consistency
- selection/menu family APIs
- deprecation and migration decisions
- TextEditor narrowing and stabilization
- release-facing docs and changelog updates

Especially relevant files:

- `v1-release/plan.md`
- `v1-release/04-components-audit.md`
- `v1-release/08-selection-and-menu-api-spec.md`
- `v1-release/changelog.md`

If you are working outside those topics, follow the normal repo guidance in this
file.

## Tech Stack & Architecture

- **Frontend Framework**: Vue 3 with Composition API and `<script setup>` syntax
- **Language**: TypeScript-first authoring for public APIs and modern components
- **Build Tool**: Vite
- **Styling**: TailwindCSS v3 with semantic color tokens
- **UI Primitives**: Reka UI / accessible headless primitives
- **Rich Text**: TipTap v3
- **Date Utilities**: dayjs
- **Testing**: Vitest
- **Documentation**: VitePress

## Project Structure

```bash
frappe-ui/
├── src/
│   ├── components/               # Main library source code
│   ├── data-fetching/            # Vue 3 composables for Frappe API access
│   ├── resources/                # Older resource APIs kept for compatibility
│   ├── mocks/                    # Mock service worker handlers and test helpers
│   ├── composables/              # Reusable Vue composables
│   ├── directives/               # Vue directives
│   ├── utils/                    # Shared utilities
│   └── index.ts                  # Main export surface
├── docs/                         # VitePress docs site
├── icons/                        # Custom icon components
├── tailwind/                     # Tailwind preset/plugin/colors
├── vite/                         # Vite plugins and helpers
├── frappe/                       # Frappe-specific components and utilities
└── v1-release/                   # Planning docs for v1 stabilization work
```

## Development Standards

### General engineering principles

- Treat frappe-ui as a **reusable library**, not an app codebase
- Prefer stable, high-signal public APIs over clever internal abstractions
- Optimize for maintainability, consistency, and migration safety
- Keep component responsibilities narrow and composable
- Avoid growing components into do-everything abstractions
- Prefer small, requirement-driven changes over speculative rewrites
- When a behavior is public, preserve backwards compatibility unless the task
  explicitly involves a planned breaking change or deprecation path

## Component Authoring Guidelines

### Component structure and API design

When creating or modernizing a component, prefer this structure:

```bash
src/components/ComponentName/
├── ComponentName.vue
├── types.ts
├── utils.ts           # optional
├── stories/           # optional but preferred for public components
└── index.ts
```

For small legacy components that do not yet match this structure, prefer moving
incrementally toward it instead of forcing a large rewrite unless the task calls
for one.

### TypeScript requirements

For public component APIs, use consistent naming:

- `ComponentNameProps`
- `ComponentNameEmits`
- `ComponentNameSlots`
- `ComponentNameExposed`
- `ComponentNameSize`, `ComponentNameVariant`, `ComponentNameTheme`, etc.

These names matter because public types and JSDoc are used to generate
component documentation metadata.

### JSDoc expectations

Every public prop, emit, and slot should have a JSDoc description.

Use JSDoc for:

- generated docs
- IntelliSense quality
- clear API contracts for consumers

### Vue authoring conventions

Prefer:

- `<script setup lang="ts">`
- `defineProps<Props>()`
- `defineEmits<Emits>()`
- `defineSlots<Slots>()`
- `defineExpose<Exposed>()` when truly needed
- `withDefaults()` for sensible defaults
- `computed` instead of `watch` when deriving state
- small, focused composables for reusable logic

Avoid:

- Options API for new component work unless there is a compelling migration reason
- runtime prop validation when TypeScript is enough
- broad watchers when a narrower reactive dependency would do
- imperative DOM access unless necessary

### Public API design rules

Prefer:

- narrow and predictable component boundaries
- props and slots as the default customization mechanism
- `v-model` / `modelValue` for the primary value state
- `v-model:open` for visibility state where relevant
- semantic event names like `change`, `open`, `close`, `submit`
- slots over render functions for normal customization
- limited, requirement-driven escape hatches

Avoid:

- giant multi-mode components with too many flags
- exposing low-level composition as the default user story
- breaking or renaming public APIs casually
- proliferating one-off event and slot names across similar components

### Component consistency

Consistency matters a lot in a UI library.

When working across related components, try to align:

- prop names
- event names
- slot vocabulary
- size / variant naming
- controlled / uncontrolled behavior
- visibility APIs (`open`, `v-model:open`)
- positioning vocabulary (`side`, `align`, `placement`, `offset`)

## Strategic direction currently influencing the repo

These are **important directional signals**, not hard rules for every file.

### 1. Core component quality bar is rising

Many public components are being pushed toward a stronger baseline:

- TypeScript
- `<script setup>`
- `types.ts`
- docs
- stories
- tests

When touching a public component that is still legacy, prefer nudging it toward
that baseline if the change is local and safe.

### 2. Selection/menu family needs consistent APIs

When working on:

- `Dropdown`
- `Select`
- `Combobox`
- `MultiSelect`
- related shells and shared list primitives

use `v1-release/08-selection-and-menu-api-spec.md` as guidance.

Broad preferred direction:

- keep each component narrowly scoped
- do not turn `Dropdown` into a generic value picker
- prefer shared item slot vocabulary like:
  - `#trigger`
  - `#item-prefix`
  - `#item-label`
  - `#item-suffix`
  - `#empty`
  - `#footer`
- prefer shell-owned row structure over forcing consumers to rebuild rows
- support `v-model:open` where appropriate
- prefer `@update:query` for searchable components when relevant

### 3. Some APIs are compatibility layers, not the preferred path

These areas still matter and should be maintained carefully, but should not be
presented as the ideal API for new work unless the task is specifically about
legacy compatibility:

- `src/resources/*`
- older resource-style APIs
- older compatibility components like `Resource.vue`, `Input.vue`,
  `Autocomplete`, and `FeatherIcon`

If you touch them:

- preserve compatibility unless the task is explicitly a migration/deprecation task
- prefer conservative bug fixes and migration-safe improvements
- avoid expanding their scope unnecessarily

### 4. TextEditor should be stabilized thoughtfully

When touching `TextEditor`, prioritize:

- internal simplification
- public API stability
- safe defaults
- docs / stories / tests alignment

Use `v1-release/plan.md` for the current planning direction in that area.

## Icons

### Lucide icons

Prefer Lucide icons for new work.

```vue
<template>
  <LucideCheck class="size-4" />
</template>
```

```ts
import LucideCheck from '~icons/lucide/check'
```

### FeatherIcon

`FeatherIcon` still exists and is used in parts of the repo, so do not break it
casually. But for new component work, prefer Lucide.

If you are already modifying a small area that uses `FeatherIcon`, it is usually
reasonable to migrate it if the change stays low-risk.

## Styling Standards

### Semantic color system

Always prefer semantic design tokens over hardcoded colors.

Examples:

- `bg-surface-*`
- `text-ink-*`
- `border-outline-*`
- `fill-ink-*`
- `placeholder-ink-*`

### Layout and spacing

Prefer Tailwind utility classes for layout and spacing.

Use:

- `size-*` for square elements
- flex and grid utilities for layout
- responsive utilities when needed

### Stable styling hooks

When a component owns its shell, prefer stable styling and testing hooks such as:

- `data-slot`
- `data-state`
- `data-size`
- `data-variant`
- `data-disabled`

These reduce the need for fragile DOM assumptions and full markup replacement.

### Scoped styles

Use `<style scoped>` only when utility classes and stable hooks are not enough.

## Data Fetching Guidance

frappe-ui currently contains multiple generations of data APIs.

### `src/resources/`

This is an older compatibility layer. Treat it as mature and compatibility
sensitive.

When working here:

- favor conservative fixes
- preserve existing behavior when possible
- avoid broad redesigns unless explicitly asked

### `src/data-fetching/`

This contains newer composable-based data APIs.

When working here, focus on:

- reactive correctness
- cache behavior
- loading and error state handling
- API contract clarity
- mutation ergonomics
- type safety

Avoid opportunistic migration work unless the task is explicitly about data API
migration or modernization.

## Documentation

### Docs philosophy

Public components should be documented in a way that matches how consumers are
expected to use them, not just how the internals currently happen to work.

Docs should prioritize:

- intended API shape
- examples of normal usage
- slots and customization points
- accessibility guidance where relevant
- migration notes when behavior changes matter to consumers

### Generated metadata

`docs/meta/` is generated output.

Do not treat it as the source of truth. If docs metadata looks wrong, fix the
underlying component types, JSDoc, or docs generation inputs.

### Stories

Stories should be:

- focused
- representative
- easy to scan
- based on public APIs

Common story types:

- `Sizes.vue`
- `Variants.vue`
- `States.vue`
- `WithIcons.vue`
- `Interactive.vue`

## Testing Guidance

For public components, tests should focus on behavior that consumers rely on:

- rendering states
- keyboard interaction
- focus behavior
- ARIA semantics
- emitted events
- controlled and uncontrolled usage
- slot behavior when it affects output

Avoid shallow tests that only assert implementation trivia.

## Accessibility

Accessibility is part of component quality, not a later polish pass.

Prioritize:

- semantic structure
- keyboard navigation
- focus management
- accessible labels and relationships
- overlay trigger/content semantics
- disabled state behavior

## Code Quality

### Comments

- explain **why**, not **what**
- use JSDoc/TSDoc for public APIs and non-obvious logic
- avoid noisy inline comments

### Review priorities

When reviewing or implementing changes in this repo, prioritize:

- real bugs and regressions
- API consistency
- backwards compatibility risks
- TypeScript correctness
- accessibility
- docs/story/test drift
- maintainability of public library code

Avoid over-indexing on:

- formatting-only feedback
- Tailwind class ordering nits
- speculative refactors with unclear user value
- app-level architectural advice that does not fit a reusable library

## Release-facing docs in `v1-release/`

The files in `v1-release/` are planning and release-support docs.

When editing them:

- keep `plan.md` focused on scope, blockers, and direction
- keep `changelog.md` consumer-facing
- keep audits concrete and evidence-based
- do not mix speculative ideas into accepted-direction docs without making that
  status clear

## Miscellaneous

- ignore newline-only errors
- prefer small, focused edits over repository-wide churn
- preserve migration safety in legacy areas unless explicitly asked to change it
