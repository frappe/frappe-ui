<template>
  <!-- No height cap: a legend that scrolls hides series names behind a gesture
       nobody makes. It takes the rows it needs and the plot gives up the space,
       which the chart's resize observer picks up. -->
  <div
    data-slot="chart-legend"
    class="flex shrink-0 flex-wrap items-center justify-center gap-x-1 gap-y-0.5"
  >
    <Button
      v-for="item in items"
      :key="item.name"
      variant="ghost"
      size="xs"
      :aria-pressed="!item.hidden"
      :label="toggleLabel(item)"
      @click="emit('change', item.name)"
      @mouseenter="emit('highlight', item.name)"
      @mouseleave="emit('highlight', null)"
      @focus="emit('highlight', item.name)"
      @blur="emit('highlight', null)"
    >
      <span class="flex items-center gap-1.5">
        <span
          class="size-2 shrink-0 rounded-full"
          :class="{ 'opacity-30': item.hidden }"
          :style="{ backgroundColor: item.color }"
        />
        <!-- A step back from the axis titles: the legend names the marks, it is
             not a label of the chart's own. -->
        <span :class="item.hidden ? 'text-ink-gray-4' : 'text-ink-gray-6'">
          {{ item.label }}
        </span>
        <span v-if="item.hint" class="tabular-nums text-ink-gray-4">
          {{ item.hint }}
        </span>
      </span>
    </Button>
  </div>
</template>

<script setup lang="ts">
import Button from '#components/Button/Button.vue'
import type {
  ChartLegendEmits,
  ChartLegendItem,
  ChartLegendProps,
} from '../types'

defineProps<ChartLegendProps>()

const emit = defineEmits<ChartLegendEmits>()

// The visible text is the series label; the accessible name has to say what the
// press does, since the toggle state alone doesn't read as an action.
function toggleLabel(item: ChartLegendItem) {
  return `${item.hidden ? 'Show' : 'Hide'} ${item.label}`
}
</script>
