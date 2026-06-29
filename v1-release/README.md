# Frappe UI v1 Release Plan

This directory contains the active planning docs for `frappe-ui` v1.

## Start here

- [`plan.md`](./plan.md)
  - Main source of truth for scope, blockers, component direction, data migration, TextEditor, and release gates.

## Supporting docs

- **Migration guide** — published at <https://ui.frappe.io/docs/migration> (source: [`docs/content/docs/migration.md`](../docs/content/docs/migration.md)). Per-component before/after tables for app teams upgrading to v1.
- [`changelog.md`](./changelog.md)
  - Rolling v1 changelog for consumer-facing changes, deprecations, and migration notes.

## Component API contracts

Component API contracts and ADRs now live in [`../spec/`](../spec/) — see
[`../spec/README.md`](../spec/README.md). The numbered `08*` / `09*` / `10*`
specs that used to live here were consolidated into `spec/` (semantic
filenames), with `spec/` as the single source of truth per
[`CONTEXT.md`](../CONTEXT.md).
