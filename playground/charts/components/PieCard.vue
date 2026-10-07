<script setup lang="ts">
// The file's four pie cards (Figma 1GDS12ys41lxeG3wQpNq41, 1589:43577,
// 43591, 43605 and 43629): the plain pie, the ring, the half ring and the
// nested pie. All four are drawn through the library's `useChart` in its
// ChartContainer, with its legend under the plot, so they read as the
// library's own — but the geometry is the file's, not the library's
// defaults, and the slices keep the order they are given rather than being
// sorted biggest-first.
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
  variant: 'pie' | 'donut' | 'rose' | 'half'
  /**
   * The arcs the plot draws, where the file places them by hand instead of
   * reading its own numbers: the palette step each one carries and the angle
   * it sweeps, in the order they run round the arc. The legend still reads
   * `slices`, in palette order, as the file's does.
   */
  arcs?: Array<{ step: number; sweep: number }>
  t: (name: string) => string
}>()

const plotEl = ref<HTMLElement>()
const hidden = ref<string[]>([])

/**
 * The plain pie and the ring, as 1589:43577 and 1589:43591 draw them: a 206
 * circle on a 580×360 card, 187 to 393 across and 77 to 283 down, so its
 * middle is the card's own middle. echarts measures a pie against the plot —
 * the card less its padding, its title and its legend — and centres it there,
 * which filled the plot's height at 43.6% of the card where the file's is
 * 35.5, and sat high of the card's centre by half the legend. 74.8% of the
 * plot's half-height is the file's 206 at any card size, the card holding the
 * file's 580/360 so the plot scales with it, and 51.41% is where the card's
 * own centre falls inside a one-row-legend plot.
 */
const PIE_RADIUS = ['0%', '74.8%']
/** the ring's band: the file's 0.7 of the outer radius (1589:43591) */
const DONUT_RADIUS = ['52.36%', '74.8%']
const PIE_CENTER = ['50%', '51.41%']
/** the file leaves about 1.2° between the ring's arcs and rounds every end on 4 */
const DONUT_PAD = 1.2

/**
 * The half ring, as 1589:43605 draws it: a 336 arc on a 580 card, so 168 of
 * radius against the library's own, which caps a half donut on the plot's
 * height. A semicircle is twice as wide as it is tall, so that cap spends the
 * width it has — ours came out 43% of the card where the file's is 58. These
 * are percentages of the same half-minimum echarts measures from, taken past
 * 100 so the arc reaches the file's width, and the band holds the file's ratio
 * of 0.8 inner to outer. 87.48% of the plot is where the file's centre at 257
 * of 360 falls, so the arc's flat edge lands on the file's line.
 */
const HALF_RADIUS = ['107.6%', '134.5%']
const HALF_CENTER = ['50%', '87.48%']
/** the file leaves about a degree between the half ring's arcs (0.84°–1.2°) */
const HALF_PAD = 1

/**
 * The nested pie, as 1589:43629 draws it: six arcs on one centre at (290, 131)
 * of a 580×360 card, each sweeping on from where the last stopped and each on
 * a smaller radius — 129, 121, 104, 90, 78 and 60, around a hole of about 15
 * (the file's six inner fractions, 0.12 … 0.25 of their own radii, all work
 * out within half a pixel of it). What that draws is a spiral closing inwards,
 * and the radius falls by position, not by value: the file's own fourth arc is
 * its widest sweep on its fourth radius. echarts' `roseType` can only tie the
 * radius to the value, which scattered the wedges instead of nesting them, so
 * each arc is its own one-slice series here and takes its radius from the file.
 *
 * echarts reads a pie's radius as a share of the plot's half-minimum, which on
 * this card — the only one with two legend rows — is 124.95 for every 580 of
 * card width. A file radius over that is the same circle at any card size.
 */
const ROSE_RADII = [129, 121, 104, 90, 78, 60]
const ROSE_HOLE = 15.3
const ROSE_BASE = 124.95
const ROSE_CENTER = ['50%', '37.06%']
const rose = (px: number) => `${((px / ROSE_BASE) * 100).toFixed(2)}%`

const visible = computed(() =>
  props.slices.filter((s) => !hidden.value.includes(s.name)),
)

const color = (i: number) => props.colors[i % props.colors.length]

const items = computed(() =>
  props.slices.map((s, i) => ({
    name: s.name,
    label: s.name,
    color: color(i),
    hidden: hidden.value.includes(s.name),
  })),
)

/** what the legend prints against a name, which an `arcs` plot does not size by */
const shareOf = computed(
  () => new Map(props.slices.map((s) => [s.name, s.share])),
)

const data = computed(() => {
  if (props.arcs)
    return props.arcs
      .filter((a) => !hidden.value.includes(props.slices[a.step]?.name ?? ''))
      .map((a) => ({
        name: props.slices[a.step].name,
        // echarts spends the gap out of the slice rather than out of the span —
        // a sector ends up `share × span − padAngle` wide — so a weight has to
        // carry its own gap or every small arc comes up short and the big one
        // swallows the difference. Here that was 2.4° on the widest.
        value: a.sweep + HALF_PAD,
        itemStyle: { color: color(a.step) },
        label: { show: false },
      }))
  return visible.value.map((s) => ({
    name: s.name,
    value: s.share,
    itemStyle: { color: color(props.slices.indexOf(s)) },
    label: { show: false },
  }))
})

const flat = {
  clockwise: true,
  emphasis: { scale: false },
  label: { show: false },
  labelLine: { show: false },
} as const

/**
 * The nested pie's arcs, each its own series so each can carry its own radius.
 * They sweep clockwise from 3 o'clock, as the file's do, and the angles run
 * negative because echarts measures them anticlockwise.
 */
const roseSeries = computed(() => {
  const total = visible.value.reduce((sum, s) => sum + s.share, 0)
  let angle = 0
  return visible.value.map((s, i) => {
    const start = angle
    angle -= total ? (s.share / total) * 360 : 0
    return {
      type: 'pie',
      radius: [rose(ROSE_HOLE), rose(ROSE_RADII[i] ?? ROSE_RADII.at(-1)!)],
      center: ROSE_CENTER,
      startAngle: start,
      endAngle: angle,
      padAngle: 0,
      itemStyle: { borderWidth: 0 },
      ...flat,
      data: [data.value[i]],
    }
  })
})

const series = computed(() => {
  if (props.variant === 'rose') return roseSeries.value
  if (props.variant === 'half')
    return [
      {
        type: 'pie',
        radius: HALF_RADIUS,
        center: HALF_CENTER,
        // both halves sweep across the top, 9 o'clock round to 3
        startAngle: 180,
        endAngle: 0,
        // the file rounds every end on 4, its ellipses' own corner radius
        padAngle: HALF_PAD,
        itemStyle: { borderWidth: 0, borderRadius: 4 },
        ...flat,
        data: data.value,
      },
    ]
  const ring = props.variant === 'donut'
  return [
    {
      type: 'pie',
      radius: ring ? DONUT_RADIUS : PIE_RADIUS,
      center: PIE_CENTER,
      startAngle: 0,
      padAngle: ring ? DONUT_PAD : 0,
      itemStyle: ring
        ? { borderWidth: 0, borderRadius: 4 }
        : { borderWidth: 0 },
      ...flat,
      data: data.value,
    },
  ]
})

const option = computed(() => ({
  animation: true,
  animationDuration: 500,
  tooltip: {
    show: true,
    trigger: 'item',
    confine: true,
    // a tone above the card, as every tooltip on the page: the same white in
    // light, and in dark the one step that parts the box from the card
    backgroundColor: props.t('surface-elevation-3'),
    borderWidth: 0,
    borderRadius: 8,
    padding: [5, 8, 5, 3],
    // the file's box (1356:66558): 135 across at 5/8/5/3, the name filling
    // the row so the number stands against the right edge, as ChartTip lays
    // out the library's cards
    extraCssText:
      'min-width: 135px; box-sizing: border-box; box-shadow: 0 6px 12px -2px rgba(0,0,0,0.12), 0 0 6px 2px rgba(0,0,0,0.03), 0 0 1.5px rgba(0,0,0,0.15);',
    textStyle: { fontSize: TYPE.xs, color: props.t('ink-gray-8') },
    formatter: (p: { name: string; color: string }) =>
      // the scale's classes reach this: echarts puts the string in the
      // document, so the row is set in `text-xs` on the flat line the
      // file's tooltip rows stand on rather than in inline pixels
      `<div class="text-xs leading-none" style="display:flex;align-items:center;gap:2px;width:100%">
          <span style="display:inline-flex;flex-shrink:0;width:16px;height:16px;align-items:center;justify-content:center"><span style="width:5.5px;height:5.5px;border-radius:999px;background:${p.color}"></span></span>
          <span style="color:${props.t('ink-gray-6')};flex:1;min-width:0;margin-right:4px">${p.name}</span>
          <span class="text-xs-medium leading-none" style="color:${props.t('ink-gray-8')}">${shareOf.value.get(p.name)}%</span>
        </div>`,
  },
  series: series.value,
}))

useChart({ container: plotEl, option: () => option.value })

function toggle(name: string) {
  hidden.value = hidden.value.includes(name)
    ? hidden.value.filter((n) => n !== name)
    : [...hidden.value, name]
}
</script>

<template>
  <ChartContainer :title="title" :class="variant === 'rose' && 'pie-rose'">
    <div ref="plotEl" class="h-full w-full" role="img" :aria-label="title" />
    <template #legend>
      <ChartLegend :items="items" @change="toggle" />
    </template>
  </ChartContainer>
</template>

<style scoped>
/* The file breaks this legend three to a row — two rows of three, centred
   under the plot (1589:43629's "Frame 1171278973" holds them in 303 of 580).
   Given the card's full width the six ran five and one. The count is what the
   file fixes, not the width: these names are as long as their numbers, so a
   max-width that holds three of the file's would drop one of ours onto a line
   of its own the moment "17.2%" and "14%" met. Three columns says it once. */
.pie-rose :deep([data-slot='chart-legend']) {
  display: grid;
  grid-template-columns: repeat(3, auto);
  justify-content: center;
}
</style>
