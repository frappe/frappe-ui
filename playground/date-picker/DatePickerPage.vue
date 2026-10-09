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
import DatePickerPreview from './DatePickerPreview.vue'
import type { DatePickerVariant } from './DatePickerPreview.vue'

const previousWeekStart = dayjs.Ls.en?.weekStart ?? 0
dayjs.updateLocale('en', { weekStart: 1 })
// (the month names stay the library's three letters — the user's call
// 2026-10-08: "December" would outgrow the month button)
onUnmounted(() => dayjs.updateLocale('en', { weekStart: previousWeekStart }))

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
// inline is the bare calendar: no range, header, footer or sidebar (the
// user's call 2026-10-08) — those switches go off and grey out
const inline = computed(() => variant.value === 'inline')
const range = ref(q.has('range') && !inline.value)
const doublePane = ref(q.has('double') && range.value)
const header = ref(q.has('header') && !inline.value)
const footer = ref(q.has('footer') && !inline.value)
const sidebar = ref(q.has('sidebar') && !inline.value)
watch(inline, (on) => {
  if (!on) return
  range.value = header.value = footer.value = sidebar.value = false
})
// double pane is a range's
watch(range, (on) => !on && (doublePane.value = false))
</script>

<template>
  <div class="flex h-full items-center justify-center px-5 py-10">
    <div class="flex items-start gap-10">
      <!-- one box, the size of the largest picker (sidebar, two months,
           header, time and footer), so the controller never moves; the picker
           sits in its middle (the user's call 2026-10-09 — a single pane
           pinned top-left looked off) -->
      <div class="flex h-[400px] w-[560px] items-center justify-center">
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
          <div class="flex h-7 items-center justify-between">
            <span class="text-base text-ink-gray-7">Date range</span>
            <Switch
              v-model="range"
              size="sm"
              :disabled="inline"
              aria-label="Date range"
            />
          </div>
          <div v-if="range" class="flex h-7 items-center justify-between">
            <span class="text-base text-ink-gray-7">Double pane</span>
            <Switch v-model="doublePane" size="sm" aria-label="Double pane" />
          </div>
          <div class="flex h-7 items-center justify-between">
            <span class="text-base text-ink-gray-7">Header</span>
            <Switch
              v-model="header"
              size="sm"
              :disabled="inline"
              aria-label="Header"
            />
          </div>
          <div class="flex h-7 items-center justify-between">
            <span class="text-base text-ink-gray-7">Footer</span>
            <Switch
              v-model="footer"
              size="sm"
              :disabled="inline"
              aria-label="Footer"
            />
          </div>
          <div class="flex h-7 items-center justify-between">
            <span class="text-base text-ink-gray-7">Sidebar</span>
            <Switch
              v-model="sidebar"
              size="sm"
              :disabled="inline"
              aria-label="Sidebar"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
