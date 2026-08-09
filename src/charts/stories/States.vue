<script setup lang="ts">
// Every state on screen at once: the same tile drawn as loading, error, empty
// and ready, so the reader compares them instead of toggling between them.
import { computed, ref } from 'vue'
import { Switch } from 'frappe-ui'
import {
  BarChart,
  DonutChart,
  FunnelChart,
  HeatmapChart,
  NumberCard,
} from 'frappe-ui/charts'

const tickets = [
  { day: 'Mon', received: 128 },
  { day: 'Tue', received: 146 },
  { day: 'Wed', received: 137 },
  { day: 'Thu', received: 152 },
  { day: 'Fri', received: 119 },
]
const channels = [
  { channel: 'Email', tickets: 342 },
  { channel: 'Chat', tickets: 218 },
  { channel: 'Phone', tickets: 122 },
]
const load = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].flatMap((day, dayIndex) =>
  ['Morning', 'Evening'].map((shift, shiftIndex) => ({
    day,
    shift,
    tickets: 20 + dayIndex * 9 + shiftIndex * 14,
  })),
)

const failed = 'Report timed out after 30s'

const rtl = ref(false)
const dir = computed(() => (rtl.value ? 'rtl' : 'ltr') as 'rtl' | 'ltr')

const card =
  'flex min-w-0 flex-col rounded-4 border border-outline-gray-1 bg-surface-elevation-2 px-4 py-3'
const caption = 'text-p-sm text-ink-gray-5'
</script>

<template>
  <!-- dir on the wrapper mirrors the grid flow too, so in RTL the tiles read
       right-to-left instead of only the charts flipping internally. -->
  <div :dir="dir" class="flex w-full flex-col gap-4">
    <header class="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 class="text-xl-semibold text-ink-gray-9">Support desk</h2>
        <p :class="caption">Every tile in a different state</p>
      </div>
      <Switch v-model="rtl" label="RTL" size="sm" />
    </header>

    <!-- echarts reads direction at init, so remount the tiles when it flips. -->
    <div :key="dir" class="flex flex-col gap-4">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <NumberCard :dir="dir" title="Loading" :value="1284" loading />
        <NumberCard :dir="dir" title="Error" :value="1284" :error="failed" />
        <NumberCard :dir="dir" title="Empty" :value="null" />
        <NumberCard
          :dir="dir"
          title="Ready"
          :value="1284"
          :delta="6.2"
          delta-suffix="%"
          delta-caption="vs last week"
        />
      </div>

      <!-- One family per state: the overlay is the container's, so a loading
           donut and a loading heatmap are the same picture. -->
      <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <section :class="[card, 'h-72']">
          <BarChart
            :dir="dir"
            :data="tickets"
            x="day"
            y="received"
            title="Loading"
            subtitle="BarChart"
            loading
          />
        </section>

        <section :class="[card, 'h-72']">
          <DonutChart
            :dir="dir"
            :data="channels"
            category="channel"
            value="tickets"
            title="Error"
            subtitle="DonutChart"
            :error="failed"
          />
        </section>

        <section :class="[card, 'h-72']">
          <FunnelChart
            :dir="dir"
            :data="[]"
            category="stage"
            value="count"
            title="Empty"
            subtitle="FunnelChart"
          />
        </section>

        <section :class="[card, 'h-72']">
          <HeatmapChart
            :dir="dir"
            :data="load"
            x="day"
            y="shift"
            value="tickets"
            title="Ready"
            subtitle="HeatmapChart"
          />
        </section>
      </div>
    </div>
  </div>
</template>
