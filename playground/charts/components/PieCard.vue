<script setup lang="ts">
// The two pies the library's DonutChart does not draw (Figma
// 1GDS12ys41lxeG3wQpNq41, 1589:43577 and 1589:43629): the plain pie,
// 206 across with no hole and no gap, and the nested one, six rings of
// growing radius around a 30px hole. Drawn through the library's
// `useChart` in its ChartContainer, with its legend under the plot, so
// they read as the library's own beside the doughnuts.
import { computed, ref } from 'vue'
import { TYPE } from '../chartType'
import { PieChart as PieSeries } from 'echarts/charts'
import { TooltipComponent } from 'echarts/components'
import {
  ChartContainer,
  ChartLegend,
  registerChartModules,
  useChart,
} from '../../../src/charts'

registerChartModules([PieSeries, TooltipComponent])

const props = defineProps<{
  title: string
  slices: Array<{ name: string; share: number }>
  colors: string[]
  variant: 'pie' | 'rose'
  t: (name: string) => string
}>()

const plotEl = ref<HTMLElement>()
const hidden = ref<string[]>([])

const items = computed(() =>
  props.slices.map((s, i) => ({
    name: s.name,
    label: s.name,
    color: props.colors[i % props.colors.length],
    hidden: hidden.value.includes(s.name),
  })),
)

const option = computed(() => {
  const data = props.slices
    .filter((s) => !hidden.value.includes(s.name))
    .map((s, i) => ({
      name: s.name,
      value: s.share,
      itemStyle: {
        color: props.colors[props.slices.indexOf(s) % props.colors.length],
      },
      label: { show: false },
    }))
  return {
    animation: true,
    animationDuration: 500,
    tooltip: {
      show: true,
      trigger: 'item',
      confine: true,
      backgroundColor: props.t('surface-elevation-2'),
      borderWidth: 0,
      borderRadius: 8,
      padding: [5, 8, 5, 3],
      extraCssText:
        'box-shadow: 0 6px 12px -2px rgba(0,0,0,0.12), 0 0 6px 2px rgba(0,0,0,0.03), 0 0 1.5px rgba(0,0,0,0.15);',
      textStyle: { fontSize: TYPE.xs, color: props.t('ink-gray-8') },
      formatter: (p: { name: string; value: number; color: string }) =>
        // the scale's classes reach this: echarts puts the string in the
        // document, so the row is set in `text-xs` on the flat line the
        // file's tooltip rows stand on rather than in inline pixels
        `<div class="text-xs leading-none" style="display:flex;align-items:center;gap:2px">
          <span style="display:inline-flex;width:16px;height:16px;align-items:center;justify-content:center"><span style="width:5.5px;height:5.5px;border-radius:999px;background:${p.color}"></span></span>
          <span style="color:${props.t('ink-gray-6')};min-width:64px">${p.name}</span>
          <span class="text-xs-medium leading-none" style="color:${props.t('ink-gray-8')}">${p.value}%</span>
        </div>`,
    },
    series: [
      props.variant === 'pie'
        ? {
            type: 'pie',
            radius: ['0%', '92%'],
            center: ['50%', '50%'],
            startAngle: 0,
            clockwise: true,
            padAngle: 0,
            itemStyle: { borderWidth: 0 },
            emphasis: { scale: false },
            label: { show: false },
            labelLine: { show: false },
            data,
          }
        : {
            type: 'pie',
            roseType: 'radius',
            radius: ['12%', '96%'],
            center: ['50%', '50%'],
            startAngle: 0,
            clockwise: true,
            padAngle: 0,
            itemStyle: { borderWidth: 0 },
            emphasis: { scale: false },
            label: { show: false },
            labelLine: { show: false },
            data,
          },
    ],
  }
})

useChart({ container: plotEl, option: () => option.value })

function toggle(name: string) {
  hidden.value = hidden.value.includes(name)
    ? hidden.value.filter((n) => n !== name)
    : [...hidden.value, name]
}
</script>

<template>
  <ChartContainer :title="title">
    <div ref="plotEl" class="h-full w-full" role="img" :aria-label="title" />
    <template #legend>
      <ChartLegend :items="items" @change="toggle" />
    </template>
  </ChartContainer>
</template>
