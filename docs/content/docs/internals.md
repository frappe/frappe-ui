# Internals

The `frappe-ui/internals` subpath exposes internal building blocks —
composables, class helpers, components and headless logic — that are not part of the
public API.

Think of it as a staging area: exports live here while their API settles. Over
time, some of them get promoted to the public API and others get removed.

> **Unstable API** — everything exported from `frappe-ui/internals` is exempt
> from the usual deprecation policy and can change shape or disappear in _any_
> release, including minor and patch releases, with no deprecation window.
> Do **not** import this subpath from product apps or third-party code — pin
> to a public entry point instead.

## useInputLabeling

Shared headless logic for input components: it wires up the label,
description, and error region of a form control, and computes the matching
ARIA and `data-*` attributes. All frappe-ui input components use it
internally, so a custom control built with it gets the same behavior and
styling hooks for free.

```ts
import { useInputLabeling } from 'frappe-ui/internals'

const { inputId, labelledBy, describedBy, hasError, errorLines, dataAttrs } =
  useInputLabeling(props, { size: () => props.size })
```

## inputFontSizeClasses

Returns the Tailwind font-size class frappe-ui input components use for a
given size token (`'sm' | 'md' | 'lg' | 'xl'`), so custom controls render text
at the same scale as built-in ones.

```ts
import { inputFontSizeClasses } from 'frappe-ui/internals'

inputFontSizeClasses('sm') // 'text-base'
inputFontSizeClasses('lg') // 'text-lg'
```
