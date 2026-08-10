<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import {
  ChartCard,
  ChartContainer,
  ChartTooltip,
  paletteColors,
  useChartTokens,
} from 'frappe-ui/charts'
import type { ChartTooltipItem } from 'frappe-ui/charts'

// A plot drawn in plain HTML, to show that ChartTooltip is driven by props
// rather than by echarts. Any plot that can report a pointer position and a row
// can open the same tooltip the built-in charts draw.
const REGIONS = [
  { region: 'India', signups: 4820, trials: 1240 },
  { region: 'Europe', signups: 3610, trials: 980 },
  { region: 'North America', signups: 2970, trials: 810 },
  { region: 'Southeast Asia', signups: 1840, trials: 470 },
]

const MAX = Math.max(...REGIONS.map((row) => row.signups))

const plotEl = ref<HTMLElement>()
const { tokens } = useChartTokens(plotEl)
const colors = computed(() => paletteColors('categorical', tokens.value, 2))

const tooltip = reactive({
  open: false,
  x: 0,
  y: 0,
  label: '' as string | undefined,
  items: [] as ChartTooltipItem[],
})

function show(row: (typeof REGIONS)[number], event: MouseEvent) {
  tooltip.label = row.region
  tooltip.items = [
    {
      name: 'signups',
      label: 'Signups',
      color: colors.value[0],
      value: row.signups,
      formattedValue: row.signups.toLocaleString(),
    },
    {
      name: 'trials',
      label: 'Trials started',
      color: colors.value[1],
      value: row.trials,
      formattedValue: row.trials.toLocaleString(),
      // Part-to-whole readings carry a share, printed after the value.
      percent: (row.trials / row.signups) * 100,
    },
  ]
  // Viewport coordinates: the tooltip is teleported to the body and placed
  // against the window, so it is never clipped by the card.
  tooltip.x = event.clientX
  tooltip.y = event.clientY
  tooltip.open = true
}
</script>

<template>
  <ChartCard class="h-72">
    <ChartContainer
      title="Signups by region"
      subtitle="Hover a bar — the tooltip is a component, not a canvas overlay"
    >
      <div
        ref="plotEl"
        class="flex h-full w-full flex-col justify-center gap-2"
        @mouseleave="tooltip.open = false"
      >
        <div
          v-for="row in REGIONS"
          :key="row.region"
          class="flex items-center gap-2"
          @mousemove="show(row, $event)"
        >
          <span class="w-32 shrink-0 truncate text-p-xs text-ink-gray-5">
            {{ row.region }}
          </span>
          <span
            class="h-5 rounded-2"
            :style="{
              width: `${(row.signups / MAX) * 100}%`,
              backgroundColor: colors[0],
            }"
          />
        </div>
      </div>

      <ChartTooltip
        :open="tooltip.open"
        :x="tooltip.x"
        :y="tooltip.y"
        :label="tooltip.label"
        :items="tooltip.items"
      />
    </ChartContainer>
  </ChartCard>
</template>
