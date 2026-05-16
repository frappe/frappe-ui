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

### Dialog — v1 spec implemented

- Flat top-level props (`title`, `message`, `icon`, `size`, `position`,
  `paddingTop`, `actions`) are now canonical; the legacy `options` blob
  still works but warns once per instance.
- `v-model:open` is canonical; `v-model` (bound to `modelValue`) still
  works without a warning.
- New behavior props: `dismissable` (default `true`, replaces
  `disableOutsideClickToClose`), `bare` (suppresses chrome), and
  `showCloseButton` (default `true`, independent of the auto-header).
- New canonical slots: `#default`, `#title`, `#actions` (scoped with
  `{ close, actions }`). Legacy slots `#body`, `#body-main`,
  `#body-header`, `#body-title`, `#body-content` keep working and emit
  deprecation warnings.
- `icon.theme` (`yellow | blue | red | green`) replaces
  `icon.appearance`; the legacy form is auto-mapped and warns.
- Auto-header no longer renders an "Untitled" fallback when no title /
  `#title` is provided.

### Dialog — imperative `dialog.*` API

- New Promise-based helpers: `dialog.confirm()`, `dialog.alert()`,
  `dialog.prompt()`. Each resolves on click and exposes `close()` so the
  caller controls when the dialog actually closes; the action button
  shows a loading state from click until `close()`.
- `<FrappeUIProvider>` now renders `<Dialogs />` next to `<Toasts />`, so
  apps that already wrap with the provider get the imperative dialog
  stack for free — no separate plugin, no `createApp` / `_context`
  shim. The `<Dialogs />` component is still exported for callers who
  don't use the provider.
- Legacy `confirmDialog()` keeps working and now emits a deprecation
  warning pointing at `dialog.confirm()`.

### DatePicker family — v1 spec implemented

`DatePicker`, `DateRangePicker`, and `DateTimePicker` now share the v1
popover-trigger vocabulary used by the selection family
(`Combobox`/`Dropdown`/`Select`).

- Positioning: `side` (`top | right | bottom | left`, default `'bottom'`)
  + `align` (`start | center | end`, default `'start'`) + `offset`
  (default `4`) replace the compound `placement` string. `placement`
  remains as a deprecated alias and is mapped internally.
- `keepOpen: boolean` (default `false`) replaces `autoClose: boolean`
  (default `true`). Semantics are inverted; the old prop is mapped
  internally and warns once per instance.
- `typeable: boolean` (default `true`) replaces the previous overload
  between picker-level `readonly` and `allowCustom`. Setting
  `:typeable="false"` prevents typing while keeping the popover
  interactive. Picker-level `readonly` and `allowCustom` are deprecated
  and continue to function via internal mapping.
- New constraint props on all three pickers:
  `minDate?: string` and `maxDate?: string` (both `YYYY-MM-DD`), and
  `isDateUnavailable?: (date: Dayjs) => boolean` for arbitrary
  disabling (weekends, holidays, business rules). Min/max and the
  predicate compose — a date is disabled if any check rejects it.
- `v-model:open` is now supported on all three pickers via the
  `open` prop + `update:open` emit.
- New `openOnFocus` (default `false`) and `openOnClick` (default
  `true`) props let consumers opt out of either trigger path. The
  same defaults are now applied to `Combobox` for parity.
- `#trigger` is the canonical slot for a custom trigger renderer;
  `#target` is kept as a deprecated alias.
- `DateRangePicker` `clearable` now defaults to `true` and the
  footer is hidden entirely when there is no value to clear,
  matching `DatePicker`. Live hover preview while picking the end
  date and a stable trigger width derived from `format` were added
  in the same pass.
- Public type surface: `DateTimePickerProps`, `DateRangePickerEmits`,
  `DateTimePickerEmits`, and `DateRangeValue` are now exported from
  the public entrypoint. `defineSlots`/`defineExpose({ open })` are
  consistent across all three components.
- Internal: a shared `CalendarPanel` and a `PickerShell` wrapper now
  drive all four pickers (including `TimePicker`); no consumer-visible
  behavior change beyond the unified open/close animation.

### DatePicker family — `DateRangePicker` emit shape (breaking)

`DateRangePicker` now emits `update:modelValue` and `change` as a
`[from, to]` tuple (`DateRangeValue = [string, string] | []`) instead
of a comma-joined `"YYYY-MM-DD,YYYY-MM-DD"` string. The `modelValue`
prop already accepted `string[]`; the emit shape is what changes.

```ts
// before — v0
function onChange(v: string) {
  const [from, to] = v.split(',')
}

// after — v1
function onChange(v: DateRangeValue) {
  const [from, to] = v // tuple, or [] when cleared
}
```

`v-model`-bound call sites that previously stored a comma-joined
string need to migrate to an array. Reactive forms that pass the
value through unchanged are unaffected.

### TimePicker — v1 refresh

`TimePicker` adopts the same vocabulary as the DatePicker family
and gains a flexible parser.

- `side` / `align` / `offset` replace `placement` (deprecated alias).
- `keepOpen` (default `false`) replaces `autoClose` (deprecated
  alias, inverse semantics).
- `typeable` (default `true`) replaces picker-level `readonly` and
  `allowCustom` (both deprecated).
- `v-model:open` parity via `open` prop + `update:open` emit; new
  `openOnFocus` (default `false`) and `openOnClick` (default `true`)
  props.
- Flexible typed input: `"3pm"`, `"3.30pm"`, `"1500"`,
  `"9:30:15 am"` parse to the canonical `HH:mm[:ss]` shape.
- Open/close animation matches `DatePicker`.
- `scrollMode` is deprecated; the list is always centered on the
  selected option.

### DatePicker family — legacy composable and utils deprecated

`useDatePicker` and the helpers it depends on (`getDate`,
`getDatesAfter`, `getDaysInMonth`, `isLeapYear`) were not used by any
of the picker components and are not part of the v1 API. They remain
exported through v1.x and emit a one-time dev-mode warning. New code
should use the components directly.

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

### FeatherIcon — deprecated; `lucide-*` recommended

`FeatherIcon` remains exported. Existing call sites — including feather-name
strings passed to `Button.icon` / `iconLeft` / `iconRight`, `Dialog.options.icon`,
`Dropdown` item icons, and `TabButtons` leading/trailing icons — continue to
render via `FeatherIcon`. Passing a feather-name string to any of these props
now emits a one-time dev-mode deprecation warning recommending the `lucide-*`
equivalent.

Recommended path for new code is the `lucide-*` icon string vocabulary,
rendered through the shared Tailwind plugin:

```vue
<!-- preferred -->
<Button icon="lucide-plus" />
<span class="lucide-search size-4" aria-hidden="true" />

<!-- still works -->
<Button icon="plus" />
```

Hardcoded internal `FeatherIcon` usages across core components
(date/time pickers, tree, calendar event modal, command palette, list filter,
circular progress, dropdown submenu chevron) were migrated to `lucide-*` in
this release. No consumer-visible behavior change.

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

- `DateRangePicker` emits `update:modelValue` / `change` as a
  `[from, to]` tuple (`DateRangeValue`) instead of a comma-joined
  string. See the DateRangePicker section above for migration.

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
- `DatePicker` / `DateRangePicker` / `DateTimePicker` / `TimePicker`:
  `placement` → `side` + `align` + `offset`
- `DatePicker` / `DateRangePicker` / `DateTimePicker` / `TimePicker`:
  `autoClose` → `keepOpen` (inverse semantics)
- `DatePicker` / `DateRangePicker` / `DateTimePicker` / `TimePicker`:
  picker-level `readonly` and `allowCustom` → `typeable: false`
- `DatePicker` / `DateRangePicker` / `DateTimePicker`: `inputClass` →
  `class` on the component element
- `DatePicker` / `DateRangePicker` / `DateTimePicker` / `TimePicker`:
  `value` prop → `v-model` / `modelValue`
- `DatePicker` / `DateRangePicker` / `DateTimePicker`: `change` emit →
  `update:modelValue` / `v-model`
- `DatePicker` / `DateRangePicker` / `DateTimePicker`: `#target` slot →
  `#trigger`
- `TimePicker.scrollMode` prop → no replacement (always centered)
- `useDatePicker` composable (and its `getDate` / `getDatesAfter` /
  `getDaysInMonth` / `isLeapYear` helpers) → use the picker
  components directly

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
- DatePicker family — positioning: replace
  `:placement="'bottom-end'"` with `:side="'bottom'" :align="'end'"`
  (and `:offset` if you were relying on a non-default gap).
- DatePicker family — `autoClose`: invert and rename. `autoClose: false`
  becomes `keepOpen: true`; the default (close after pick) is now the
  silent default and needs no prop.
- DatePicker family — `allowCustom` / picker-level `readonly`: replace
  with `:typeable="false"`. The HTML-level `readonly` attribute on the
  inner input is unchanged.
- DatePicker family — `inputClass`: drop it and put the class directly
  on the component element (`<DatePicker class="w-48" />`).
- DatePicker family — custom triggers: rename `#target` to `#trigger`.
- DatePicker family — `change` listeners: bind via `v-model` /
  `@update:modelValue` instead.
- `DateRangePicker` — emit shape: switch from
  `(v: string) => v.split(',')` to
  `(v: DateRangeValue) => v` (tuple, `[]` when cleared).
- `TimePicker.scrollMode`: drop the prop.
- `useDatePicker`: replace ad-hoc usage with `<DatePicker>` /
  `<DateRangePicker>` / `<DateTimePicker>`.

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
| DatePicker family `placement` prop | Deprecated | `side` + `align` + `offset`          | Mapped internally; warning fires       |
| DatePicker family `autoClose` prop | Deprecated | `keepOpen` (inverse)                 | Mapped internally; warning fires       |
| DatePicker family `allowCustom`    | Deprecated | `typeable: false`                    | Mapped internally; warning fires       |
| DatePicker family `readonly` prop  | Deprecated | `typeable: false`                    | Picker-level only; warning fires       |
| DatePicker family `inputClass`     | Deprecated | `class` on the component element     | Warning fires when set                 |
| DatePicker family `value` prop     | Deprecated | `v-model` / `modelValue`             | Warning fires when set                 |
| DatePicker family `change` emit    | Deprecated | `update:modelValue` / `v-model`      | Warning fires when bound               |
| DatePicker family `#target` slot   | Deprecated | `#trigger`                           | Silent alias; warning fires            |
| `TimePicker.scrollMode` prop       | Deprecated | none (always centered)               | Warning fires when set                 |
| `useDatePicker` composable         | Deprecated | use picker components directly       | Warning fires on call                  |
| `getDate` / `getDatesAfter` / etc. | Deprecated | use picker components directly       | JSDoc deprecated; no runtime warning   |
