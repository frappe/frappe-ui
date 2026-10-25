# Password

A text field for passwords. An eye icon inside the field shows or hides what
was typed.

<ComponentPlayground name="Password" />

## Examples

### Sign-in form

`Password` next to an email [TextInput](./textinput). The `#prefix` slot puts
a lock icon before the text, and `autocomplete="current-password"` lets the
browser fill in a saved password.

<ComponentPreview name="Password-SignIn" />

### New password

`required`, a `description` with the rule, and an `error` set from a `@blur`
listener. `autocomplete="new-password"` lets the browser suggest a strong
password.

<ComponentPreview name="Password-NewPassword" />

## Behavior

### Show and hide

The eye icon toggles the field between hidden and plain text. `Cmd+I` on macOS
and `Ctrl+I` elsewhere do the same while the field has focus. A tooltip on the
icon names the action and the shortcut.

The icon is hidden while the value contains `*`, such as a masked
`********` value from the server.

### Slots

The eye icon uses the space of the `#suffix` slot, so `Password` has no
`#suffix`. It has `#prefix`, `#label` and `#description`, which work as they do
on [TextInput](./textinput).

### Label, description and error

`label` renders above the field and `description` below it. `error` renders
below the field and hides `description`. It takes a string, an array of strings
(one line each), or an `Error`, the same values as
[ErrorMessage](./errormessage). An empty string or an empty array means no
error. `required` adds a red asterisk to the label and sets `required` on the
`<input>`.

The `#label` slot replaces the label text and the required marker, and receives
`{ required }`. A `#description` slot is not hidden by `error`. It renders
above the error.

### Attributes

`class` and `style` go on the outer element: the wrapper when a label,
description or error shows, and the field box otherwise. Every other attribute
and listener goes on the `<input>`, including `name`, `autocomplete` and
`@blur`.

## Accessibility

| Keys               | Action                    |
| ------------------ | ------------------------- |
| `Cmd+I` / `Ctrl+I` | Show or hide the password |

- The eye icon is not a button and cannot be reached with `Tab`. Keyboard
  users toggle with the shortcut above.
- The `<label>` is linked to the `<input>`, so screen readers announce it as
  the field's name.
- The description and the error are linked with `aria-describedby`.
- With `error`, the `<input>` gets `aria-invalid="true"` and
  `aria-errormessage`.
- With `required`, the `<input>` gets `aria-required="true"`, and the label
  includes hidden "(required)" text. The asterisk itself is hidden from screen
  readers.

<!-- @include: ./Password.api.md -->
