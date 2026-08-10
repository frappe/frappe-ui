<template>
  <ChartContainer
    :title="title"
    :subtitle="subtitle"
    :loading="loading"
    :error="error"
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
      <div ref="root" class="relative flex h-full w-full flex-col">
        <!-- Drawn first so the columns paint over it: the tint belongs behind
             the shapes, not on top of them. -->
        <div
          class="pointer-events-none absolute inset-0 grid"
          :style="gridStyle"
          aria-hidden="true"
        >
          <div
            v-for="stage in stages"
            :key="stage.index"
            class="border-outline-gray-1 transition-colors"
            :class="[
              stage.index > 0 && 'border-s',
              hovered === stage.index && 'bg-surface-gray-1',
            ]"
          />
        </div>

        <div class="relative mb-4 grid" :style="gridStyle">
          <div
            v-for="stage in stages"
            :key="stage.index"
            class="min-w-0"
            :class="stage.index === 0 ? 'pe-3' : 'px-3'"
          >
            <div class="truncate text-p-sm text-ink-gray-5">
              {{ stage.label }}
            </div>
            <div
              class="truncate text-base-semibold tabular-nums text-ink-gray-8"
            >
              {{ formatMeasure(stage.value) }}
            </div>
            <!-- Nothing to convert from at the top of the funnel: printing
                 "100%" there states a tautology. -->
            <div
              v-if="showPercentages && stage.index > 0"
              class="truncate text-xs tabular-nums text-ink-gray-5"
            >
              {{ formatPercent(stage.percentOfFirst) }}
            </div>
          </div>
        </div>

        <!-- The shapes run to the bottom edge, so the silhouette bleeds into
             the card the way the KPI card's sparkline does. -->
        <div class="relative min-h-0 flex-1">
          <svg
            class="absolute inset-0 h-full w-full"
            :viewBox="`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`"
            preserveAspectRatio="none"
            aria-hidden="true"
            focusable="false"
          >
            <path
              v-for="shape in shapes"
              :key="shape.index"
              :d="shape.d"
              :fill="colors[shape.index]"
            />
          </svg>
        </div>

        <!-- One hit area per column, over the whole height: the reader points at
             a stage, not at the few pixels its shape happens to occupy. -->
        <div class="absolute inset-0 grid" :style="gridStyle">
          <button
            v-for="stage in stages"
            :key="stage.index"
            type="button"
            :aria-label="`${stage.label}, ${formatMeasure(stage.value)}`"
            @mouseenter="hover(stage, $event)"
            @mousemove="track($event)"
            @mouseleave="clearHover"
            @focus="focusStage(stage, $event)"
            @blur="clearHover"
            @click="
              emit('select', {
                label: stage.label,
                value: stage.value,
                index: stage.index,
                row: stage.row,
              })
            "
          />
        </div>
      </div>

      <ChartTooltip
        :open="tooltip.open"
        :x="tooltip.x"
        :y="tooltip.y"
        :label="tooltip.label"
        :items="tooltip.items"
        :dir="dir"
      >
        <template #default="slotProps">
          <slot name="tooltip" v-bind="slotProps" :stage="hoveredStage">
            <div class="mb-2 text-p-sm text-ink-gray-5">
              {{ slotProps.label }}
            </div>
            <div class="flex flex-col gap-1.5 text-p-sm">
              <div
                v-for="item in slotProps.items"
                :key="item.name"
                class="flex items-center justify-between gap-5"
              >
                <span class="flex min-w-0 items-center gap-2">
                  <span
                    class="size-2 shrink-0 rounded-1"
                    :style="{ backgroundColor: item.color }"
                  />
                  <span class="truncate text-ink-gray-6">{{ item.label }}</span>
                </span>
                <span
                  class="shrink-0 text-p-sm-semibold tabular-nums text-ink-gray-8"
                >
                  {{ item.formattedValue }}
                </span>
              </div>
              <!-- Indented to the swatch column so the two rates read as notes
                   on the value above rather than as values of their own. -->
              <div
                v-for="rate in tooltip.rates"
                :key="rate.label"
                class="flex items-center justify-between gap-5 ps-4"
              >
                <span class="truncate text-ink-gray-5">{{ rate.label }}</span>
                <span class="shrink-0 tabular-nums text-ink-gray-6">
                  {{ rate.value }}
                </span>
              </div>
            </div>
          </slot>
        </template>
      </ChartTooltip>
    </template>
  </ChartContainer>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { formatLabel, formatPercent, formatValue } from './format'
import { buildFunnelStages, funnelShapes } from './funnelGeometry'
import { chartColors, useChartTokens } from './tokens'
import { documentDir } from './utils'
import ChartContainer from './components/ChartContainer.vue'
import ChartTooltip from './components/ChartTooltip.vue'
import type {
  ChartPaletteName,
  ChartTooltipItem,
  FunnelChartConfig,
  FunnelChartEmits,
  FunnelChartProps,
  FunnelChartSlots,
  FunnelStage,
} from './types'

// Segmented columns rather than a centered cone: the shapes read as one
// descending silhouette while the labels stay on a straight baseline. No
// echarts — the geometry is a division per stage, see funnelGeometry.ts.

const props = withDefaults(defineProps<FunnelChartProps>(), {
  showPercentages: true,
})

const emit = defineEmits<FunnelChartEmits>()

defineSlots<FunnelChartSlots>()

const root = ref<HTMLElement>()
const dir = computed(() => props.dir ?? documentDir())

const config = computed<FunnelChartConfig>(() => ({
  data: props.data,
  categoryColumn: props.category,
  valueColumn: props.value,
  showPercentages: props.showPercentages,
  palette: props.palette,
  dir: dir.value,
}))

const stages = computed(() => buildFunnelStages(config.value))
const isEmpty = computed(() => !stages.value.length)

const gridStyle = computed(() => ({
  gridTemplateColumns: `repeat(${Math.max(1, stages.value.length)}, minmax(0, 1fr))`,
}))

// `preserveAspectRatio="none"` makes both units arbitrary, so the silhouette is
// computed once and resizes with the card without an observer.
const VIEW_WIDTH = 1000
const VIEW_HEIGHT = 100

const shapes = computed(() =>
  funnelShapes(
    stages.value.map((stage) => stage.value),
    { width: VIEW_WIDTH, height: VIEW_HEIGHT, dir: dir.value },
  ),
)

const { tokens } = useChartTokens(root)

const FUNNEL_PALETTE: ChartPaletteName = 'sequential'

/** Palest first, deepest last, so the color darkens as the population narrows. */
const colors = computed(() =>
  chartColors(props.palette, tokens.value, {
    fallback: FUNNEL_PALETTE,
    count: stages.value.length,
    deepEnd: 'last',
  }),
)

const hovered = ref<number | null>(null)
const hoveredStage = computed(() =>
  hovered.value === null ? undefined : stages.value[hovered.value],
)

const tooltip = reactive({
  open: false,
  x: 0,
  y: 0,
  label: '' as string | undefined,
  items: [] as ChartTooltipItem[],
  rates: [] as { label: string; value: string }[],
})

function hover(stage: FunnelStage, event: MouseEvent) {
  readStage(stage)
  track(event)
  tooltip.open = true
}

// A keyboard reader has no pointer to anchor the tooltip to, so it hangs off the
// bottom of the stage's own hit area.
function focusStage(stage: FunnelStage, event: FocusEvent) {
  readStage(stage)
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
  tooltip.x = rect.left + rect.width / 2
  tooltip.y = rect.bottom
  tooltip.open = true
}

function readStage(stage: FunnelStage) {
  hovered.value = stage.index
  tooltip.label = stage.label
  tooltip.items = [
    {
      name: String(stage.index),
      label: formatLabel(props.value),
      color: colors.value[stage.index],
      value: stage.value,
      formattedValue: formatMeasure(stage.value),
    },
  ]
  tooltip.rates = [
    {
      label: `of ${stages.value[0]?.label ?? ''}`,
      value: formatPercent(stage.percentOfFirst),
    },
  ]
  // The first stage has no predecessor, and the second one's predecessor *is*
  // the first stage — printing that rate again would repeat the line above it.
  if (stage.index > 1) {
    tooltip.rates.push({
      label: `of ${stages.value[stage.index - 1].label}`,
      value: formatPercent(stage.percentOfPrevious),
    })
  }
}

function formatMeasure(value: number) {
  return props.format ? props.format(value) : formatValue(value)
}

function track(event: MouseEvent) {
  tooltip.x = event.clientX
  tooltip.y = event.clientY
}

function clearHover() {
  hovered.value = null
  tooltip.open = false
}
</script>
