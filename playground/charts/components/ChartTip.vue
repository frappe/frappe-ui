<script setup lang="ts">
// The tooltip body the Frappe Charts file draws (Figma 1GDS12ys41lxeG3wQpNq41,
// the tooltip of 1356:66389 and its neighbours), in the library's tooltip
// shell: the reading's date on top in 12px ink-gray-8, then one 16px row per
// series — a 16px cell carrying the series' mark, its name in 12px ink-gray-6
// filling the row, and the value in 12px medium ink-gray-8 against the right
// edge. The file marks a lone series with a 5.5px dot and several with the
// 7px square of the legend, which is what tells a reader whether the row they
// are looking at is the only one.
//
// The shell — the 8px corner, the three shadows, the width and the padding —
// is set on `[data-slot='chart-tooltip']` in ChartsPatterns.vue, since the
// library teleports it to the body.
import { computed } from 'vue'
import type { ChartTooltipItem } from '../../../src/charts/types'

const props = defineProps<{
  /** the category under the pointer, as the axis prints it */
  label?: string
  items: ChartTooltipItem[]
  /**
   * The row behind the reading, and how this card prints a number. A card
   * whose series are formatted for the plot — the stack that labels every
   * segment "$4.4k" — reads them back here the way the file's rows do, as the
   * number itself. Left out, each row prints what the series printed.
   */
  rows?: Record<string, any>[]
  value?: (value: number) => string
}>()

const many = computed(() => props.items.length > 1)

function reading(item: ChartTooltipItem) {
  const raw = props.rows?.[0]?.[item.name]
  if (!props.value || typeof raw !== 'number') return item.formattedValue
  return props.value(raw)
}
</script>

<template>
  <div
    data-tip="figma"
    :data-rows="many ? 'many' : 'one'"
    class="flex flex-col gap-1"
  >
    <!-- the file insets the date by 5, which puts it over the row's mark -->
    <div
      v-if="label"
      class="pl-[5px] text-[12px] leading-none tracking-[0.02em] text-ink-gray-8"
    >
      {{ label }}
    </div>
    <div class="flex flex-col gap-[2px]">
      <div
        v-for="item in items"
        :key="item.name"
        class="flex h-4 items-center gap-[2px]"
      >
        <span class="flex size-4 shrink-0 items-center justify-center">
          <span
            class="block shrink-0"
            :class="
              many ? 'size-[7px] rounded-[2px]' : 'size-[5.5px] rounded-full'
            "
            :style="{ backgroundColor: item.color }"
          />
        </span>
        <span class="flex min-w-0 flex-1 items-center gap-1">
          <span
            class="min-w-0 flex-1 truncate text-[12px] leading-none tracking-[0.02em] text-ink-gray-6"
          >
            {{ item.label }}
          </span>
          <span
            class="shrink-0 text-[12px] font-medium leading-none tracking-[0.02em] tabular-nums text-ink-gray-8"
          >
            {{ reading(item) }}
          </span>
        </span>
      </div>
    </div>
  </div>
</template>
