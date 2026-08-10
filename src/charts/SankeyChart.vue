<template>
  <ChartContainer
    :title="title"
    :subtitle="subtitle"
    :loading="loading"
    :error="error || renderError"
    :empty="isEmpty"
    :dir="dir"
  >
    <template v-if="$slots.actions" #actions><slot name="actions" /></template>

    <!-- The container owns the three states, so an app that wants a retry
         button beside the message or a skeleton of its own reaches them here
         rather than dropping the chart and rebuilding the chrome. -->
    <template v-if="$slots.loading" #loading><slot name="loading" /></template>
    <template v-if="$slots.error" #error="slotProps">
      <slot name="error" v-bind="slotProps" />
    </template>
    <template v-if="$slots.empty" #empty><slot name="empty" /></template>

    <template #default>
      <div
        ref="plotEl"
        class="h-full w-full rounded-2 focus-visible:focus-ring"
        dir="ltr"
        role="img"
        :aria-label="chartAriaLabel(title, subtitle)"
        v-bind="plotAttrs"
      />

      <!-- The tooltip hangs off the pointer, which a reader walking the bands
           with the arrow keys has not got. The same reading in text. -->
      <span class="sr-only" role="status">{{ reading }}</span>

      <ChartTooltip
        :open="tooltip.open"
        :x="tooltip.x"
        :y="tooltip.y"
        :label="tooltip.label"
        :items="tooltip.items"
        :dir="dir"
      >
        <template v-if="$slots.tooltip" #default="slotProps">
          <slot name="tooltip" v-bind="slotProps" />
        </template>
      </ChartTooltip>
    </template>
  </ChartContainer>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { SankeyChart as SankeySeries } from 'echarts/charts'
import { registerChartModules, useChart } from './core/useChart'
import { usePlotKeyboard } from './core/usePlotKeyboard'
import { buildSankeyGraph, buildSankeyOption } from './sankeyOptions'
import { formatLabel, formatValue } from './format'
import { useChartTokens } from './tokens'
import {
  chartAriaLabel,
  documentDir,
  elementCenter,
  plotReading,
} from './utils'
import ChartContainer from './components/ChartContainer.vue'
import ChartTooltip from './components/ChartTooltip.vue'
import type {
  ChartExposed,
  ChartTooltipItem,
  SankeyChartConfig,
  SankeyChartEmits,
  SankeyChartProps,
  SankeyChartSlots,
} from './types'

// The series is all a sankey needs: it lays itself out, so there is no grid and
// no axis, and no tooltip component either (see buildSankeyOption).
registerChartModules([SankeySeries])

const props = defineProps<SankeyChartProps>()

const emit = defineEmits<SankeyChartEmits>()

defineSlots<SankeyChartSlots>()

const plotEl = ref<HTMLElement>()

const dir = computed(() => props.dir ?? documentDir())

const config = computed<SankeyChartConfig>(() => ({
  data: props.data,
  sourceColumn: props.source,
  targetColumn: props.target,
  valueColumn: props.value,
  orient: props.orient,
  nodeAlign: props.nodeAlign,
  palette: props.palette,
  echartOptions: props.echartOptions,
}))

const { tokens } = useChartTokens(plotEl)

const graph = computed(() =>
  buildSankeyGraph(config.value, { tokens: tokens.value }),
)

// A graph whose every flow is zero has bands of no width and nodes of no
// height, which draws as an empty plot rather than as a chart.
const isEmpty = computed(
  () => !graph.value.links.some((link) => link.value > 0),
)

// A malformed config throws while building the option; surfacing it as an error
// state beats letting it bubble out of a render and blank the whole page.
const built = computed(() => {
  try {
    return {
      option: buildSankeyOption(config.value, {
        tokens: tokens.value,
        format: props.format,
      }),
      error: null as string | null,
    }
  } catch (e: any) {
    return { option: undefined, error: e?.message ?? String(e) }
  }
})

const renderError = computed(() => built.value.error)

/**
 * Last pointer position, kept from zrender's own mousemove. The `mouseover`
 * payload carries no viewport coordinates across every echarts version, and the
 * tooltip needs them the moment a band is entered.
 */
const pointer = reactive({ x: 0, y: 0 })

const tooltip = reactive({
  open: false,
  x: 0,
  y: 0,
  label: undefined as string | undefined,
  items: [] as ChartTooltipItem[],
})

const { chart, dispatch } = useChart({
  container: plotEl,
  option: () => built.value.option,
  events: {
    mouseover: (params: any) => showTooltip(params),
    mouseout: () => (tooltip.open = false),
    click: (params: any) => {
      const link = linkAt(params)
      if (!link) return
      emit('select', {
        source: link.source,
        target: link.target,
        value: link.value,
        row: link.row,
      })
    },
  },
  onZrEvents: {
    mousemove: (e: any) => {
      pointer.x = e.event?.clientX ?? pointer.x
      pointer.y = e.event?.clientY ?? pointer.y
      if (tooltip.open) {
        tooltip.x = pointer.x
        tooltip.y = pointer.y
      }
    },
    globalout: () => (tooltip.open = false),
  },
})

/** echarts addresses nodes and links in separate lists, hence `dataType`. */
function linkAt(params: any) {
  if (params?.dataType !== 'edge') return undefined
  return graph.value.links[params.dataIndex]
}

function showTooltip(params: any) {
  const reading = readingAt(params)
  if (!reading) {
    tooltip.open = false
    return
  }
  showReading(reading, pointer.x, pointer.y)
}

type SankeyReading = { label: string; color: string; value: number }

function showReading(reading: SankeyReading, x: number, y: number) {
  tooltip.label = reading.label
  tooltip.items = [
    {
      name: reading.label,
      label: formatLabel(props.value),
      color: reading.color,
      value: reading.value,
      formattedValue: props.format
        ? props.format(reading.value)
        : formatValue(reading.value),
    },
  ]
  tooltip.x = x
  tooltip.y = y
  tooltip.open = true
}

/**
 * What the pointer is over, as one line of tooltip. A band heads the tooltip
 * with the flow it carries; a node with its own name, the way an axis chart
 * heads one with the x value.
 */
function readingAt(params: any) {
  const link = linkAt(params)
  if (link) {
    return {
      label: `${link.source} → ${link.target}`,
      color: link.color,
      value: link.value,
    }
  }

  const node = graph.value.nodes[params?.dataIndex]
  if (params?.dataType !== 'node' || !node) return undefined
  return { label: node.name, color: node.color, value: node.value }
}

// The flow is one tab stop and the arrow keys walk its bands: an echarts plot
// draws into a single element, so there are no per-band nodes to tab through.
// Bands only — a node is the sum of everything through it, and `select` is
// the only event a click can raise either.
const reading = ref('')

function readLink(index: number) {
  const link = graph.value.links[index]
  if (!link) return
  const center = elementCenter(plotEl.value)
  const label = `${link.source} → ${link.target}`
  dispatch({
    type: 'highlight',
    seriesIndex: 0,
    dataType: 'edge',
    dataIndex: index,
  })
  showReading(
    { label, color: link.color, value: link.value },
    center?.x ?? pointer.x,
    center?.y ?? pointer.y,
  )
  reading.value = plotReading(
    label,
    tooltip.items.map((item) => ({
      label: item.label,
      value: item.formattedValue,
    })),
  )
}

/** Takes the emphasis off the link the cursor has left. */
function downplayLink(index: number | null) {
  if (index === null) return
  dispatch({
    type: 'downplay',
    seriesIndex: 0,
    dataType: 'edge',
    dataIndex: index,
  })
}

const keyboard = usePlotKeyboard({
  marks: () => graph.value.links,
  // The two ends name the band: a refetch that rebuilds the rows still draws
  // the same flow between the same nodes.
  key: (link) => `${link.source} ${link.target}`,
  move: (index, previous) => {
    downplayLink(previous)
    readLink(index)
  },
  activate: (index) => {
    const link = graph.value.links[index]
    if (!link) return
    emit('select', {
      source: link.source,
      target: link.target,
      value: link.value,
      row: link.row,
    })
  },
  clear: (previous) => {
    downplayLink(previous)
    tooltip.open = false
    reading.value = ''
  },
})

const plotAttrs = keyboard.attrs

defineExpose<ChartExposed>({ chart: computed(() => chart.value) })
</script>
