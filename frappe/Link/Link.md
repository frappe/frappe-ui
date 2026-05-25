# Link

A single-record picker for a Frappe doctype. Composes `Combobox` and fetches its options directly from `frappe.desk.search.search_link` — pick a doctype, and the rest works.

## Simple
A bare picker. `v-model` carries the selected record's primary key (a string), or `null` when nothing is selected.

<ComponentPreview csr="true" name="Link-Simple" layout="stacked" />

## Labeling, Description, Error, Required
`Link` accepts the standard input labeling props — `label`, `description`, `error`, `required` — and forwards them to the underlying `Combobox`, so ARIA wiring (`aria-required`, `aria-invalid`, `aria-errormessage`) and the InputLabel chrome render identically to a standalone `Combobox`.

<ComponentPreview csr="true" name="Link-Labeling" />

## Filters
The `filters` prop is a `Record<string, unknown>` passed straight through to `search_link`. Frappe's underlying endpoint also accepts list-form and SQL-string filters, but the component boundary intentionally narrows to the dict form — it covers every CRM call site without leaking backend serialization into the public API. Reactive — changing `filters` triggers a refetch. The `#footer` slot is the canonical home for a filter-status row (or any non-selectable popover affordance) and renders below both the options list and the `creatable` create-new row.

<ComponentPreview csr="true" name="Link-Filters" />

## Creatable
`creatable: true` injects a "Create" row at the bottom of the popover, visible only when the user has typed. Clicking it emits `@create` with the typed query — the consumer owns the create flow (typically a dialog) and assigns the freshly-created record back to `v-model` on success. To replace the default create row markup (icon, helper text, copy), supply the `#item-create` slot — scope is `{ query }`.

<ComponentPreview csr="true" name="Link-Creatable" />

## Suffix
By default, Link renders a clear button in the suffix slot when `modelValue` is non-null and `required: false`. To replace it with your own affordance — an "Open record" link, an "Edit" button — supply `#suffix`. The slot fully takes over; if you still want a clear button alongside your action, render one yourself. To dismiss the options dropdown when your action takes over (e.g. opens a dialog), bind `v-model:open` and set it to `false`.

<ComponentPreview csr="true" name="Link-Suffix" />

## Member Picker
`Link` forwards every `Combobox` per-row slot — `#item-prefix`, `#item-label`, `#item-suffix`, `#item` — so a doctype picker can render an avatar, role, or any other contextual chrome without dropping down to `<Combobox>` directly.

<ComponentPreview csr="true" name="Link-MemberPicker" />

<!-- @include: ./Link.api.md -->
