# Select

A button that opens a list of options and picks one. For a searchable list, use
[Combobox](./combobox). To pick several values, use
[MultiSelect](./multiselect).

<ComponentPlayground name="Select" />

## Examples

### Dessert menu

`#item-prefix` and `#item-label` fill the standard row with a photo and a
second line of text. `#prefix` shows the selected option's photo on the
trigger.

<ComponentPreview name="Select-OptionSlot" />

### Inline in a sentence

`#trigger` replaces the whole trigger, so the choice reads as part of the
sentence.

<ComponentPreview name="Select-CustomTrigger" />

### Timezone picker

The `#footer` slot sits below the options and stays in place while the list
scrolls.

<ComponentPreview name="Select-Footer" layout="stacked" />

## Behavior

### Options

`Select` takes a flat list of options. It has no groups. Empty and nullish
options are left out. Option values are `string | number`. An option with
`disabled: true` shows in the list but cannot be picked.

### Empty value

When nothing is selected, the value is `null`, the same as in `Combobox`.
`Select` emitted `undefined` before 1.0.0. An empty string is a real value, so
a "None" option with `value: ''` round-trips.

For a "Sort by" menu, add a first option with `value: ''` and
`disabled: true`. It shows as the label while nothing else is picked, and
people cannot select it.

### Width

`Select` sizes itself to fit its options. The trigger fits the selected value,
and the menu grows to fit longer options. Add `class="w-full"` for a
full-width trigger.

### Item slots

`#item-prefix`, `#item-label` and `#item-suffix` change parts of the standard
row. `#item`
replaces the whole row, including its outer element.

### Trigger slots

`#trigger` replaces the trigger content. For smaller changes, `#prefix` and
`#suffix` sit inside the default trigger. `#suffix` replaces the chevron.

`#trigger`, `#prefix`, `#suffix` and `#footer` all receive
`{ open, disabled, selectedOption, clear, setOpen, close }`. `close()` is the
same as `setOpen(false)`.

### Open state

Use `v-model:open` when a parent component controls the menu. Inside
`#trigger` or `#footer`, use the `setOpen` slot prop.

### Menu placement

By default the menu opens over the trigger, lined up with the selected option.
Pass `side`, `align` or `offset` to place it next to the trigger instead.
`portalTo` changes where the menu is teleported in both modes.

### Labels

`Select` takes `label`, `description`, `error` and `required` directly, so it
needs no `FormControl` around it. While `error` is set, it shows in place of
the description.

## Accessibility

While `error` is set, the trigger gets `aria-invalid` and an
`aria-errormessage` that points to the error text.

## Migrating from v0

The v0 `displayValue` trigger slot prop is now `selectedOption.label`. The
empty value changed from `undefined` to `null`, which does not fail at build
time. Option values can no longer be `bigint` or objects. See the
[migration guide](/docs/migration#select) for the full list.

<!-- @include: ./Select.api.md -->
