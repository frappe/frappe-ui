# Switch

A toggle input for turning options on or off. Clearly indicates state changes and allows quick, intuitive control.

## Playground

<ClientOnly><SwitchBuilder /></ClientOnly>

## With icon

Strings starting with `lucide-` route through the shared Lucide
Tailwind utility. Component values are rendered with `<component :is>`.

<ComponentPreview name="Switch-Icons" />

## States

<ComponentPreview name="Switch-States" />

## In a toolbar

The `padded` variant gives the switch a clickable surface and hover state that
matches the buttons beside it, so it sits comfortably in a toolbar. Clicking
anywhere on the row toggles the switch.

<ComponentPreview name="Switch-Toolbar" />

## Settings list

When a `description` is present the switch sits on the right of the row. The
switch control stays interactive on its own — there are no row-level hover or
focus states.

<ComponentPreview name="Switch-SettingsRows" />

<!-- @include: ./Switch.api.md -->
