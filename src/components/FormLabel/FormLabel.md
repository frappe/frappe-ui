# FormLabel

The label above a form field: the label text and an optional required marker.
Inputs in the library draw the same label from their own `label` prop, so use
`FormLabel` only for a control you build yourself.

<ComponentPlayground name="FormLabel" />

## Examples

### Label for a custom control

`id` links the label to a native color input, so clicking the label opens the
color picker.

<ComponentPreview name="FormLabel-ColorField" />

## Behavior

### Linking to a control

`id` is the id of the control, not of the label. It sets the label's `for`
attribute. Give the control the same `id`.

### Required marker

`required` adds a red asterisk after the text. It does not set `required` on
the control, so set that yourself.

## Accessibility

The asterisk is hidden from screen readers. The label includes hidden
"(required)" text instead, so the control's name is announced as, for example,
"Brand color (required)".

<!-- @include: ./FormLabel.api.md -->
