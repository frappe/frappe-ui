<script setup lang="ts">
import { computed, ref } from 'vue'
import { RadarChart } from 'echarts/charts'
import { RadarComponent } from 'echarts/components'
import {
  ChartCard,
  ChartContainer,
  ChartLegend,
  paletteColors,
  registerChartModules,
  useChart,
  useChartTokens,
} from 'frappe-ui/charts'
import type { ChartLegendItem } from 'frappe-ui/charts'

// frappe-ui ships no radar chart, so this file draws the plot itself. Only the
// echarts modules it needs, the same way every built-in chart registers its own.
registerChartModules([RadarChart, RadarComponent])

const CRITERIA = [
  'Onboarding',
  'Support',
  'Reliability',
  'Value',
  'Documentation',
  'Speed',
]

const PLANS = [
  { name: 'Starter', scores: [72, 64, 81, 88, 60, 76] },
  { name: 'Business', scores: [86, 83, 90, 71, 78, 84] },
]

const plotEl = ref<HTMLElement>()
const { tokens } = useChartTokens(plotEl)

const hidden = ref<string[]>([])
const colors = computed(() =>
  paletteColors('categorical', tokens.value, PLANS.length),
)

const legendItems = computed<ChartLegendItem[]>(() =>
  PLANS.map((plan, index) => ({
    name: plan.name,
    label: plan.name,
    color: colors.value[index],
    hidden: hidden.value.includes(plan.name),
  })),
)

const option = computed(() => ({
  // Plot-area colors come off the theme, so the radar reads like the axes of a
  // built-in chart and follows a theme switch with them.
  radar: {
    indicator: CRITERIA.map((name) => ({ name, max: 100 })),
    radius: '62%',
    axisName: { color: tokens.value.axisLabel, fontSize: 11 },
    axisLine: { lineStyle: { color: tokens.value.splitLine } },
    splitLine: { lineStyle: { color: tokens.value.splitLine, type: 'dashed' } },
    splitArea: { show: false },
  },
  series: [
    {
      type: 'radar',
      symbolSize: 4,
      data: PLANS.filter((plan) => !hidden.value.includes(plan.name)).map(
        (plan) => ({
          name: plan.name,
          value: plan.scores,
          itemStyle: {
            color: colors.value[PLANS.findIndex((p) => p.name === plan.name)],
          },
          areaStyle: { opacity: 0.12 },
        }),
      ),
    },
  ],
}))

useChart({ container: plotEl, option: () => option.value })

function toggle(name: string) {
  hidden.value = hidden.value.includes(name)
    ? hidden.value.filter((plan) => plan !== name)
    : [...hidden.value, name]
}
</script>

<template>
  <ChartCard class="h-96">
    <ChartContainer
      title="Plan satisfaction"
      subtitle="Average score per criterion, out of 100"
    >
      <div ref="plotEl" class="h-full w-full" />
      <template #legend>
        <ChartLegend :items="legendItems" @change="toggle" />
      </template>
    </ChartContainer>
  </ChartCard>
</template>
