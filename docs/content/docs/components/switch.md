# Switch

A toggle input for turning options on or off. Clearly indicates state changes and allows quick, intuitive control.

<ComponentPreview name="Switch-Default" layout="stacked" />

## Sizes

<ComponentPreview name="Switch-Sizes" />

## With icon

Strings starting with `lucide-` route through the shared Lucide
Tailwind utility. Component values are rendered with `<component :is>`.

<ComponentPreview name="Switch-Icons" />

## Labeling

<ComponentPreview name="Switch-Labeling" />

## States

<ComponentPreview name="Switch-States" />

## Deprecated `change` emit

The `change` emit is kept for backwards compatibility and will fire a
dev-mode `[frappe-ui] Switch.change is deprecated. Use update:modelValue / v-model instead.`
warning when bound. Use `v-model` / `update:modelValue` instead.

<ComponentPreview name="Switch-LegacyChange" />

<!-- @include: ../../../meta/Switch.md -->
