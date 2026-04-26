# Frappe UI v1 Release Plan

This directory contains the active planning docs for `frappe-ui` v1.

## Start here

- [`plan.md`](./plan.md)
  - Main source of truth for scope, blockers, component direction, data migration, TextEditor, and release gates.

## Supporting docs

- [`changelog.md`](./changelog.md)
  - Rolling v1 changelog for consumer-facing changes, deprecations, and migration notes.
- [`04-components-audit.md`](./04-components-audit.md)
  - Core component audit matrix for TS, `<script setup>`, docs, stories, and tests.
- [`08-selection-and-menu-api-spec.md`](./08-selection-and-menu-api-spec.md)
  - Accepted API direction for Dropdown, Select, Combobox, MultiSelect, and ItemListRow.
- [`09-input-components-spec.md`](./09-input-components-spec.md)
  - Accepted API direction for the input family: TextInput, Textarea, Password, Checkbox, Switch, Rating, Slider, and ErrorMessage. Covers the shared labeling contract, size/variant scales, `defineModel` pattern, deprecation warnings, and a wave-by-wave implementation plan. FileUploader is out of scope and addressed in a separate spec.

## Research

- [`research/07-real-world-component-usage-audit.md`](./research/07-real-world-component-usage-audit.md)
  - Bench-wide usage audit that informed the selection/menu API spec.
- [`research/09-input-components-usage-audit.md`](./research/09-input-components-usage-audit.md)
  - Bench-wide usage audit that locked the parked decisions in the input-components spec.
