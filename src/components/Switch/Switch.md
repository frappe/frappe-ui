# Switch

A toggle input for turning options on or off. Clearly indicates state changes and allows quick, intuitive control.

<ComponentPreview name="Switch-Default" layout="stacked" />

## Variants

`default` is a plain inline toggle. `padded` wraps the control and label in a
clickable surface with hover, active and focus states — for settings rows and
menu items.

<ComponentPreview name="Switch-Variants" />

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

## Settings list

The `padded` variant turns each row into a clickable surface — clicking
anywhere on the row toggles the switch. This works well for grouped settings
and menus. With a label only, the switch stays on the left.

<ComponentPreview name="Switch-SettingsList" />

## Rows with descriptions

When a `description` is present the switch moves to the right of the row. The
switch control stays interactive on its own — there are no row-level hover or
focus states.

<ComponentPreview name="Switch-SettingsRows" />

## Deprecated `change` emit

The `change` emit is kept for backwards compatibility and will fire a
dev-mode `[frappe-ui] Switch.change is deprecated. Use update:modelValue / v-model instead.`
warning when bound. Use `v-model` / `update:modelValue` instead.

<ComponentPreview name="Switch-LegacyChange" />

<!-- @include: ./Switch.api.md -->
