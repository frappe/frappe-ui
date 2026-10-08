<script setup lang="ts">
// The dashboard's "Horizontal stacked bar chart" (Figma
// 1GDS12ys41lxeG3wQpNq41, 1536:35040): one bar across the card, 20 tall
// under the title, cut into eight stages 2 apart on a 4px corner, each as
// wide as its share; the stages named under it in the library's legend,
// which takes one off the bar and gives the rest its room. A bar this plain
// is a row of boxes rather than a chart: echarts would spend an axis and a
// grid on it and still not round each piece.
import { computed, ref } from 'vue'
import { ChartContainer, ChartLegend } from '../../../src/charts'

const props = defineProps<{
  title: string
  /** in the order the bar runs; `legend` is where the legend names it */
  shares: Array<{ name: string; value: number; legend: number }>
  /** in the legend's order */
  colors: string[]
}>()

const hidden = ref<string[]>([])
const color = (legend: number) => props.colors[legend % props.colors.length]

const shown = computed(() =>
  props.shares.filter((s) => !hidden.value.includes(s.name)),
)
const total = computed(() => shown.value.reduce((sum, s) => sum + s.value, 0))
const pct = (value: number) =>
  total.value ? Math.round((value / total.value) * 1000) / 10 : 0

const items = computed(() =>
  [...props.shares]
    .sort((a, b) => a.legend - b.legend)
    .map((s) => ({
      name: s.name,
      label: s.name,
      color: color(s.legend),
      hidden: hidden.value.includes(s.name),
    })),
)

function toggle(name: string) {
  hidden.value = hidden.value.includes(name)
    ? hidden.value.filter((n) => n !== name)
    : [...hidden.value, name]
}
</script>

<template>
  <ChartContainer :title="title">
    <div class="h-full w-full pt-[11px]">
      <div class="flex h-5 w-full gap-0.5" role="img" :aria-label="title">
        <span
          v-for="s in shown"
          :key="s.name"
          class="h-full rounded-[4px] transition-[flex-grow] duration-300"
          :style="{
            flexGrow: s.value,
            flexBasis: 0,
            background: color(s.legend),
          }"
          :title="`${s.name}: ${pct(s.value)}%`"
        />
      </div>
    </div>
    <template #legend>
      <ChartLegend :items="items" @change="toggle" />
    </template>
  </ChartContainer>
</template>
