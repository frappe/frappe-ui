<script setup lang="ts">
// The file's table heat map (Figma 1GDS12ys41lxeG3wQpNq41, 1356:68481):
// nine companies in 40px rows behind an outline-gray-1 hairline on an 8px
// outer radius — a 48px numbered column, the name in 14px ink-gray-8, then
// seven cells 88 wide holding a number on a fill from the theme's heat
// ramp, the ink turning white on the darkest two steps. A table rather
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
}>()

const values = computed(() => props.rows.flatMap(([, ...v]) => v))
const min = computed(() => Math.min(...values.value))
const max = computed(() => Math.max(...values.value))

/** the ramp step a value falls in */
function fill(value: number): string {
  const n = props.colors.length
  const span = max.value - min.value || 1
  const i = Math.min(n - 1, Math.floor(((value - min.value) / span) * n))
  return props.colors[i]
}
const ink = (value: number) => insideLabelColor(fill(value), props.ink)
const print = (value: number) => value.toLocaleString('en-US')
</script>

<template>
  <div class="overflow-x-auto">
    <table
      class="w-full border-separate border-spacing-0 text-base leading-[1.15] tracking-[0.02em] text-ink-gray-8"
      :aria-label="`Heat map, ${columns.join(', ')}`"
    >
      <tbody>
        <tr v-for="([name, ...cells], r) in rows" :key="name" class="h-10">
          <th
            scope="row"
            class="w-12 border-b border-l border-outline-gray-1 bg-surface-elevation-2 px-2 text-center font-normal"
            :class="[
              r === 0 && 'rounded-tl-[8px] border-t',
              r === rows.length - 1 && 'rounded-bl-[8px]',
            ]"
          >
            {{ r + 1 }}
          </th>
          <td
            class="w-[134px] border-b border-l border-outline-gray-1 px-3 text-start"
            :class="r === 0 && 'border-t'"
          >
            {{ name }}
          </td>
          <td
            v-for="(value, c) in cells"
            :key="columns[c]"
            class="w-[88px] border-b border-outline-gray-1 px-3 text-start tabular-nums"
            :class="[
              r === 0 && 'border-t',
              c === cells.length - 1 && 'border-r',
              r === 0 && c === cells.length - 1 && 'rounded-tr-[8px]',
              r === rows.length - 1 &&
                c === cells.length - 1 &&
                'rounded-br-[8px]',
            ]"
            :style="{ background: fill(value), color: ink(value) }"
          >
            {{ print(value) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
