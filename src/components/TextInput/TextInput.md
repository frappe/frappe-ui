# TextInput

A single-line field for text, numbers, email addresses and other short values.
For several lines of text, use [Textarea](./textarea), and for a password, use
[Password](./password).

<ComponentPlayground name="TextInput" />

## Examples

### Search box

The `#prefix` slot puts an icon inside the field, before the text.

<ComponentPreview name="TextInput-Search" />

### Price field

`type="number"` with the `.number` modifier, so the model holds a number. The
`#suffix` slot shows the currency after the value.

<ComponentPreview name="TextInput-Price" />

### Sign-up email

`label`, `description`, `required` and `error` on one field. The error is set
from a `@blur` listener, which lands on the `<input>`.

<ComponentPreview name="TextInput-EmailField" />

### Custom label

The `#label` slot replaces the label text and the required marker. It receives
`{ required }`. The `#description` slot replaces the description text.

<ComponentPreview name="TextInput-Slots" />

## Behavior

### Label, description and error

`label` renders above the field and `description` below it. `error` renders
below the field and hides `description`. It takes a string, an array of strings
(one line each), or an `Error`, the same values as
[ErrorMessage](./errormessage). An empty string or an empty array means no
error. `required` adds a red asterisk to the label and sets `required` on the
`<input>`.

A `#description` slot is not hidden by `error`. It renders above the error.

### Attributes

`class` and `style` go on the outer element: the wrapper when a label,
description or error shows, and the field box otherwise. Every other attribute
and listener goes on the `<input>`, including `name`, `autocomplete`, `aria-*`
and `@blur`. The `<input>` has `autocomplete="off"` unless you pass your own
`autocomplete`.

### Numbers come back as strings

`modelValue` accepts `string | number`, and the component always emits a
`string`. That is what the browser gives it: `input.value` is a string whatever
the `type` is. Add Vue's `.number` modifier when you want a number back.

```vue
<!-- price is a string: "42" -->
<TextInput type="number" v-model="price" />

<!-- price is a number: 42 -->
<TextInput type="number" v-model.number="price" />
```

An empty field with `.number` gives `''`, not `0`, so check for it before you
do arithmetic.

### Dates and times

`type="date"`, `"time"` and `"datetime-local"` show the browser's own picker.
For the library's pickers, use [DatePicker](./datepicker) and
[TimePicker](./timepicker).

### Debounce

`debounce` delays `update:modelValue` by that many milliseconds after the last
keystroke. Use it when each change starts a request, such as a search.

## Accessibility

- The `<label>` is linked to the `<input>`, so screen readers announce it as
  the field's name. Pass `aria-label` when there is no visible label, as in the
  search box above.
- The description and the error are linked with `aria-describedby`.
- With `error`, the `<input>` gets `aria-invalid="true"` and
  `aria-errormessage`.
- With `required`, the `<input>` gets `aria-required="true"`, and the label
  includes hidden "(required)" text. The asterisk itself is hidden from screen
  readers.

## Migrating from v0

| Before                 | After                                   |
| ---------------------- | --------------------------------------- |
| `<Input>` (removed)    | `TextInput`, or `FormControl`           |
| `size="xl"`            | `size="lg"`                             |
| template ref `.el`     | `.focus()`, or `.inputElement`          |

See the [migration guide](../migration#inputs) for details.

<!-- @include: ./TextInput.api.md -->
