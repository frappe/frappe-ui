# Password

Provides a secure input for entering passwords. Supports visibility toggling and ensures a clear, user-friendly experience.

<ComponentPreview name="Password-Default" layout="stacked" />

## Variants

<ComponentPreview name="Password-Variants" />

## Sizes

<ComponentPreview name="Password-Sizes" />

## Labeling

`label`, `description`, `error`, and `required` are wired into the
underlying input via the shared labeling contract.

<ComponentPreview name="Password-Labeling" />

## States

<ComponentPreview name="Password-States" />

## Deprecated `value` prop

The `value` prop is kept for backwards compatibility and will fire a
dev-mode `[frappe-ui] Password.value is deprecated` warning. Use
`v-model` / `modelValue` instead.

<ComponentPreview name="Password-LegacyValue" />

<!-- @include: ../../../meta/Password.md -->
