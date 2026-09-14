# TimePicker

Lets users select a specific time from a list or enter a custom value. Supports 12/24-hour formats, custom intervals, and optional time ranges.

## Basic
<ComponentPreview name="TimePicker-Basic" />

## 24 Hour Format
<ComponentPreview name="TimePicker-TwentyFour" />

## Custom Options
<ComponentPreview name="TimePicker-CustomOptions" />

## Min / Max Range
<ComponentPreview name="TimePicker-Range" />

## Labeling
<ComponentPreview name="TimePicker-Labeling" />

## Sizes & Variants
<ComponentPreview name="TimePicker-SizesAndVariants" />

The `#suffix` slot receives `{ open, disabled, setOpen, close }`. Use
`setOpen(!open)` for a custom chevron; `close()` is shorthand for
`setOpen(false)`.

## Template ref

A template ref exposes `{ open, close, focus }`. `TimePicker` renders its own
trigger, so a parent's script has no other handle on the popover. `open()` does
nothing while the picker is disabled.

```vue
<script setup lang="ts">
import { useTemplateRef } from 'vue'

const picker = useTemplateRef('picker')
</script>

<template>
  <TimePicker ref="picker" v-model="time" />
  <Button label="Pick a time" @click="picker?.open()" />
</template>
```

## Styling and ARIA

The input carries `data-slot="control"` — `trigger` is reserved for `Select`,
`Combobox` and `MultiSelect`. The default chevron carries
`data-slot="chevron"`. The input also carries `role="combobox"`,
`aria-haspopup="listbox"` and `aria-expanded`, so a screen reader announces
that the field opens a list and whether that list is open.

<!-- @include: ./TimePicker.api.md -->
