<script setup lang="ts">
// The file's table heat map (Figma 1GDS12ys41lxeG3wQpNq41, 1356:68481):
// nine companies in 40px rows behind an outline-gray-1 hairline on an 8px
// outer radius — a 48px numbered column, the name in 14px ink-gray-7, then
// seven cells 60 wide, each centring a 14px number on a fill from
// the theme's heat ramp, the ink turning white on the darkest two steps. A table rather
// than the library's HeatmapChart, whose plot has no numbered column and
// no ruled rows; the ramp is read the way the library reads one.
import { computed } from 'vue'
import { insideLabelColor } from '../../../src/charts/tokens'

const props = defineProps<{
  rows: ReadonlyArray<readonly [string, ...number[]]>
  columns: string[]
  /** the theme's heat ramp, low to high */
  colors: string[]
  /** the ink on a pale cell */
  ink: string
  /** the file's own step per cell, as an index into `colors` */
  steps: ReadonlyArray<readonly number[]>
}>()

/**
 * The colour the file gives this cell. The file's steps are placed by hand
 * and have nothing to do with what a cell holds — 51,987 sits on B-300 and
 * 12,345 on B-900 — so the step is carried in the data and read here, not
 * worked out from the reading. A theme whose ramp is shorter than the file's
 * seven wraps rather than clamping, so its cells keep the file's pattern.
 */
function fill(r: number, c: number): string {
  const n = props.colors.length
  if (!n) return 'transparent'
  return props.colors[(props.steps[r]?.[c] ?? 0) % n]
}
const ink = (r: number, c: number) => insideLabelColor(fill(r, c), props.ink)
const print = (value: number) => value.toLocaleString('en-US')
</script>

<template>
  <div class="overflow-x-auto">
    <!-- the table keeps its own width rather than stretching: 48 for the
         number, 134 for the name and seven readings of 60, and the card keeps
         the rest -->
    <table
      class="w-auto border-separate border-spacing-0 text-[14px] leading-[1.15] tracking-[0.02em] text-ink-gray-8"
      :aria-label="`Heat map, ${columns.join(', ')}`"
    >
      <tbody>
        <tr v-for="([name, ...cells], r) in rows" :key="name" class="h-10">
          <th
            scope="row"
            class="heat-rule w-12 border-b border-l border-outline-gray-1 bg-surface-elevation-2 px-2 text-center font-normal"
            :class="[
              r === 0 && 'rounded-tl-[8px] border-t',
              r === rows.length - 1 && 'rounded-bl-[8px]',
            ]"
          >
            {{ r + 1 }}
          </th>
          <!-- the name stands on the number's ground: the two are one label
               column, and a cell left transparent reads as a second tone
               against it wherever the card is not white -->
          <td
            class="heat-rule w-[134px] border-b border-l border-outline-gray-1 bg-surface-elevation-2 px-2 text-start text-ink-gray-7"
            :class="r === 0 && 'border-t'"
          >
            {{ name }}
          </td>
          <!-- A reading carries no rule of its own: the file turns the cell's
               stroke off (1356:68481, every advanced-cell's stroke is
               `visible: false`) and hangs the hairline on the row instead,
               where the next row's fill covers it — so it shows across the
               unruled name column and nowhere over the readings. The field
               is one unbroken sheet of colour, right out to the corners. -->
          <td
            v-for="(value, c) in cells"
            :key="columns[c]"
            class="w-[60px] px-2 text-center tabular-nums"
            :class="[
              r === 0 && c === cells.length - 1 && 'rounded-tr-[8px]',
              r === rows.length - 1 &&
                c === cells.length - 1 &&
                'rounded-br-[8px]',
            ]"
            :style="{ background: fill(r, c), color: ink(r, c) }"
          >
            {{ print(value) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
/* The label column's rules step a tone in dark mode. outline-gray-1 is the
   hairline the file draws and it holds in light, but dark resolves it to
   oklch(0.26 0 0) — which is surface-elevation-2 to the decimal, the very
   ground the column stands on, so the rules disappeared into it. gray-2
   lands at 0.341 and reads as a line again. */
:root[data-theme='dark'] .heat-rule {
  border-color: var(--outline-gray-2);
}
@media (prefers-color-scheme: dark) {
  :root:not([data-theme='light']) .heat-rule {
    border-color: var(--outline-gray-2);
  }
}
</style>
