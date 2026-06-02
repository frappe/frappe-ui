# Checkbox

Allows users to select or deselect an option, commonly used in forms and settings where multiple choices are available.

## Playground

<ClientOnly><CheckboxBuilder /></ClientOnly>

<ComponentPreview name="Checkbox-Default" layout="stacked" />

## Variants

`default` is a plain inline checkbox. `padded` wraps the control and label in a
clickable surface with hover, active and focus states — for selection lists and
menu items. The checkbox always stays on the leading side.

<ComponentPreview name="Checkbox-Variants" />

## Sizes

<ComponentPreview name="Checkbox-Sizes" />

## Labeling

`label`, `description`, `error`, and `required` are wired into the
underlying input via the shared labeling contract. Description and
error stack below the row, indented under the label region.

<ComponentPreview name="Checkbox-Labeling" />

## States

<ComponentPreview name="Checkbox-States" />

## Selection list

The `padded` variant turns each row into a clickable surface — clicking
anywhere on the row toggles the checkbox. It works well for selecting people or
items inside a menu or popover.

<ComponentPreview name="Checkbox-MemberList" />

## Settings list

In the `default` variant a `description` stacks below the label, indented under
the control. Useful for settings where some options need extra explanation.

<ComponentPreview name="Checkbox-SettingsList" />

## Group

Stack related options into a vertical settings group.

<ComponentPreview name="Checkbox-Group" />

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
