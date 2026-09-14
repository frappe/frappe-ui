# Radio

Lets users pick a single option from a set. `RadioGroup` owns the selected
value; each `Radio` inside it declares the value it represents.

```vue
<RadioGroup v-model="plan" label="Choose a plan">
  <Radio value="free" label="Free" />
  <Radio value="pro" label="Pro" />
</RadioGroup>
```

`Radio` must be used inside a `RadioGroup` — it throws otherwise. The group
handles arrow-key navigation, roving focus and form submission, so options only
need a `value`.

## Playground

<ComponentPlayground name="Radio" />

## Required

The asterisk belongs on the group heading, not on each option — a radio is one
choice within a group, so marking every option would be wrong. Set `required` on
`RadioGroup` and it renders on the heading.

<ComponentPreview name="Radio-Required" />

## States

<ComponentPreview name="Radio-States" />

## Settings list

Use `padded` for mutually exclusive settings. A `description` stacks below the
label, and the whole row is the click target.

<ComponentPreview name="Radio-SettingsList" />

## Template ref

`focus()` is the one method every input in the library exposes. It moves focus
to the component's own interactive element, so a generic form can call it
without knowing which control it holds.

```vue
<script setup lang="ts">
import { useTemplateRef } from 'vue'

const field = useTemplateRef('field')
</script>

<template>
  <RadioGroup ref="field" v-model="value" />
</template>
```

## Attributes

`class` and `style` go to the layout wrapper. Everything else — `name`,
`aria-*`, `data-*`, and listeners — goes once to the interactive element.

<!-- @include: ./Radio.api.md -->
