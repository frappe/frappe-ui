<script setup lang="ts">
// The file's "Map Graph" (Figma 1GDS12ys41lxeG3wQpNq41, 1356:68047 and
// 1356:68106): the United States, each state filled from the theme's
// ramp by its active users, 100 to 10,000, behind a 0.5px rule at 36%
// black; at the bottom-left, "100", a 102×10 pill fading along the ramp,
// "10,000", and over the pill a white dot at the hovered state's value
// with that value above it; on hover the state turns white under a
// tooltip of its name and its users. The plot is echarts' map, drawn
// through the library's `useChart` inside its ChartContainer, with the
// outlines from a trimmed `us-atlas` (us-states.geo.json).
import { computed, ref, shallowRef, watchEffect } from 'vue'
import { useIsDark } from '../useChartTokens'
import { TYPE } from '../chartType'
import { MapChart as MapSeries } from 'echarts/charts'
import { TooltipComponent, VisualMapComponent } from 'echarts/components'
import { registerMap } from 'echarts/core'
import {
  ChartContainer,
  registerChartModules,
  useChart,
} from '../../../src/charts'
import { stateUsers } from '../chartData'

registerChartModules([MapSeries, TooltipComponent, VisualMapComponent])

const props = defineProps<{
  title: string
  /** the theme's ramp, low to high */
  colors: string[]
  /** a frappe-ui token, as a colour */
  t: (name: string) => string
  /**
   * The scale's shape: the file's map card draws a pill of the ramp along the
   * foot with its ends named; the dashboard's (1536:35040) stands a bare
   * 10×100 bar of it up the left edge, darkest at the top.
   */
  scale?: 'pill' | 'bar'
}>()

const MIN = 100
const MAX = 10000

const isDark = useIsDark()

/**
 * The rule between the states. The file binds it to `black overlay/300`
 * — black at 36% — and that primitive carries a Light mode only, so it
 * never flips: in dark mode a black overlay on a near-black map draws
 * nothing, and the hovered state, which turns the card's own surface,
 * lost its shape altogether. Dark takes the same overlay in white, which
 * separates the states there exactly as the black one does in light.
 */
const stateRule = computed(() =>
  isDark.value ? 'rgba(255,255,255,0.36)' : 'rgba(0,0,0,0.36)',
)

const plotEl = ref<HTMLElement>()
const ready = shallowRef(false)
const hovered = ref<{ abbr: string; name: string; value: number } | null>(null)

/** the outlines, fetched once and registered under one name */
const geo = import('../us-states.geo.json').then((m) => {
  const json = (m as unknown as { default: unknown }).default ?? m
  registerMap('USA', json as never, {
    AK: { left: -131, top: 25, width: 15 },
    HI: { left: -110, top: 28, width: 5 },
  })
  ready.value = true
})
void geo

const data = computed(() =>
  Object.entries(stateUsers).map(([abbr, value]) => ({ name: abbr, value })),
)

const option = computed(() => {
  if (!ready.value) return undefined
  return {
    animation: false,
    tooltip: {
      show: true,
      trigger: 'item',
      confine: true,
      // the tooltip stands a tone above the card rather than on its level:
      // both elevations are white in light, so this only parts the two in
      // dark, where the card is 0.26 and the tooltip 0.341
      backgroundColor: props.t('surface-elevation-3'),
      borderWidth: 0,
      borderRadius: 8,
      padding: [5, 8, 5, 3],
      // the file's box (1356:66558): 135 across, the name filling the row so
      // the number stands against the right edge, as ChartTip lays it out
      extraCssText:
        'min-width: 135px; box-sizing: border-box; box-shadow: 0 6px 12px -2px rgba(0,0,0,0.12), 0 0 6px 2px rgba(0,0,0,0.03), 0 0 1.5px rgba(0,0,0,0.15);',
      textStyle: { fontSize: TYPE.xs, color: props.t('ink-gray-8') },
      formatter: (p: {
        name: string
        value: number
        color?: string
        data?: { full?: string }
      }) => {
        const full = fullName(p.name)
        const v = Number.isFinite(p.value)
          ? p.value.toLocaleString('en-US')
          : '—'
        // The dot reads the state off the map: the file fills it from the
        // ramp (1356:68106's dot is Ocean/B-900, not a brand blue), and
        // echarts hands the formatter the colour the visual map actually
        // gave this state — so the dot is that state's own step, not the
        // ramp's end. A state the map could not colour keeps the darkest.
        const dot = p.color || props.colors[props.colors.length - 1]
        // echarts drops this straight into the document, so the scale's own
        // classes reach it — `text-xs` is the 12px the file sets these rows
        // in and carries its tracking with it, and `leading-none` is the flat
        // line the file's tooltip rows stand on.
        return `<div class="text-xs leading-none" style="display:flex;flex-direction:column;gap:4px">
          <div style="padding-left:5px;color:${props.t('ink-gray-8')}">${full}</div>
          <div style="display:flex;align-items:center;gap:2px;width:100%">
            <span style="display:inline-flex;flex-shrink:0;width:16px;height:16px;align-items:center;justify-content:center"><span style="width:5.5px;height:5.5px;border-radius:999px;background:${dot}"></span></span>
            <span style="color:${props.t('ink-gray-6')};flex:1;min-width:0;margin-right:4px">Active users</span>
            <span class="text-xs-medium leading-none" style="color:${props.t('ink-gray-8')}">${v}</span>
          </div>
        </div>`
      },
    },
    visualMap: {
      show: false,
      min: MIN,
      max: MAX,
      inRange: { color: props.colors },
    },
    series: [
      {
        type: 'map',
        map: 'USA',
        nameProperty: 'abbr',
        roam: false,
        // The file gives the map about three quarters of the card's width and
        // keeps the rest as air — 429.9 across a 580 card, opening at 75
        // (1356:68047) — where echarts would otherwise run it to the plot's
        // edges. The plot is the card less its 16 padding, so an eleventh off
        // each side lands the map on the file's share at this card's size.
        left: '11%',
        right: '11%',
        // and it opens a little under the title rather than against it: the
        // file leaves 17 between the two on a 360 card.
        top: 20,
        bottom: 36,
        itemStyle: { borderColor: stateRule.value, borderWidth: 0.5 },
        emphasis: {
          itemStyle: { areaColor: props.t('surface-elevation-2') },
          label: {
            show: true,
            fontSize: TYPE['2xs'],
            color: props.t('ink-gray-7'),
            formatter: (p: { name: string }) => p.name,
          },
        },
        select: { disabled: true },
        data: data.value,
      },
    ],
  }
})

const names = shallowRef<Record<string, string>>({})
watchEffect(() => {
  if (!ready.value) return
  import('../us-states.geo.json').then((m) => {
    const json = ((m as unknown as { default: unknown }).default ?? m) as {
      features: Array<{ properties: { name: string; abbr: string } }>
    }
    const map: Record<string, string> = {}
    for (const f of json.features) map[f.properties.abbr] = f.properties.name
    names.value = map
  })
})
const fullName = (abbr: string) => names.value[abbr] ?? abbr

useChart({
  container: plotEl,
  option: () => option.value,
  events: {
    mouseover: (p: { name: string; value: number }) => {
      if (p?.name)
        hovered.value = { abbr: p.name, name: fullName(p.name), value: p.value }
    },
    mouseout: () => (hovered.value = null),
  },
})

/** where the hovered value sits on the pill, as a share */
const marker = computed(() => {
  const value = hovered.value?.value ?? 5433
  return Math.min(1, Math.max(0, (value - MIN) / (MAX - MIN)))
})
const gradient = computed(
  () => `linear-gradient(to right, ${props.colors.join(', ')})`,
)
const barGradient = computed(
  () => `linear-gradient(to top, ${props.colors.join(', ')})`,
)
</script>

<template>
  <ChartContainer :title="title">
    <div class="relative h-full w-full">
      <div ref="plotEl" class="h-full w-full" role="img" :aria-label="title" />
      <span
        v-if="scale === 'bar'"
        class="pointer-events-none absolute bottom-[14px] left-[14px] block h-[100px] w-[10px] rounded-full"
        :style="{ background: barGradient }"
        aria-hidden="true"
      />
      <!-- the scale: 100, the pill, 10,000, and the marker over it -->
      <div
        v-else
        class="pointer-events-none absolute bottom-0 left-1 flex items-center gap-1 text-2xs leading-tighter text-ink-gray-5"
        aria-hidden="true"
      >
        <span>100</span>
        <span
          class="relative mx-0.5 block h-[10px] w-[102px] rounded-full"
          :style="{ background: gradient }"
        >
          <!-- The file's marker is a filled 6px dot, not a ring. Its fill is
               surface/white, which on this page is the elevation the hovered
               state turns — the card's own surface, so it holds in dark mode. -->
          <span
            class="absolute top-1/2 size-[6px] -translate-x-1/2 -translate-y-1/2 rounded-full"
            :style="{
              left: `${marker * 100}%`,
              background: t('surface-elevation-2'),
            }"
          />
          <span
            class="absolute -top-4 -translate-x-1/2 whitespace-nowrap"
            :style="{ left: `${marker * 100}%` }"
          >
            {{ (hovered?.value ?? 5433).toLocaleString('en-US') }}
          </span>
        </span>
        <span>10,000</span>
      </div>
    </div>
  </ChartContainer>
</template>
