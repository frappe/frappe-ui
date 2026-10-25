<template>
  <!-- `text-2xs` is `AXIS_LABEL_FONT_SIZE` as a class: 11px and tight, because
       these read as axis labels rather than as captions. -->
  <div
    v-if="vertical"
    data-slot="chart-scale"
    class="flex flex-col items-center justify-end"
  >
    <span class="text-2xs tabular-nums text-ink-gray-5">{{ high }}</span>
    <!-- Grows into the room it has and stops: a ramp as tall as the card reads
         as a second column of data rather than as a key to one. -->
    <span
      class="mt-2 min-h-8 max-h-20 w-2 flex-1 rounded-1"
      :style="{ backgroundImage: gradient }"
    />
    <!-- Holds the whole label row, so `min` starts where the labels beside it
         start. Its own height until that row is known, or the first frame
         would draw a collapsed box. -->
    <span
      data-slot="chart-scale-min"
      class="text-2xs tabular-nums text-ink-gray-5"
      :style="{
        marginTop: `${AXIS_LABEL_MARGIN}px`,
        height: labelRowHeight
          ? `${Math.max(labelRowHeight - AXIS_LABEL_MARGIN, 0)}px`
          : undefined,
      }"
    >
      {{ low }}
    </span>
  </div>
  <div
    v-else
    data-slot="chart-scale"
    class="flex items-center gap-2 whitespace-nowrap text-2xs tabular-nums text-ink-gray-5"
  >
    <span>{{ low }}</span>
    <span class="h-2 w-20 rounded-1" :style="{ backgroundImage: gradient }" />
    <span>{{ high }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { AXIS_LABEL_MARGIN } from '../axisChartCommon'
import { formatValue } from '../format'
import { sampleRamp } from '../heatmapOptions'
import type { ChartDir, ChartValueFormatter } from '../types'

const props = defineProps<{
  min: number
  max: number
  /** The ramp the scale runs along, low end first. */
  stops: string[]
  /** Prints the ends. They sit in a narrow strip, so they default to short. */
  format?: ChartValueFormatter
  /** Some value lies under `min`, so its end reads `≤`. */
  belowMin?: boolean
  /** Some value lies over `max`, so its end reads `≥`. */
  aboveMax?: boolean
  /** Upright beside the plot, low end at the foot. Else lying under it. */
  vertical?: boolean
  /** Upright, the height of the label row `min` lines up with. */
  labelRowHeight?: number
  dir?: ChartDir
}>()

function print(value: number) {
  return props.format ? props.format(value) : formatValue(value, 1, true)
}

const low = computed(() => `${props.belowMin ? '≤ ' : ''}${print(props.min)}`)
const high = computed(() => `${props.aboveMax ? '≥ ' : ''}${print(props.max)}`)

// Upright, the labels sit above and below the ramp rather than either side of
// it, so it reads the same in both directions and RTL has nothing to flip.
const gradient = computed(() => {
  const towards = props.vertical
    ? 'top'
    : props.dir === 'rtl'
      ? 'left'
      : 'right'
  return `linear-gradient(to ${towards}, ${sampleRamp(props.stops).join(', ')})`
})
</script>
