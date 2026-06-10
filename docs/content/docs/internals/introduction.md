# Internals

The `frappe-ui/internals` subpath exposes internal building blocks —
composables, class helpers, and headless logic — so that first-party Frappe
libraries (e.g. `@framework/ui`) can reuse them without each one being promoted
to the public API.

```js
import { useInputLabeling, inputFontSizeClasses } from 'frappe-ui/internals'
```

> **Unstable API** — everything exported from `frappe-ui/internals` is exempt
> from the usual deprecation policy and can change shape or disappear in _any_
> release, including minor and patch releases, with no deprecation window.
> Do **not** import this subpath from product apps or third-party code — pin
> to a public entry point instead.

## What lives here

The subpath is a curated barrel (`internals.ts` at the package root), not a
wildcard over `src/`. It only re-exports what a first-party consumer actually
needs:

- [useInputLabeling](/docs/internals/composables/use-input-labeling) — shared
  labeling, description, error, and ARIA wiring for input components.
- [Utilities](/docs/internals/utilities) — class helpers like
  `inputFontSizeClasses`.

Docs for internal components live under `/docs/internals/components`.

## Exposing a new internal

Add a re-export to `internals.ts` at the repository root — nothing else needs
to be wired up. Keep the list limited to what a first-party consumer actually
needs, and add a matching page under this section of the docs.
