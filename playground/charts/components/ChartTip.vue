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
  /**
   * The same body with the marks left off, which is how the file writes a
   * tooltip whose rows are measures rather than series — the scatter cards
   * name a point's price and units, and neither is a thing to find a swatch
   * for (1356:67734, 1356:67835: the cell's prefix is simply empty). The box
   * grows to 160 and the rows close up to 12px with 4 between.
   */
  plain?: boolean
  /**
   * The file's four-row line tooltip (1356:68437), which names no reading at
   * all: the rows stand alone in a 180 box, 8 in on every side with 4 between,
   * and nothing says which month they are. A reader on that card has the
   * crosshair for the month and the rows for the four series.
   */
  bare?: boolean
  /**
   * The mark on a row, when the file's is not the one the row count implies.
   * The file reaches for a square where a legend names the series and a dot
   * where it does not, which does not always follow from how many rows there
   * are: its two-line card keeps dots (1356:68269 "icon/solid/dot-md") where
   * its four-step card takes squares (1356:68437 "icon/solid/square-md").
   */
  mark?: 'dot' | 'square'
}>()

const many = computed(() => props.items.length > 1)
const shape = computed(() => props.mark ?? (many.value ? 'square' : 'dot'))
// The roomier box goes with the square, not with the row count: the file gives
// its square-marked tooltips 8 above and below and keeps 5 for the dotted ones,
// whether a dotted one carries one row or two (1356:68269 is 135×62 at the
// same 5/8/5/3 as the single-row 1356:68175, where the four-row stack of the
// area row opens out to 8/8/8/4).

function reading(item: ChartTooltipItem) {
  const raw = props.rows?.[0]?.[item.name]
  if (!props.value || typeof raw !== 'number') return item.formattedValue
  return props.value(raw)
}
</script>

<template>
  <div
    :data-tip="bare ? 'steps' : plain ? 'measures' : 'figma'"
    :data-rows="shape === 'square' ? 'many' : 'one'"
    class="flex flex-col gap-1"
  >
    <!-- the file insets the date by 5, which puts it over the row's mark -->
    <div
      v-if="label && !bare"
      class="pl-[5px] text-xs leading-none text-ink-gray-8"
    >
      {{ label }}
    </div>
    <!-- The rows close to 2 only in the area row's stack, which is the same
         card the roomier padding belongs to; everywhere else the file leaves
         4 between them (1356:68269's two rows sit 20 apart on a 16 row, as do
         1356:68437's four, where the area row's four sit 18 apart). -->
    <div
      class="flex flex-col"
      :class="shape === 'square' && !bare ? 'gap-[2px]' : 'gap-1'"
    >
      <div
        v-for="item in items"
        :key="item.name"
        class="flex items-center gap-[2px]"
        :class="plain ? 'h-3' : 'h-4'"
      >
        <span
          v-if="!plain"
          class="flex size-4 shrink-0 items-center justify-center"
        >
          <span
            class="block shrink-0"
            :class="
              shape === 'dot'
                ? 'size-[5.5px] rounded-full'
                : bare
                  ? 'size-[5.5px] rounded-[1.5px]'
                  : 'size-[7px] rounded-[2px]'
            "
            :style="{ backgroundColor: item.color }"
          />
        </span>
        <span class="flex min-w-0 flex-1 items-center gap-1">
          <span
            class="min-w-0 flex-1 truncate text-xs leading-none text-ink-gray-6"
          >
            {{ item.label }}
          </span>
          <span
            class="shrink-0 text-xs-medium leading-none tabular-nums text-ink-gray-8"
          >
            {{ reading(item) }}
          </span>
        </span>
      </div>
    </div>
  </div>
</template>
