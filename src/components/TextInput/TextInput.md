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

### `type="number"` still gives you a string

`modelValue` accepts `string | number`, and the component always emits a
`string`. That is what the DOM gives it: `input.value` is a string whatever the
`type` is. Add Vue's `.number` modifier when you want a number back.

```vue
<!-- price is a string: "42" -->
<TextInput type="number" v-model="price" />

<!-- price is a number: 42 -->
<TextInput type="number" v-model.number="price" />
```

An empty field with `.number` gives `''`, not `0`, so guard before arithmetic.

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

<!-- @include: ./TextInput.api.md -->
