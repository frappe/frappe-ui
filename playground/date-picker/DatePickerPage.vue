<script setup lang="ts">
// The Date picker page: the picker on the left, shown open, and its Preview
// control on the right — the file's properties (node 29745:39578): Variant
// (Default, Inline, Date & time), Date range, Double pane (a range over two
// months), and the three optional parts, Header, Footer and Sidebar. The
// month list (the file's month-picker interaction) opens from the month
// button, as it does in use.
//
// The file's weeks start on Monday; frappe-ui's calendar takes its week
// start from dayjs's locale, so the page sets it while it's open and puts
// it back when it closes.
import { computed, onUnmounted, ref, watch } from 'vue'
import dayjs from 'dayjs/esm'
import { Select, Switch } from '../../src'
import { months } from '../../src/components/DatePicker/utils'
import DatePickerPreview from './DatePickerPreview.vue'
import type { DatePickerVariant } from './DatePickerPreview.vue'

const FULL_MONTHS = Array.from({ length: 12 }, (_, i) =>
  dayjs().month(i).format('MMMM'),
)

const previousWeekStart = dayjs.Ls.en?.weekStart ?? 0
dayjs.updateLocale('en', { weekStart: 1 })
// …and its month names are short ("Jun"), where the file spells them out
// ("June"); the list is the library's own, so the page swaps the names in
// while it's open and puts the short ones back after
const shortMonths = [...months]
months.splice(0, 12, ...FULL_MONTHS)
onUnmounted(() => {
  dayjs.updateLocale('en', { weekStart: previousWeekStart })
  months.splice(0, 12, ...shortMonths)
})

// `?variant=date-time&range&double&header&footer&sidebar` opens the page on
// that combination
const q = new URLSearchParams(window.location.search)
const variant = ref<DatePickerVariant>(
  (['default', 'inline', 'date-time'] as const).find(
    (v) => v === q.get('variant'),
  ) ?? 'default',
)
const variants = [
  { label: 'Default', value: 'default' },
  { label: 'Inline', value: 'inline' },
  { label: 'Date & time', value: 'date-time' },
]
const range = ref(q.has('range') && variant.value !== 'date-time')
const doublePane = ref(q.has('double') && range.value)
const header = ref(q.has('header'))
const footer = ref(q.has('footer'))
const sidebar = ref(q.has('sidebar'))

// the file has no range with a time; double pane is a range's
const canRange = computed(() => variant.value !== 'date-time')
watch(canRange, (ok) => !ok && (range.value = false))
watch(range, (on) => !on && (doublePane.value = false))
</script>

<template>
  <div class="flex h-full items-center justify-center px-5 py-10">
    <div class="flex items-start gap-10">
      <!-- one box, the size of the largest picker (sidebar, two months,
           header, time and footer), so switching moves nothing: the picker
           keeps its top-left corner -->
      <div class="h-[400px] w-[560px]">
        <DatePickerPreview
          :variant="variant"
          :range="range"
          :double-pane="doublePane"
          :header="header"
          :footer="footer"
          :sidebar="sidebar"
        />
      </div>
      <!-- the controller, as the file input's -->
      <div
        class="flex w-[274px] shrink-0 flex-col gap-3 rounded-7 border border-outline-gray-1 bg-surface-elevation-2 px-4 pb-[13px] pt-4"
      >
        <p class="text-lg-semibold leading-[1.15] text-ink-gray-9">
          Preview control
        </p>
        <div class="flex flex-col gap-3">
          <div class="flex h-7 items-center justify-between">
            <span class="text-base text-ink-gray-7">Variant</span>
            <Select
              v-model="variant"
              :options="variants"
              size="sm"
              variant="subtle"
              class="w-[140px]"
              aria-label="Variant"
            />
          </div>
          <div v-if="canRange" class="flex h-7 items-center justify-between">
            <span class="text-base text-ink-gray-7">Date range</span>
            <Switch v-model="range" size="sm" aria-label="Date range" />
          </div>
          <div v-if="range" class="flex h-7 items-center justify-between">
            <span class="text-base text-ink-gray-7">Double pane</span>
            <Switch v-model="doublePane" size="sm" aria-label="Double pane" />
          </div>
          <div class="flex h-7 items-center justify-between">
            <span class="text-base text-ink-gray-7">Header</span>
            <Switch v-model="header" size="sm" aria-label="Header" />
          </div>
          <div class="flex h-7 items-center justify-between">
            <span class="text-base text-ink-gray-7">Footer</span>
            <Switch v-model="footer" size="sm" aria-label="Footer" />
          </div>
          <div class="flex h-7 items-center justify-between">
            <span class="text-base text-ink-gray-7">Sidebar</span>
            <Switch v-model="sidebar" size="sm" aria-label="Sidebar" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
