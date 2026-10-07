<script setup lang="ts">
// The file's "Pie charts" row (Figma 1GDS12ys41lxeG3wQpNq41, 1589:43577
// … 1589:43629): the plain pie, the ring, the half ring and the nested pie.
// All four go through PieCard — see its header for why none of them can be
// the library's own DonutChart.
import { computed } from 'vue'
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

/**
 * The half ring's eight arcs, as 1589:43605 places them: the ramp step each one
 * carries and the angle it sweeps, running from 9 o'clock round to 3. The file
 * draws them by hand and neither figure follows its own legend — one arc takes
 * 40% of the ring where its label says 14, and the ramp jumps about the arc
 * (B-300, B-200, B-600, B-500, B-900, B-700, B-800, B-400) while the legend
 * below runs the ramp in order. Sized from the data the card came out evenly
 * stepped where the file's is lopsided, so the plot takes the file's arcs and
 * the legend keeps the data's names, the way the funnel's columns do. Degrees,
 * from the node's radians.
 */
const HALF_ARCS = [
  { step: 0, sweep: 28.0754 },
  { step: 7, sweep: 7.3407 },
  { step: 3, sweep: 8.4942 },
  { step: 2, sweep: 69.4755 },
  { step: 6, sweep: 8.7387 },
  { step: 4, sweep: 10.9314 },
  { step: 5, sweep: 27.0674 },
  { step: 1, sweep: 11.3996 },
]
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
