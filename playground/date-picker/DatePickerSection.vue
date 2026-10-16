<script setup lang="ts">
// One of the file's date pickers (node 29745:39578), shown open. Its
// options — the parts its kind has in the file — are set from the page's
// rail (DatePickerPage), so the state lives there.
import { computed } from 'vue'
import DatePickerPreview from './DatePickerPreview.vue'

export type DatePickerKind =
  | 'inline'
  | 'default'
  | 'date-time'
  | 'range'
  | 'range-double'

export type DatePickerOptions = {
  header: boolean
  sidebar: boolean
  footer: boolean
}

const props = defineProps<{
  kind: DatePickerKind
  options: DatePickerOptions
}>()

const variant = computed(() =>
  props.kind === 'inline'
    ? 'inline'
    : props.kind === 'date-time'
      ? 'date-time'
      : 'default',
)
const range = computed(() => props.kind.startsWith('range'))
const doublePane = computed(() => props.kind === 'range-double')

// the stage holds the tallest the picker gets — every option on, the month
// list open, or a month of six weeks — so turning one on, or moving to
// another month, never moves what's below
const STAGE: Record<DatePickerKind, string> = {
  inline: 'min-h-[226px]',
  default: 'min-h-[328px]',
  'date-time': 'min-h-[306px]',
  range: 'min-h-[328px]',
  'range-double': 'min-h-[332px]',
}
</script>

<template>
  <div class="flex items-start" :class="STAGE[kind]">
    <DatePickerPreview
      :variant="variant"
      :range="range"
      :double-pane="doublePane"
      :header="options.header"
      :sidebar="options.sidebar"
      :footer="options.footer"
      :hold-top="false"
    />
  </div>
</template>
