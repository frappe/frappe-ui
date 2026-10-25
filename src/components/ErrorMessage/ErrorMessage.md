# ErrorMessage

Shows one or more error messages in red text. It renders nothing when there is
no error.

<ComponentPlayground name="ErrorMessage" />

## Examples

### Error from a server call

Pass the `Error` a failed call returns. Frappe's whitelisted methods put
several messages on it, and each one renders on its own line.

<ComponentPreview name="ErrorMessage-ServerError" />

### Form errors in one place

`message` takes an array of strings. Submit the form empty to see both lines.

<ComponentPreview name="ErrorMessage-SeveralMessages" />

## Behavior

### Message values

`message` takes a string, an array of strings, or an `Error`. An `Error` with a
`messages` array renders those messages. Its own `message` is used only when
`messages` is empty. An empty string, an empty array, or an `Error` with
neither renders nothing.

The `error` prop on every input takes the same values.

### HTML in messages

Messages render as HTML, so markup such as `<b>` in a server message shows as
bold. The HTML is sanitized with DOMPurify first, which removes scripts and
event handlers.

## Accessibility

The message has `role="alert"`, so screen readers announce it when it appears.

<!-- @include: ./ErrorMessage.api.md -->
