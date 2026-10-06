<script setup lang="ts">
// The file's "Pie charts" row (Figma 1GDS12ys41lxeG3wQpNq41, 1589:43577
// … 1589:43629): the plain pie, the doughnut and the half doughnut —
// the library's DonutChart for the rings — and the nested pie.
import { computed } from 'vue'
import { DonutChart } from '../../../src/charts'
import Card from '../components/Card.vue'
import PieCard from '../components/PieCard.vue'
import { slices } from '../chartData'
import type { ThemeColors } from '../useChartTheme'

const props = defineProps<{ theme: ThemeColors }>()

const pie = computed(() => props.theme.colors('pie'))
const doughnut = computed(() => props.theme.colors('doughnut'))
const half = computed(() => props.theme.colors('half'))
const rose = computed(() => props.theme.colors('rose'))

/** the file's legend names each slice by its share */
const named = slices.map((s) => ({ ...s, name: `Data (${s.share}%)` }))
const five = named.slice(0, 5)
const six = named.slice(0, 6)
const percent = (value: number) => `${value}%`
</script>

<template>
  <Card>
    <PieCard
      title="Default"
      :slices="five"
      :colors="pie"
      variant="pie"
      :t="theme.t"
    />
  </Card>
  <Card plain-legend>
    <DonutChart
      title="Doughnut Chart"
      :data="five"
      category="name"
      value="share"
      :format="percent"
      :palette="doughnut"
    >
      <template #center><span /></template>
    </DonutChart>
  </Card>
  <Card plain-legend>
    <DonutChart
      title="Doughnut Chart"
      :data="named"
      category="name"
      value="share"
      variant="half"
      :format="percent"
      :palette="half"
    >
      <template #center><span /></template>
    </DonutChart>
  </Card>
  <Card>
    <PieCard
      title="Default"
      :slices="six"
      :colors="rose"
      variant="rose"
      :t="theme.t"
    />
  </Card>
</template>
