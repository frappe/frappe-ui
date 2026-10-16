<script setup lang="ts">
// The Date picker page: the file's first five pickers (node 29745:39578),
// one below the other as the settings modal's patterns are, the outline on
// the right, and under each picker the options its kind has in the file.
//
// The file's weeks start on Monday; frappe-ui's calendar takes its week
// start from dayjs's locale, so the page sets it while it's open and puts
// it back when it closes.
import { onUnmounted } from 'vue'
import dayjs from 'dayjs/esm'
import PatternsPage from '../PatternsPage.vue'
import type { Pattern } from '../PatternsPage.vue'
import DatePickerSection from './DatePickerSection.vue'

const previousWeekStart = dayjs.Ls.en?.weekStart ?? 0
dayjs.updateLocale('en', { weekStart: 1 })
// (the month names stay the library's three letters — the user's call
// 2026-10-08: "December" would outgrow the month button)
onUnmounted(() => dayjs.updateLocale('en', { weekStart: previousWeekStart }))

const section = (id: string, title: string, kind: string): Pattern => ({
  id,
  title,
  component: DatePickerSection,
  props: { kind },
})
const patterns: Pattern[] = [
  section('inline', 'Inline', 'inline'),
  section('default', 'Default', 'default'),
  section('date-time', 'Date-time', 'date-time'),
  section('range', 'Date range - single pane', 'range'),
  section('range-double', 'Date range - double pane', 'range-double'),
]
</script>

<template>
  <PatternsPage
    title="Date picker patterns"
    description="The date pickers in the Frappe apps, each with the parts it can take."
    width="700px"
    :patterns="patterns"
  />
</template>
