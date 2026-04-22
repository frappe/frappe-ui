# Frappe UI v1 Changelog

This file tracks user-facing v1 changes as they land.

Keep entries focused on:

- breaking changes
- deprecations
- behavior changes users will notice
- migration guidance

Do not log internal refactors, test additions, or planning/doc maintenance
unless they affect consumers.

## Unreleased

### Breaking

- None.

### Deprecated

- `Divider.action.handler` is deprecated in favor of `Divider.action.onClick`.
  - Backwards compatibility is preserved for now.
  - A warning is shown when `handler` is used.

### Changed

- Divider action mode now supports `action.onClick` as the preferred callback
  API.
- Uncontrolled `Slider` now initializes to `min` instead of rendering with no
  thumb.
- Divider action mode now preserves separator semantics for assistive
  technologies.

### Migration notes

- Replace `Divider.action.handler` with `Divider.action.onClick`.

## Deprecation log

| API                      | Status     | Replacement              | Notes                                                      |
| ------------------------ | ---------- | ------------------------ | ---------------------------------------------------------- |
| `Divider.action.handler` | Deprecated | `Divider.action.onClick` | Still supported with a warning for backwards compatibility |
