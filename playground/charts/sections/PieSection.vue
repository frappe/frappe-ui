<script setup lang="ts">
// The file's "Pie charts" row (Figma 1GDS12ys41lxeG3wQpNq41, 1589:43577
// … 1589:43629): the plain pie, the ring, the half ring and the nested pie.
// All four go through PieCard — see its header for why none of them can be
// the library's own DonutChart.
import { computed } from 'vue'
import Card from '../components/Card.vue'
import PieCard from '../components/PieCard.vue'
import { HALF_ARCS, slices } from '../chartData'
import type { ThemeColors } from '../useChartTheme'

const props = defineProps<{ theme: ThemeColors }>()

const pie = computed(() => props.theme.colors('pie'))
const doughnut = computed(() => props.theme.colors('doughnut'))
const half = computed(() => props.theme.colors('half'))
const rose = computed(() => props.theme.colors('rose'))
const halfArcs = computed(() => props.theme.colors('halfArcs'))

/** the file's legend names each slice by its share */
const named = slices.map((s) => ({ ...s, name: `Data (${s.share}%)` }))
const five = named.slice(0, 5)
const six = named.slice(0, 6)
</script>

<template>
  <Card medium-title>
    <PieCard
      title="Default"
      :slices="five"
      :colors="pie"
      variant="pie"
      :t="theme.t"
    />
  </Card>
  <Card medium-title>
    <PieCard
      title="Doughnut Chart"
      :slices="five"
      :colors="doughnut"
      variant="donut"
      :t="theme.t"
    />
  </Card>
  <Card medium-title>
    <PieCard
      title="Doughnut Chart"
      :slices="named"
      :colors="half"
      :arcs="HALF_ARCS"
      :arc-colors="halfArcs"
      variant="half"
      :t="theme.t"
    />
  </Card>
  <Card medium-title>
    <PieCard
      title="Default"
      :slices="six"
      :colors="rose"
      variant="rose"
      :t="theme.t"
    />
  </Card>
</template>
