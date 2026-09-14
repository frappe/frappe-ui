# DatePicker

A set of pickers for selecting dates, date ranges, or date and time. Smooth, intuitive interfaces make choosing and adjusting values quick and precise.

## Date Picker

<ComponentPreview name="DatePicker-Examples" />

## DateTime Picker

<ComponentPreview name="DatePicker-DateTime" />

## Date Range Picker

<ComponentPreview name="DatePicker-Range" />

Picker trigger and action slots receive `{ open, disabled, setOpen, close }`
alongside their date-specific fields. `DateTimePicker` uses `typeable` for both
the date and time inputs.

## Template ref

All three pickers expose `{ open, close, focus }`. They render their own
trigger, so a parent's script has no other handle on the panel. `open()` does
nothing while the picker is disabled.

```vue
<script setup lang="ts">
import { useTemplateRef } from 'vue'

const picker = useTemplateRef('picker')
</script>

<template>
  <DatePicker ref="picker" v-model="date" />
  <Button label="Pick a date" @click="picker?.open()" />
</template>
```

## Styling and ARIA

The input carries `data-slot="control"` — `trigger` is reserved for `Select`,
`Combobox` and `MultiSelect`. The default chevron carries
`data-slot="chevron"`. The input also carries `role="combobox"`,
`aria-haspopup="dialog"` and `aria-expanded`, so a screen reader announces that
the field opens a panel and whether that panel is open.

<!-- @include: ./DatePicker.api.md -->
