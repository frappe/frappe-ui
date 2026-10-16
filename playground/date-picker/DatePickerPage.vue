<script setup lang="ts">
// The Date picker page: the file's first five pickers (node 29745:39578),
// one below the other as the settings modal's patterns are, the outline on
// the right. Under the outline, as the Charts page has its controls, the
// options of the picker in view — the parts its kind has in the file:
// inline has none; date & time a header and a sidebar but no footer; the
// rest all three; and the single-month pickers the month list (the file's
// month-picker interaction).
//
// The file's weeks start on Monday; frappe-ui's calendar takes its week
// start from dayjs's locale, so the page sets it while it's open and puts
// it back when it closes.
import { onUnmounted, reactive } from 'vue'
import dayjs from 'dayjs/esm'
import { Switch } from '../../src'
import PatternsPage from '../PatternsPage.vue'
import type { Pattern } from '../PatternsPage.vue'
import DatePickerSection from './DatePickerSection.vue'
import type { DatePickerKind, DatePickerOptions } from './DatePickerSection.vue'

const previousWeekStart = dayjs.Ls.en?.weekStart ?? 0
dayjs.updateLocale('en', { weekStart: 1 })
// (the month names stay the library's three letters — the user's call
// 2026-10-08: "December" would outgrow the month button)
onUnmounted(() => dayjs.updateLocale('en', { weekStart: previousWeekStart }))

const PICKERS: Array<{
  kind: DatePickerKind
  title: string
  options: Array<keyof DatePickerOptions>
}> = [
  { kind: 'inline', title: 'Inline', options: [] },
  {
    kind: 'default',
    title: 'Default',
    options: ['header', 'sidebar', 'footer', 'monthPicker'],
  },
  {
    kind: 'date-time',
    title: 'Date-time',
    options: ['header', 'sidebar', 'monthPicker'],
  },
  {
    kind: 'range',
    title: 'Date range - single pane',
    options: ['header', 'sidebar', 'footer', 'monthPicker'],
  },
  {
    kind: 'range-double',
    title: 'Date range - double pane',
    options: ['header', 'sidebar', 'footer'],
  },
]
const LABELS: Record<keyof DatePickerOptions, string> = {
  header: 'Header',
  sidebar: 'Sidebar',
  footer: 'Footer',
  monthPicker: 'Month picker',
}

// each picker keeps its own options
const state = reactive(
  Object.fromEntries(
    PICKERS.map((p) => [
      p.kind,
      { header: false, sidebar: false, footer: false, monthPicker: false },
    ]),
  ) as Record<DatePickerKind, DatePickerOptions>,
)

const patterns: Pattern[] = PICKERS.map((p) => ({
  id: p.kind,
  title: p.title,
  component: DatePickerSection,
  props: { kind: p.kind, options: state[p.kind] },
}))
const pickerOf = (id: string) => PICKERS.find((p) => p.kind === id)
</script>

<template>
  <PatternsPage
    title="Date picker patterns"
    description="The date pickers in the Frappe apps, each with the parts it can take."
    width="700px"
    centered
    :patterns="patterns"
  >
    <template #rail="{ active }">
      <template v-if="pickerOf(active)?.options.length">
        <div class="mt-10 text-base-medium text-ink-gray-8">Options</div>
        <div class="mt-3 flex flex-col gap-1">
          <label
            v-for="key in pickerOf(active)!.options"
            :key="`${active}-${key}`"
            class="flex h-7 cursor-pointer items-center justify-between"
          >
            <span class="text-base text-ink-gray-7">{{ LABELS[key] }}</span>
            <Switch
              v-model="state[active as DatePickerKind][key]"
              size="sm"
              :aria-label="LABELS[key]"
            />
          </label>
        </div>
      </template>
    </template>
  </PatternsPage>
</template>
