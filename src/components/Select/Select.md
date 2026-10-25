# Select

A button that opens a list of options and picks one. For a searchable list, use
[Combobox](./combobox), and to pick several values, use
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

When nothing is selected, the value is `null`, the same as in `Combobox`. An
empty string is a real value, so a "None" option with `value: ''` round-trips.

For a "Sort by" menu, add a first option with `value: ''` and
`disabled: true`. It shows as the label while nothing else is picked, and
people cannot select it.

### Width

`Select` sizes itself to fit its options. The trigger fits the selected value,
and the menu grows to fit longer options. Add `class="w-full"` for a
full-width trigger.

### Item slots

`#item-prefix`, `#item-label` and `#item-suffix` change parts of the standard
row. `#item` replaces the whole row, including its outer element.

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

### Label, description and error

`label` renders above the trigger and `description` below it. `error` renders
below the trigger and hides `description`. It takes a string, an array of
strings (one line each), or an `Error`, the same values as
[ErrorMessage](./errormessage). An empty string or an empty array means no
error. `required` adds a red asterisk to the label.

The `#label` slot replaces the label text and the required marker, and receives
`{ required }`. A `#description` slot is not hidden by `error`. It renders
above the error.

## Accessibility

While `error` is set, the trigger gets `aria-invalid` and an
`aria-errormessage` that points to the error text.

<!-- @include: ./Select.api.md -->
