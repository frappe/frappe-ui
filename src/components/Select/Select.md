# Select

Lets users select one option from a list. Ideal for forms, settings, or any
interface where a single choice is required.

## Playground

<ComponentPlayground name="Select" />

## Example
The trigger hugs the selected value and the menu expands outward to fit longer options. Options with `disabled: true` render but can't be picked.

<ComponentPreview name="Select-Example" />

## Custom Option Layout
Use `#item-prefix` and `#item-label` to tailor the standard row — for example, an avatar plus a two-line label with a secondary description. `#prefix` on the trigger reuses the selected option's accessory. Use `#item` when you want to replace the entire row, shell included.

<ComponentPreview name="Select-OptionSlot" />

## Custom Trigger
Use `#trigger` to replace the trigger content entirely. The slot receives `{ open, disabled, selectedOption, clear, setOpen }`. For lighter changes, `#prefix` and `#suffix` sit inside the default trigger shell — `#suffix` replaces the chevron.

<ComponentPreview name="Select-CustomTrigger" />

## Footer
The `#footer` slot renders below the option list and stays pinned to the bottom of the popover — it does not scroll with the options. It receives the same shape as `#trigger`, `#prefix`, and `#suffix`: `{ open, disabled, selectedOption, clear, setOpen }`.

<ComponentPreview name="Select-Footer" layout="stacked" />

## Label, Description, Error
`Select` supports `label`, `description`, `error`, and `required` directly — no `FormControl` wrapper needed. The error suppresses the description and wires `aria-invalid` + `aria-errormessage` onto the trigger.

<ComponentPreview name="Select-Labeling" />

## Template Ref
A template ref exposes `{ clear, focus }` — the same shape as `Combobox` and `MultiSelect`. `clear()` empties the selection; `focus()` moves focus to the trigger.

```vue
<script setup lang="ts">
import { useTemplateRef } from 'vue'

const picker = useTemplateRef('picker')

function reset() {
  picker.value?.clear()
  picker.value?.focus()
}
</script>

<template>
  <Select ref="picker" v-model="value" :options="options" />
</template>
```

## Notes

- Use `v-model:open` when a parent owns the menu state; use `setOpen` from the
  slot props when the code lives inside `#trigger` or `#footer`.
- By default, `Select` sizes itself to fit its option content. Set
  `class="w-full"` when you want a full-width trigger.
- `Select` accepts flat options only — no groups. Empty and nullish options are
  omitted. Option values are `string | number`.
- For the common "Sort by" pattern, add a first option with an empty-string
  value and `disabled: true`. It shows as the resting label without becoming
  selectable.
- The menu is placed item-aligned (anchored over the trigger) by default.
  Passing `side`, `align`, or `offset` switches it to standard popper
  placement; `portalTo` changes the teleport target either way.
- For a searchable single-choice picker, use [`Combobox`](./combobox); for
  several values, use [`MultiSelect`](./multiselect).

<!-- @include: ./Select.api.md -->
