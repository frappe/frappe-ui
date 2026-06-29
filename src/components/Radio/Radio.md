# Radio

Lets users pick a single option from a set. Radios that share a `v-model` (and
`name`) form a group — selecting one clears the rest.

## Playground

<ClientOnly><RadioBuilder /></ClientOnly>

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
