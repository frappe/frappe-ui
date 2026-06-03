# Radio

Lets users pick a single option from a set. Radios that share a `v-model` (and
`name`) form a group — selecting one clears the rest.

<ComponentPreview name="Radio-Default" layout="stacked" />

## Variants

`default` is a plain inline radio. `padded` wraps the control and label in a
clickable surface with hover, active and focus states — for selection lists and
menu items. The control always stays on the leading side.

<ComponentPreview name="Radio-Variants" />

## Sizes

<ComponentPreview name="Radio-Sizes" />

## Labeling

`label`, `description`, and `error` are wired into the underlying input via the
shared labeling contract. Description and error stack below the row, indented
under the label region.

<ComponentPreview name="Radio-Labeling" />

## Required

A radio is a single option within a group, so the asterisk belongs on the
group's heading — not on each option. Mark the heading yourself; if you also
need browser form validation, a native `required` attribute passes through to
the underlying input.

<ComponentPreview name="Radio-Required" />

## States

<ComponentPreview name="Radio-States" />

## Settings list

Group radios under a heading for mutually exclusive settings. A `description`
stacks below the label, indented under the control.

<ComponentPreview name="Radio-SettingsList" />

<!-- @include: ./Radio.api.md -->
