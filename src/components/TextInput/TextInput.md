# TextInput

A flexible input for entering text, numbers etc. Supports many sizes, styles, and custom slots.

## Playground

<ComponentPlayground name="TextInput" />

<ComponentPreview name="TextInput-Default" layout="stacked" />

## Variants

<ComponentPreview name="TextInput-Variants" />

## Sizes

<ComponentPreview name="TextInput-Sizes" />

## Types

<ComponentPreview name="TextInput-Types" />

## Prefix and suffix slots

<ComponentPreview name="TextInput-PrefixSuffix" />

## Labeling

`label`, `description`, `error`, and `required` are wired into the
underlying input via the shared labeling contract. Setting `error`
suppresses the `description` and applies `aria-invalid="true"`.

<ComponentPreview name="TextInput-Labeling" />

## Custom label and description slots

The `#label` slot receives `{ required }` so callers can render their
own required indicator.

<ComponentPreview name="TextInput-Slots" />

## States

<ComponentPreview name="TextInput-States" />

## Reusing the box classes

The size and variant classes on this page are a table `TextInput` reads through
`useInputClasses` (`frappe-ui/experimental`). An element that is not an `<input>`
— a contenteditable title, a tag field — reads the same table instead of copying
it, and passes `focusPrefix: 'focus-within'` so the focus treatment lands on the
box rather than on a child.

<!-- @include: ./TextInput.api.md -->
