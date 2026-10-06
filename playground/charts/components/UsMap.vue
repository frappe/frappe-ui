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
}>()

const MIN = 100
const MAX = 10000

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
      backgroundColor: props.t('surface-elevation-2'),
      borderWidth: 0,
      borderRadius: 8,
      padding: [5, 8, 5, 3],
      extraCssText:
        'box-shadow: 0 6px 12px -2px rgba(0,0,0,0.12), 0 0 6px 2px rgba(0,0,0,0.03), 0 0 1.5px rgba(0,0,0,0.15);',
      textStyle: { fontSize: 12, color: props.t('ink-gray-8') },
      formatter: (p: {
        name: string
        value: number
        data?: { full?: string }
      }) => {
        const full = fullName(p.name)
        const v = Number.isFinite(p.value)
          ? p.value.toLocaleString('en-US')
          : '—'
        return `<div style="display:flex;flex-direction:column;gap:4px;line-height:1;letter-spacing:0.02em">
          <div style="padding-left:5px;color:${props.t('ink-gray-8')}">${full}</div>
          <div style="display:flex;align-items:center;gap:2px">
            <span style="display:inline-flex;width:16px;height:16px;align-items:center;justify-content:center"><span style="width:5.5px;height:5.5px;border-radius:999px;background:${props.colors[props.colors.length - 1]}"></span></span>
            <span style="color:${props.t('ink-gray-6')};min-width:81px">Active users</span>
            <span style="color:${props.t('ink-gray-8')};font-weight:500">${v}</span>
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
        left: 16,
        right: 16,
        top: 0,
        bottom: 36,
        itemStyle: { borderColor: 'rgba(0,0,0,0.36)', borderWidth: 0.5 },
        emphasis: {
          itemStyle: { areaColor: props.t('surface-elevation-2') },
          label: {
            show: true,
            fontSize: 11,
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
</script>

<template>
  <ChartContainer :title="title">
    <div class="relative h-full w-full">
      <div ref="plotEl" class="h-full w-full" role="img" :aria-label="title" />
      <!-- the scale: 100, the pill, 10,000, and the marker over it -->
      <div
        class="pointer-events-none absolute bottom-0 left-1 flex items-center gap-1 text-[11px] leading-[1.15] text-ink-gray-5"
        aria-hidden="true"
      >
        <span>100</span>
        <span
          class="relative mx-0.5 block h-[10px] w-[102px] rounded-full"
          :style="{ background: gradient }"
        >
          <span
            class="absolute top-1/2 size-[6px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-surface-white ring-1 ring-white"
            :style="{ left: `${marker * 100}%` }"
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
