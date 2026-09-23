# Error Message

Displays a clear message to indicate errors or issues. Helps users understand problems and take corrective action quickly.

<ComponentPlayground name="ErrorMessage" />

## String Message
<ComponentPreview name="ErrorMessage-Examples" />

## Error Object
<ComponentPreview name="ErrorMessage-ErrorObject" />

## Several Messages

`message` also takes an array of strings, and renders one line per message. An
`Error` carrying a `messages` array (which Frappe's whitelisted methods return)
renders the same way; its own `message` is used only when `messages` is empty.

<ComponentPreview name="ErrorMessage-SeveralMessages" />


<!-- @include: ./ErrorMessage.api.md -->
