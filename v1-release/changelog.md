# Frappe UI v1 Changelog

This file tracks user-facing v1 changes as they land. Entries under
**Unreleased** describe changes since the latest published version (currently
**v0.1.278**).

Keep entries focused on:

- breaking changes
- deprecations
- behavior changes users will notice
- migration guidance

Do not log internal refactors, test additions, or planning/doc maintenance
unless they affect consumers.

## Unreleased

### Input family — shared labeling contract

Every input that has a labelable role now accepts the same four props:
`label`, `description`, `error`, `required`. The id is auto-generated, the
`<label for>`, `aria-describedby`, `aria-errormessage`, `aria-invalid`, and
`aria-required` wiring is set up automatically. `error` accepts `string` or
`Error` (with `Error.messages` rendered as stacked plain text).

Applied to: `TextInput`, `Textarea`, `Password`, `Checkbox`, `Switch`,
`Rating`, `Slider`. Existing call sites continue to work unchanged.

### Input family — `data-*` styling hooks

Every input shell now renders the canonical `data-*` vocabulary so external
CSS can target inputs without class-injection props:

- `data-slot` (e.g. `"label"`, `"control"`, `"description"`, `"error"`)
- `data-size`, `data-variant` (where applicable)
- `data-state` (`"valid" | "invalid" | "checked" | "unchecked" | …`)
- `data-disabled`, `data-required`

### Password — `v-model` fix and explicit props

`Password` now uses `defineModel<string>()`. This fixes the existing bug
where `<Password v-model>` did not update from typing. Explicit `size`,
`variant`, `disabled`, `placeholder`, `id`, and `required` props were added
in place of routing through `$attrs`. The `value` prop alias is deprecated.

### Rating — `max` replaces `rating_from`

`rating_from` is renamed to `max` (default `5`). The old name continues to
work as a deprecated alias. `Rating` no longer imports `FeatherIcon`; the
default star icon comes from `lucide-star` via the shared Tailwind plugin.
Filled stars now render visibly when bound to a non-zero value.

### Slider — additive props and a11y fix

- `disabled` prop added.
- `size: 'sm' | 'md'` prop added; `'md'` increases track and thumb
  proportionally.
- New `value-commit` emit fires when the user finishes dragging (use this
  for side-effects you don't want on every step).
- Removed the hardcoded `aria-label="Volume"`. Labeling now flows through
  the shared labeling contract; if no `label` is provided, no `aria-label`
  is set and consumers should pass one explicitly. Treated as a bug fix —
  every non-volume call site was previously announced as "Volume" by
  assistive tech.
- Visibility fixes: visible track in collapsed wrappers, full-width slider
  by default, no narrow min-width floor.
- Uncontrolled `Slider` initializes to `min` instead of rendering with no
  thumb.

### Switch — Lucide icons; deprecations

`Switch` no longer imports `FeatherIcon`. Its `icon` prop is now typed
`string | Component`; `lucide-*` strings route through the shared Tailwind
plugin. The `labelClasses` prop and `change` emit are deprecated (still
functional in v1.x). Row hover/active background removed.

### Checkbox — `padding` deprecated

`Checkbox.padding` is deprecated in favor of `data-*` styling hooks. Still
functional in v1.x.

### Textarea — `ghost` variant; `required` prop

`Textarea` now accepts the `'ghost'` variant (matching `TextInput` and
`Password`) and the shared `required` prop.

### Legacy components — dev-mode warnings

The following emit a one-time dev-mode warning when used:

- `Input.vue` → use `TextInput`
- `Autocomplete` → use `Combobox` or `MultiSelect`
- `FormControl type='autocomplete'` → use `Combobox` standalone

The legacy components and the `type='autocomplete'` route continue to
function in v1.x.

### Dropdown — group field standardized on `options`

`Dropdown`'s grouped-entry field is now `options`, matching `Combobox`,
`MultiSelect`, and `Select`. The old `{ group, items }` shape continues to
work as a deprecated alias; a dev warning fires if both are provided on
the same group entry.

```ts
// before
{ group: 'Edit', items: [{ label: 'Rename', onClick: rename }] }
// after
{ group: 'Edit', options: [{ label: 'Rename', onClick: rename }] }
```

### Combobox — trigger sizing matches Select

Combobox's root element now renders as a transparent layout box so the
trigger sizes the same as `Select` in flex/grid containers. Decoupled query
from model in button mode.

### InputLabel — slot polish

The default required indicator is no longer rendered when the `#label`
slot is used (consumers receive `{ required }` in the slot props and can
render their own indicator). The labeling wrapper is dropped entirely when
there is nothing to label.

### Divider — `action.onClick` preferred

`Divider.action.handler` is deprecated in favor of `Divider.action.onClick`.
The deprecation warning is now emitted via the shared `warnDeprecated`
utility (consistent with the rest of the input family). Action mode now
preserves separator semantics for assistive technologies.

### Breaking

- None.

### Deprecated

- `Divider.action.handler` → `Divider.action.onClick`
- `Password.value` prop → `v-model` / `modelValue`
- `Rating.rating_from` prop → `max`
- `Switch.change` emit → `update:modelValue` / `v-model`
- `Switch.labelClasses` prop → `data-*` styling hooks
- `Checkbox.padding` prop → `data-*` styling hooks
- `Dropdown` `{ group, items }` group entries → `{ group, options }`
- `Input.vue` → `TextInput`
- `Autocomplete` → `Combobox` or `MultiSelect`
- `FormControl type='autocomplete'` → `Combobox` standalone

All deprecations preserve backwards compatibility in v1.x and emit a
one-time dev-mode warning. Removal is post-v1.

### Migration notes

- `Password`: rebind to `v-model`; the `value` prop is deprecated.
- `Rating`: rename `rating_from` to `max`.
- `Switch`: replace `@change` with `@update:modelValue` (or `v-model`);
  move `labelClasses` styling into a wrapper or use `data-*` hooks.
- `Checkbox`: move `padding` styling into a wrapper or use `data-*` hooks.
- `Dropdown`: rename group entries from `{ group, items }` to
  `{ group, options }`.
- `Divider`: replace `action.handler` with `action.onClick`.
- `Input.vue` consumers: migrate to `TextInput`.
- `Autocomplete` consumers: migrate to `Combobox` (single-select) or
  `MultiSelect` (multi-select).
- `FormControl type='autocomplete'` consumers: switch to `Combobox`
  standalone.

## Deprecation log

| API                                | Status     | Replacement                          | Notes                                  |
| ---------------------------------- | ---------- | ------------------------------------ | -------------------------------------- |
| `Divider.action.handler`           | Deprecated | `Divider.action.onClick`             | Warning fires when set                 |
| `Password.value` prop              | Deprecated | `v-model` / `modelValue`             | Warning fires when set                 |
| `Rating.rating_from` prop          | Deprecated | `max`                                | Silent alias; warning fires when set   |
| `Switch.change` emit               | Deprecated | `update:modelValue` / `v-model`      | Warning fires when bound               |
| `Switch.labelClasses` prop         | Deprecated | `data-*` styling hooks               | Warning fires when set                 |
| `Checkbox.padding` prop            | Deprecated | `data-*` styling hooks               | Warning fires when set                 |
| `Dropdown` `{ group, items }`      | Deprecated | `{ group, options }`                 | Silent alias; warning fires if both    |
| `Input.vue`                        | Deprecated | `TextInput`                          | Warning on mount                       |
| `Autocomplete`                     | Deprecated | `Combobox` or `MultiSelect`          | Warning on mount                       |
| `FormControl type='autocomplete'`  | Deprecated | `Combobox` standalone                | Warning when type is set               |
