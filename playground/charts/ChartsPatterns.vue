<script setup lang="ts">
// Figma: espresso-2.0 › Patterns › Desktop - 20 (35795:203360) — the
// Charts page. In the stage: the 20px semibold title 33 in from the left
// and 43 down, then 24 under it a two-column grid of 447×297 cards on a
// 10px radius behind a hairline, 17 apart across and 18 down. Down the
// right, 48 past the cards and 66 from the top, the "Charts type" rail: a
// 14px semibold heading, then 19 under it a hairline list of 14px rows 26
// apart, the one in hand carrying a 24px ink-gray-7 segment of the line.
// 41 under the list, "Theme", and 18 under that the file's padded radio
// group: Ocean, Qualitative, Diverging, Mist, Earthy.
//
// The file draws the cards empty. Here each row of the rail fills them
// with that kind of chart, drawn by the library's charts in the palette
// the Theme group has picked (chartSets.ts, chartThemes.ts).
import { computed, ref } from 'vue'
import { Radio, RadioGroup } from '../../src'
import { ECharts } from '../../experimental/Charts'
import { CHART_TYPES, chartCards, type ChartType } from './chartSets'
import { CHART_PALETTES, CHART_THEMES, type ChartTheme } from './chartThemes'

const type = ref<ChartType>('bar')
const theme = ref<ChartTheme>('ocean')

const cards = computed(() =>
  chartCards(type.value, CHART_PALETTES[theme.value]),
)
</script>

<template>
  <div class="flex min-h-full bg-surface-base">
    <!-- the page: title, then the grid -->
    <div class="flex min-w-0 flex-1 flex-col pb-12 pl-[33px] pr-6 pt-[43px]">
      <h1 class="text-3xl-semibold leading-[1.15] text-ink-gray-9">Charts</h1>
      <div
        class="mt-6 grid w-[911px] max-w-full grid-cols-2 gap-x-[17px] gap-y-[18px]"
      >
        <!-- a card the file's 447×297, with the chart filling it -->
        <article
          v-for="card in cards"
          :key="`${type}-${card.title}`"
          class="chart-card h-[297px] overflow-hidden rounded-[10px] border border-outline-gray-1 bg-surface-elevation-1"
          :aria-label="card.title"
        >
          <ECharts
            :key="theme"
            :options="card.options"
            class="h-full w-full px-4 pt-4 pb-2"
          />
        </article>
      </div>
    </div>

    <!-- the rail: the kinds of chart, then the palette -->
    <aside class="hidden w-[180px] shrink-0 pt-[66px] lg:block">
      <h2
        id="chart-types"
        class="text-base font-semibold leading-[1.15] tracking-[0.015em] text-ink-gray-9"
      >
        Charts type
      </h2>
      <ul
        class="mt-[19px] flex flex-col gap-0.5 border-l border-outline-gray-1 py-1"
        role="tablist"
        aria-labelledby="chart-types"
        aria-orientation="vertical"
      >
        <li v-for="t in CHART_TYPES" :key="t.id" class="-ml-px">
          <button
            type="button"
            role="tab"
            class="block w-full border-l py-1 pl-4 text-start text-base leading-[1.15] tracking-[0.02em] transition-colors"
            :class="
              type === t.id
                ? 'border-[color:var(--ink-gray-7)] text-ink-gray-9'
                : 'border-transparent text-ink-gray-8 hover:text-ink-gray-9'
            "
            :aria-selected="type === t.id"
            @click="type = t.id"
          >
            {{ t.label }}
          </button>
        </li>
      </ul>

      <h2
        class="mt-[45px] text-base font-semibold leading-[1.15] tracking-[0.015em] text-ink-gray-9"
      >
        Theme
      </h2>
      <RadioGroup
        v-model="theme"
        class="theme-radios mt-[18px]"
        size="sm"
        padded
        orientation="vertical"
        aria-label="Theme"
      >
        <Radio
          v-for="t in CHART_THEMES"
          :key="t.id"
          :value="t.id"
          :label="t.label"
        />
      </RadioGroup>
    </aside>
  </div>
</template>

<style scoped>
/* the file's radio rows are 2px apart; the group lays its padded rows flush */
.theme-radios :deep([role='radiogroup']) {
  gap: 2px;
}
</style>
