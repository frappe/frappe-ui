<script setup lang="ts">
// One of the file's date pickers (node 29745:39578), shown open, with the
// options its kind has in the file under it. Inline is the bare calendar
// and has none; date & time has a header and a sidebar but no footer; the
// rest have all three. The month list (the file's month-picker
// interaction) is a switch on the single-month pickers.
import { computed, ref } from 'vue'
import { Switch } from '../../src'
import DatePickerPreview from './DatePickerPreview.vue'

export type DatePickerKind =
  | 'inline'
  | 'default'
  | 'date-time'
  | 'range'
  | 'range-double'

const props = defineProps<{ kind: DatePickerKind }>()

const variant = computed(() =>
  props.kind === 'inline'
    ? 'inline'
    : props.kind === 'date-time'
      ? 'date-time'
      : 'default',
)
const range = computed(() => props.kind.startsWith('range'))
const doublePane = computed(() => props.kind === 'range-double')

const header = ref(false)
const sidebar = ref(false)
const footer = ref(false)
const monthPicker = ref(false)

const options = computed(() => {
  if (props.kind === 'inline') return []
  const list = [
    { label: 'Header', model: header },
    { label: 'Sidebar', model: sidebar },
  ]
  if (props.kind !== 'date-time') list.push({ label: 'Footer', model: footer })
  if (props.kind !== 'range-double')
    list.push({ label: 'Month picker', model: monthPicker })
  return list
})

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
  <div class="flex flex-col gap-6">
    <div class="flex items-start" :class="STAGE[kind]">
      <DatePickerPreview
        v-model:month-picker="monthPicker"
        :variant="variant"
        :range="range"
        :double-pane="doublePane"
        :header="header"
        :sidebar="sidebar"
        :footer="footer"
        :hold-top="false"
      />
    </div>
    <div v-if="options.length" class="flex flex-wrap gap-x-8 gap-y-3">
      <Switch
        v-for="o in options"
        :key="o.label"
        v-model="o.model.value"
        size="sm"
        :label="o.label"
      />
    </div>
  </div>
</template>
