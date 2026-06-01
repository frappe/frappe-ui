# Frappe Controls Spec

Status: accepted direction for `frappe-ui` v1 planning.

This document defines the v1 API direction for **Frappe-integrated controls** —
molecules (per `CONTEXT.md`) that compose atom-level inputs and depend on Frappe
Desk backend endpoints (search, resource fetching, etc.). They live alongside
pure-Vue components but require a Frappe app to function.

Sibling specs:

- [`08-selection-and-menu-api-spec.md`](./08-selection-and-menu-api-spec.md) —
  selection-family atoms (`Select`, `MultiSelect`, `Combobox`, `Dropdown`)
- [`09-input-components-spec.md`](./09-input-components-spec.md) — input-family
  atoms (`TextInput`, `Textarea`, etc.)

## Scope

Components governed by this spec:

- `Link` — single-record picker for a Frappe doctype

Future entries (e.g. `MultiLink`, doctype-specialized pickers) will be added
here.

## P5 conformance

All controls in this spec accept the shared P5 labeling contract — `label`,
`description`, `error`, `required` — with the semantics defined in
[`09-input-components-spec.md`](./09-input-components-spec.md). They forward
these props (and the four matching labeling slots: `#label`, `#description`)
through to their underlying atom so the rendered DOM, ARIA wiring, and styling
hooks are identical to a standalone atom of the same family.

## Components

### `Link`

A single-select picker for a Frappe doctype record. Composes `Combobox` and
fetches options internally from `frappe.desk.search.search_link`.

#### Types

```ts
interface LinkProps extends InputLabelingProps {
  doctype: string
  filters?: Record<string, unknown>
  creatable?: boolean
  disabled?: boolean
}

interface LinkEmits {
  'update:modelValue': [value: string | null]
  'update:open': [value: boolean]
  create: [query: string]
}
```

The pre-existing `filters` shape — `Record<string, unknown> | Array<unknown> | string` — is narrowed to the dict form only at v1. Frappe's `search_link` endpoint accepts list-form and SQL-string filters too, but exposing all three at the component boundary leaks backend serialization into the public API (P3) and offers no expressive power the dict form lacks. No deprecation alias: `Link` is not present in any published release of `frappe-ui`, so the freeze rules in P13 do not apply.

#### Defaults

- `filters = {}`
- `creatable = false`
- `disabled = false`

#### Model

- `v-model`: `string | null` — the selected record's primary key, or `null`
  when empty.
- `v-model:open`: `boolean` — the popover visibility, forwarded straight to
  the underlying `Combobox`. Default `false`. Follows the canonical `open`
  vocabulary defined in `CONTEXT.md`.
- Clearing the picker (via the default clear button or programmatically) sets
  the primary `modelValue` to `null`. The empty state is `null`, never the
  empty string.

#### Default clear behavior

When `modelValue` is non-null **and** `required` is `false`, `Link` renders a
clear button in the suffix region. Clicking it sets `modelValue` to `null`.

- No prop controls this — it is the default behavior.
- `required: true` suppresses the clear button (the field cannot legitimately
  be empty).
- The clear button is exposed as `data-slot="clear"` for styling.

#### `creatable` behavior

When `creatable: true`, `Link` injects a `type: 'custom'` row at the bottom of
the popover with `condition: ({ query }) => Boolean(query)` — visible only when
the user has typed. Clicking the row:

1. closes the popover (Combobox's default for custom rows)
2. emits `@create` with the typed query string

The consumer's `@create` handler owns the create flow (typically opening a
create dialog). To assign the freshly-created record back to the picker, the
consumer sets `v-model` to the new record's primary key.

`creatable` does **not** change the value type or the emit shape — `modelValue`
remains `string | null`, and `@create` is a sibling event that does not affect
the model. The prop is a deliberate departure from P8's split-on-affordance
rule, recorded in
[`adr/0004-link-creatable-as-single-component.md`](./adr/0004-link-creatable-as-single-component.md).

#### P5 conformance

Accepts `label`, `description`, `error`, `required` with the semantics defined
in [`09-input-components-spec.md`](./09-input-components-spec.md). These props
are forwarded to the underlying `Combobox` so the rendered DOM, ARIA wiring
(`aria-invalid`, `aria-errormessage`, `aria-required`, `aria-describedby`), and
the InputLabel + InputError chrome are identical to a standalone `Combobox` of
the same shape.

#### Combobox passthrough

`Link` is a thin molecule over `Combobox`. Any `Combobox` prop not listed
above (e.g. `variant`, `size`, `placeholder`, `side`, `align`, `offset`,
`portalTo`, `openOnFocus`, `openOnClick`) falls through via `v-bind="$attrs"`
with `inheritAttrs: false`. `options` and `loading` are owned by `Link` (it
fetches its own options) and cannot be overridden by the consumer.

#### Slots

Forwards every `Combobox` slot unchanged: `#label`, `#description`, `#prefix`,
`#trigger`, `#item`, `#item-prefix`, `#item-label`, `#item-suffix`, `#empty`,
`#footer`.

By default, `Link` renders a clear button in `#suffix` when `modelValue` is
non-null and `required: false`. Overriding `#suffix` replaces the clear button
entirely — render your own clear inside the slot if the consumer still needs
one.

#### Styling hooks (P10)

- `data-slot="link"` on the root
- inherits `Combobox`'s `data-slot`, `data-state`, `data-variant`, `data-size`
  taxonomy on the rendered DOM
- `data-slot="clear"` on the default clear button

#### Imperative API

```ts
interface LinkExposed {
  reload: () => void
}
```

- `reload()` re-fetches the doctype options with an empty query. Useful after
  the consumer's create flow completes successfully.
