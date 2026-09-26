# FormControl

One component that renders any form field from its `type` prop, with the same
`label`, `description`, `error` and `required` props for every type. When you
need a field's full set of props and slots, or its exact value type, use that
component directly.

<ComponentPlayground name="FormControl" />

## Examples

### Create-account form

Most `type` values in one form. Submit it empty to see each field's `error`.

<ComponentPreview name="FormControl-RealForm" layout="stacked" />

### Settings form from a field list

One `FormControl` in a `v-for` renders a list of field definitions, whatever
their types. This is the main reason to use it over the individual components.

<ComponentPreview name="FormControl-FieldList" />

## Behavior

### Supported types

| `type`            | Renders                                                       |
| ----------------- | ------------------------------------------------------------- |
| `text` _(default)_, `email`, `password`, `number`, `search`, `tel`, `url`, `file`, `range`, `month`, `week`, `datetime-local` | [`TextInput`](./textinput) with the matching HTML `type`      |
| `textarea`        | [`Textarea`](./textarea)                                      |
| `select`          | [`Select`](./select)                                          |
| `combobox`        | [`Combobox`](./combobox)                                      |
| `multiselect`     | [`MultiSelect`](./multiselect)                                |
| `checkbox`        | [`Checkbox`](./checkbox)                                      |
| `date`            | [`DatePicker`](./datepicker#date-picker)                      |
| `daterange`       | [`DateRangePicker`](./datepicker#date-range-picker)           |
| `datetime`        | [`DateTimePicker`](./datepicker#datetime-picker)              |
| `time`            | [`TimePicker`](./timepicker)                                  |

For the browser's native date or time input, use `<TextInput type="date" />`,
or `type="datetime-local"` here.

### Label, description and error

`FormControl` passes `label`, `description`, `error` and `required` to the
component it renders, and that component draws them. `error` replaces the
description and marks the field invalid.

```vue
<FormControl
  v-model="email"
  type="email"
  label="Email"
  description="We'll never share your email."
  :error="errors.email"
  required
/>
```

### Props, slots and attributes

- **Props and listeners.** `placeholder`, `disabled`, `modelValue`, `options`,
  `min`/`max`, `formatter` and the rest go to the rendered component.
  `FormControl` does not declare them itself.
- **Slots.** Every slot you pass goes through by name. The slots you can use
  depend on `type`: `#prefix` and `#suffix` for `TextInput` and the pickers,
  `#item-prefix` and `#item-label` for `Select` and `Combobox`, and so on. See
  each component's page.
- **`class` and `style`.** They go to the rendered component, which places
  them on its outer element.

`size` and `variant` go to every type, with two exceptions for
`type="checkbox"`. A checkbox draws no box, so it does not get `variant`. Its
size scale ends at `md`, so `size="lg"` renders as `md`.

The `select`, `combobox`, `multiselect` and picker types fill the width of
their container.

### Value types

`FormControl` does not check type-specific props or the `v-model` type for
each `type`. The value follows the rendered component: `multiselect` emits an
array, `checkbox` a boolean, `daterange` the value `DateRangePicker` emits, and
so on.

<!-- @include: ./FormControl.api.md -->
