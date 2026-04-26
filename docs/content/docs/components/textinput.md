# TextInput

A flexible input for entering text, numbers etc. Supports many sizes, styles, and custom slots.

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

<!-- @include: ../../../meta/TextInput.md -->
