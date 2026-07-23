# FormControl

A uniform wrapper for form inputs. `FormControl` picks an underlying control from its `type` prop and threads `label`, `description`, `error`, `required`, `size`, and `variant` down to it. Use it when you want one consistent shape for every field in a form.

## Playground

<ComponentPlayground name="FormControl" />

## Example

A create-account form using every control type.

<ComponentPreview name="FormControl-RealForm" layout="stacked" />

## Supported types

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

> **Breaking change in v1:** `type="date"` and `type="time"` used to render native HTML inputs through `TextInput`. They now resolve to `DatePicker` and `TimePicker`. Use `TextInput` directly (or `type="datetime-local"`) if you need the native input.

> `type="autocomplete"` is deprecated. See [Legacy components](./legacy#formcontrol-with-type-autocomplete).

## Labeling and errors

`label`, `description`, `error`, and `required` are forwarded to the underlying control, which owns the rendered label, helper text, and error message. Setting `error` flips `aria-invalid` on the control and swaps the description for the error message.

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

## Forwarding

Everything else is forwarded generically:

- **Props and listeners** — `placeholder`, `disabled`, `modelValue`, `options`, `min`/`max`, `formatter`, etc. land on the resolved component. `FormControl` does not redeclare control-specific props.
- **Slots** — every slot you pass is forwarded by name. Which slots are available depends on `type` (`#prefix` / `#suffix` for `TextInput` and the pickers, `#item-prefix` / `#item-label` for `Select` and `Combobox`, and so on — see the target component's docs).

Because forwarding is generic, `FormControl` does not type-check control-specific props or the `v-model` shape per `type`. The value shape follows the underlying component — `daterange` emits a tuple string from `DateRangePicker`, `multiselect` emits an array, `checkbox` emits a boolean, and so on. When the prop surface starts to drive your decision, reach for the underlying component directly.

## When to reach past it

- **Use `FormControl`** when the goal is a consistent stack of labelled fields and you want one API to remember.
- **Use the underlying component** when you need its specific layout (custom triggers, complex slots) or its full typed surface.

<!-- @include: ./FormControl.api.md -->
