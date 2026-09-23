# Textarea

A multi-line field for longer text, such as comments, notes and descriptions.
For a single line, use [TextInput](./textinput).

<ComponentPlayground name="Textarea" />

## Examples

### Comment box

An `outline` textarea with no label, and a button that stays disabled until
there is text. `aria-label` names the field for screen readers.

<ComponentPreview name="Textarea-CommentBox" />

### Bio with a character limit

`description` counts the characters left. Past the limit, `error` takes its
place.

<ComponentPreview name="Textarea-Bio" />

## Behavior

### Label, description and error

`label` renders above the field and `description` below it. `error` renders
below the field and hides `description`. It takes a string, an array of strings
(one line each), or an `Error`, the same values as
[ErrorMessage](./errormessage). An empty string or an empty array means no
error. `required` adds a red asterisk to the label and sets `required` on the
`<textarea>`.

The `#label` slot replaces the label text and the required marker, and receives
`{ required }`. A `#description` slot is not hidden by `error`. It renders
above the error.

### Attributes

`class` and `style` go on the outer element: the wrapper when a label,
description or error shows, and the `<textarea>` otherwise. Every other
attribute and listener goes on the `<textarea>`.

### Rows and size

`rows` sets the visible height in lines. It defaults to `3`. The textarea does
not grow as the text gets longer.

`size` changes the padding, the corner radius and the minimum height. The text
is 13px at every size.

### Debounce

`debounce` delays `update:modelValue` by that many milliseconds after the last
keystroke.

## Accessibility

- The `<label>` is linked to the `<textarea>`, so screen readers announce it as
  the field's name. Pass `aria-label` when there is no visible label.
- The description and the error are linked with `aria-describedby`.
- With `error`, the `<textarea>` gets `aria-invalid="true"` and
  `aria-errormessage`.
- With `required`, the `<textarea>` gets `aria-required="true"`, and the label
  includes hidden "(required)" text. The asterisk itself is hidden from screen
  readers.

## Migrating from v0

| Before                   | After                                   |
| ------------------------ | --------------------------------------- |
| `size="xl"`              | `size="lg"`                             |
| text size follows `size` | text is 13px at every size              |
| template ref `.el`       | `.focus()`, or `.inputElement`          |

See the [migration guide](../migration#inputs) for details.

<!-- @include: ./Textarea.api.md -->
