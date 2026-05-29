---
pageClass: migration-page
---

# Migration from v0

A guide for moving an existing app onto `frappe-ui` v1. Work through one
component family at a time. Each section opens with a before/after table.
For the full change list see the
[changelog](https://github.com/frappe/frappe-ui/blob/main/v1-release/changelog.md);
for the rationale behind each API see the
[v1 release specs](https://github.com/frappe/frappe-ui/tree/main/v1-release).

After each pass, `grep` for the old prop or slot name to catch anything
missed, then test the flows you touched. Type-checking won't catch focus,
slot renames, or visual regressions.

## Dialog

The `options` blob is flattened into top-level props. See the
[Dialog](./components/dialog) component page for the full API.

| Before                                 | After                            |
| -------------------------------------- | -------------------------------- |
| `v-model="show"`                       | `v-model:open="show"`            |
| `:options="{ title, size, actions }"`  | `title` / `size` / `:actions`    |
| `disableOutsideClickToClose`           | `:dismissible="false"`           |
| `<template #body-content>`             | default slot                     |
| `<template #body-title>`               | `<template #title>`              |
| `<template #body>`                     | `bare` prop + default slot       |
| `onClick: (close) => …`                | `onClick: ({ close }) => …`      |
| manual focus hacks / `v-focus`         | `autofocus` attr on a descendant |

```vue
<!-- Before -->
<Dialog :options="{ title: 'Edit Item' }" v-model="show">
  <template #body-content>
    <FormControl label="Name" v-model="item.name" />
  </template>
  <template #actions>
    <Button variant="solid" @click="save">Save</Button>
  </template>
</Dialog>

<!-- After -->
<Dialog title="Edit Item" v-model:open="show">
  <FormControl label="Name" v-model="item.name" />
  <template #actions>
    <Button variant="solid" @click="save">Save</Button>
  </template>
</Dialog>
```

For reactive `:options` objects, spread them: `<Dialog v-bind="opts || {}" />`.
For the imperative API, use `dialog.confirm` / `dialog.danger` /
`dialog.prompt` from `frappe-ui` (callback-based: `onConfirm` resolves to
close, throws to stay open) and wrap your app root in `<FrappeUIProvider>`.

## DatePicker / TimePicker family

Covers `DatePicker`, `DateRangePicker`, `DateTimePicker`, and `TimePicker`.
They share the popover-trigger vocabulary.

| Before                          | After                            |
| ------------------------------- | -------------------------------- |
| `:value` prop                   | `v-model`                        |
| `@change`                       | `@update:modelValue`             |
| `placement="bottom-start"`      | `side` + `align` + `offset`      |
| `:autoClose`                    | `:keepOpen` (inverted)           |
| `allowCustom` / `readonly`      | `typeable`                       |
| `minDate`/`maxDate`/`minTime`/`maxTime` | `min` / `max`            |
| `#target`                       | `#trigger`                       |

Behavior changes that apply even if you don't touch your code:

- `DateRangePicker` emits a `[from, to]` tuple. Update handlers that called
  `.split(',')` on the value.
- `DateTimePicker` no longer auto-closes on date click. Close from
  `@update:modelValue` or add an `#actions` Apply button.
- The popover footer and auto Clear button were removed. Render an explicit
  Clear inside `#actions` if you relied on it.
- `DateRangePicker.clearable` now defaults to `true`. Pass `:clearable="false"`
  to opt out.

## Selection family (Dropdown / Select / Combobox / MultiSelect)

| Before                          | After                            |
| ------------------------------- | -------------------------------- |
| Dropdown `{ group, items }`     | `{ group, options }`             |
| Select `#item-*` slot prop `option` | slot prop `item`             |
| chevron / trailing content      | `#suffix` slot (replaces chevron)|
| Combobox `createOption`         | `type: 'custom'` option + `condition` |

For the deprecated `Autocomplete`, see
[Autocomplete (deprecated)](#autocomplete-deprecated).

## Inputs

Covers `TextInput`, `Textarea`, `Password`, `Checkbox`, `Switch`, `Rating`,
`Slider`. All share the labeling contract (`label` / `description` / `error`
/ `required`).

| Before                          | After                            |
| ------------------------------- | -------------------------------- |
| `Rating` `:rating_from`         | `:max`                           |
| `Switch` `@change`              | `@update:modelValue`             |
| `Switch.labelClasses` / `Checkbox.padding` | `data-*` styling hooks|
| `Password` `:value` + `@input` workaround | `v-model` (now works)  |

`Slider` no longer hardcodes `aria-label="Volume"`. Pass `label` explicitly
so the control is announced correctly.

The legacy `Input` component is deprecated. Use
[`TextInput`](./components/textinput) for text-like modes, or `Textarea` /
`Select` / `Checkbox` for the other type modes it accepted.

## Divider

| Before                  | After                   |
| ----------------------- | ----------------------- |
| `action.handler`        | `action.onClick`        |

## Icons

Replace `FeatherIcon` and Feather-name strings with `lucide-*` strings or a
`Component`:

```vue
<!-- Before -->        <Button icon="plus" />
<!-- After -->         <Button icon="lucide-plus" />
```

Same for icon-name strings in `Dropdown` options:

```js
// Before
const options = [{ label: 'Edit', icon: 'edit' }]

// After
const options = [{ label: 'Edit', icon: 'lucide-pen' }]
```

## Autocomplete (deprecated)

`Autocomplete` still ships (with a one-time dev `console.warn`) but will be
removed in a future major release. It merged single- and multi-select via the
`multiple` boolean; v1 splits them: [`Combobox`](./components/combobox) for
single, [`MultiSelect`](./components/multiselect) for multiple.

The model value changes shape. `Autocomplete` took and emitted the full
option object; the new components model the value only. `Combobox` is
`string | null` and `MultiSelect` is `string[]`. To read the full option,
listen to `Combobox`'s `@update:selected-option`.

| Before (`Autocomplete`)         | After                                   |
| ------------------------------- | --------------------------------------- |
| `:multiple="false"` (default)   | use `Combobox`                          |
| `:multiple="true"`              | use `MultiSelect`                        |
| `v-model` (option or value)     | `v-model` (value / value array)         |
| `@change`                       | `@update:modelValue`                    |
| grouped `{ group, items }`      | grouped `{ group, options }`            |
| `placement` (string)            | `side` + `align`                        |
| `:showFooter`                   | `#footer` slot (MultiSelect has built-in)|
| `:bodyClasses`                  | `data-slot` CSS                         |
| `:maxOptions`                   | no equivalent                           |
| `#target`                       | `#trigger`                              |
| `#prefix` / `#suffix` / `#item-*`| same (`#suffix` now replaces chevron)  |

```vue
<!-- Before -->
<Autocomplete v-model="country" :options="countries" @change="onChange" />
<!-- country === { label: 'India', value: 'in' } -->

<!-- After -->
<Combobox v-model="country" :options="countries" @update:model-value="onChange" />
<!-- country === 'in' -->
```

Sweep your codebase:

```bash
grep -rln '<Autocomplete\b' src --include='*.vue'   # find usages
grep -rln ':multiple' src --include='*.vue'         # these become MultiSelect
```

`FormControl` itself is not deprecated, but its `type="autocomplete"` value
is. Switch to `type="combobox"`, or use the standalone
[`Combobox`](./components/combobox).

## FAQ

**Will my CSS break?** Where structure changed, components expose `data-*`
hooks (`data-slot`, `data-state`, `data-size`, `data-variant`). Audit
selectors that targeted tags or classes.

**Report bugs:** [file an issue](https://github.com/frappe/frappe-ui/issues/new)
with the `v1-beta` label. Include the component name, before/after code,
version, and a repro.
