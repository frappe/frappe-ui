<script setup lang="ts">
import { computed, ref } from 'vue'
import { Select, Switch } from 'frappe-ui'
import {
  BarChart,
  DonutChart,
  FunnelChart,
  HeatmapChart,
  NumberCard,
} from 'frappe-ui/charts'

const bars = [
  { quarter: 'Q1 2026', revenue: 61400 },
  { quarter: 'Q2 2026', revenue: 72500 },
  { quarter: 'Q3 2026', revenue: 79100 },
]
const slices = [
  { channel: 'Organic search', sessions: 39900 },
  { channel: 'Paid social', sessions: 21400 },
  { channel: 'Email', sessions: 16800 },
]
const stages = [
  { stage: 'Leads', count: 563 },
  { stage: 'Qualified', count: 385 },
  { stage: 'Won', count: 39 },
]
const cells = ['Mon', 'Tue', 'Wed'].flatMap((day, dayIndex) =>
  ['Morning', 'Evening'].map((shift, shiftIndex) => ({
    day,
    shift,
    tickets: 20 + dayIndex * 12 + shiftIndex * 7,
  })),
)

const state = ref<'loading' | 'error' | 'empty'>('loading')
const stateOptions = [
  { label: 'Loading', value: 'loading' },
  { label: 'Error', value: 'error' },
  { label: 'Empty', value: 'empty' },
]

const rtl = ref(false)
const dir = computed(() => (rtl.value ? 'rtl' : 'ltr') as 'rtl' | 'ltr')

const width = ref('max-w-none')
const widthOptions = [
  { label: 'Narrow', value: 'max-w-md' },
  { label: 'Medium', value: 'max-w-2xl' },
  { label: 'Full', value: 'max-w-none' },
]

const common = computed(() => ({
  dir: dir.value,
  loading: state.value === 'loading',
  error: state.value === 'error' ? 'Could not load this report' : null,
}))

/** Empty is a data state, not a flag: the chart decides it has nothing to draw. */
function rows<T>(data: T[]) {
  return state.value === 'empty' ? [] : data
}
</script>

<template>
  <div class="flex w-full flex-col gap-4">
    <div
      class="flex flex-wrap items-center gap-3 rounded-lg border border-outline-gray-1 bg-surface-gray-1 px-3 py-2"
    >
      <Select v-model="state" :options="stateOptions" size="sm" />
      <Select v-model="width" :options="widthOptions" size="sm" />
      <Switch v-model="rtl" label="RTL" size="sm" />
    </div>

    <!-- echarts reads direction at init, so remount the grid when it flips. -->
    <div :key="dir" :class="width" class="grid gap-4 sm:grid-cols-2">
      <div class="h-64">
        <BarChart
          v-bind="common"
          :data="rows(bars)"
          x="quarter"
          y="revenue"
          title="Revenue"
        />
      </div>
      <div class="h-64">
        <DonutChart
          v-bind="common"
          :data="rows(slices)"
          category="channel"
          value="sessions"
          title="Traffic by channel"
        />
      </div>
      <div class="h-64">
        <FunnelChart
          v-bind="common"
          :data="rows(stages)"
          category="stage"
          value="count"
          title="Deal pipeline"
        />
      </div>
      <div class="h-64">
        <HeatmapChart
          v-bind="common"
          :data="rows(cells)"
          x="day"
          y="shift"
          value="tickets"
          title="Support load"
        />
      </div>
      <NumberCard
        v-bind="common"
        title="Net revenue"
        :value="state === 'empty' ? null : 220200"
        prefix="$"
        compact
      />
    </div>
  </div>
</template>
