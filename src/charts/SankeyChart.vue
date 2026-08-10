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
        class="h-full w-full"
        dir="ltr"
        role="img"
        :aria-label="chartAriaLabel(title, subtitle)"
      />

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
import { buildSankeyGraph, buildSankeyOption } from './sankeyOptions'
import { formatLabel, formatValue } from './format'
import { useChartTheme } from './theme'
import { chartAriaLabel, documentDir } from './utils'
import ChartContainer from './components/ChartContainer.vue'
import ChartTooltip from './components/ChartTooltip.vue'
import type {
  ChartExposed,
  ChartTooltipItem,
  SankeyChartConfig,
  SankeyChartProps,
  SankeyLinkEvent,
} from './types'

// The series is all a sankey needs: it lays itself out, so there is no grid and
// no axis, and no tooltip component either (see buildSankeyOption).
registerChartModules([SankeySeries])

const props = defineProps<SankeyChartProps>()

const emit = defineEmits<{
  linkClick: [event: SankeyLinkEvent]
}>()

defineSlots<{
  actions?: () => unknown
  tooltip?: (props: { label?: string; items: ChartTooltipItem[] }) => unknown
  /** Replaces the whole placeholder, e.g. with a skeleton of the app's own. */
  loading?: () => unknown
  /** Replaces the message, e.g. to put a retry button beside it. */
  error?: (props: { error?: string | null }) => unknown
  /** Replaces the "no data" line, e.g. with a hint about the filters. */
  empty?: () => unknown
}>()

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

const { theme } = useChartTheme(plotEl)

const graph = computed(() =>
  buildSankeyGraph(config.value, { theme: theme.value }),
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
        theme: theme.value,
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

const { chart } = useChart({
  container: plotEl,
  option: () => built.value.option,
  events: {
    mouseover: (params: any) => showTooltip(params),
    mouseout: () => (tooltip.open = false),
    click: (params: any) => {
      const link = linkAt(params)
      if (!link) return
      emit('linkClick', {
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
  tooltip.x = pointer.x
  tooltip.y = pointer.y
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

defineExpose<ChartExposed>({ chart: computed(() => chart.value) })
</script>
