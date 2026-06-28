# Checkbox

Allows users to select or deselect an option, commonly used in forms and settings where multiple choices are available.

## Playground

<ClientOnly><CheckboxBuilder /></ClientOnly>

## Indeterminate

Use `indeterminate` for "select all" controls where only some children are checked. Clicking selects all; clicking again deselects all.

<ComponentPreview name="Checkbox-Indeterminate" />

## States

<ComponentPreview name="Checkbox-States" />

## Selection list

For a full selection dropdown, reach for [MultiSelect](/docs/components/multiselect)
— it builds the popover, search, and checkbox rows for you. Add avatars or icons
to each option with its `#item-prefix` slot.

<ComponentPreview name="Checkbox-MemberList" />

## Settings list

In the `default` variant a `description` stacks below the label, indented under
the control. Useful for settings where some options need extra explanation.

<ComponentPreview name="Checkbox-SettingsList" />

## With description

Pair each option with helper text to clarify its effect.

<ComponentPreview name="Checkbox-WithDescription" />

## Horizontal group

Wrap multiple options inline under a section title.

<ComponentPreview name="Checkbox-HorizontalGroup" />

## Setting row

Compose a checkbox group as the value side of a label/value row.

<ComponentPreview name="Checkbox-SettingRow" />

<!-- @include: ./Checkbox.api.md -->
