<script setup lang="ts">
// Figma: espresso-2.0 › Patterns › Desktop - 20 (35795:203360) — the
// Charts page. In the stage: the 20px semibold title 33 in from the left
// and 43 down, then 24 under it a two-column grid of cards 17 apart
// across and 18 down. The file draws the grid 911 wide because its frame
// is; here it takes the width the rail leaves it, two equal columns of it,
// one below the rail's breakpoint — a card never carries a width of its
// own, so every card the page grows from here falls into the same columns.
// Down the right, 48 past the cards and 66 from the top, the "Charts type"
// rail: a 14px semibold heading, then 19 under it
// a hairline list of 14px rows 26 apart, the one in hand carrying a 24px
// ink-gray-7 segment of the line. 41 under the list, "Theme", and 18
// under that the file's padded radio group: Ocean, Qualitative,
// Diverging, Mist, Earthy.
//
// The cards are the Frappe Charts file's (Figma 1GDS12ys41lxeG3wQpNq41,
// "Charts - ocean blue" and its theme frames): each row of the rail is
// one of its sections, drawn by the library's charts in the theme the
// radio group has picked. The theme is a set of the file's colour
// variables (chartThemes.ts) resolved off the page (useChartTokens.ts),
// so the dark mode is the file's dark column of the same variables.
import { computed, ref, type Component } from 'vue'
import { Radio, RadioGroup } from '../../src'
import { CHART_THEMES, type ChartTheme } from './chartThemes'
import { useChartTheme } from './useChartTheme'
import BarSection from './sections/BarSection.vue'
import SparklineSection from './sections/SparklineSection.vue'
import AreaSection from './sections/AreaSection.vue'
import ScatterSection from './sections/ScatterSection.vue'
import HeatmapSection from './sections/HeatmapSection.vue'
import LineSection from './sections/LineSection.vue'
import FunnelSection from './sections/FunnelSection.vue'
import AnnotationSection from './sections/AnnotationSection.vue'
import PieSection from './sections/PieSection.vue'

type ChartType =
  | 'bar'
  | 'sparkline'
  | 'area'
  | 'scatter'
  | 'bubble'
  | 'heatmap'
  | 'line'
  | 'funnel'
  | 'annotation'
  | 'pie'

/** the rail's rows, in the file's order and words */
const CHART_TYPES: Array<{
  id: ChartType
  label: string
  section: Component
  props?: Record<string, unknown>
  /** the section draws its cards at the file's own 580×360 */
  figmaSize?: boolean
}> = [
  { id: 'bar', label: 'Bar charts', section: BarSection, figmaSize: true },
  { id: 'sparkline', label: 'Spark line charts', section: SparklineSection },
  { id: 'area', label: 'Area Charts', section: AreaSection },
  { id: 'scatter', label: 'Scatter plot', section: ScatterSection },
  {
    id: 'bubble',
    label: 'Bubble chart',
    section: ScatterSection,
    props: { bubbles: true },
  },
  { id: 'heatmap', label: 'Heat map', section: HeatmapSection },
  { id: 'line', label: 'Line chart', section: LineSection },
  { id: 'funnel', label: 'Funnel chart', section: FunnelSection },
  { id: 'annotation', label: 'Annotation', section: AnnotationSection },
  { id: 'pie', label: 'Pie charts', section: PieSection },
]

const type = ref<ChartType>('bar')
const themeId = ref<ChartTheme>('ocean')
const theme = useChartTheme(themeId)

const current = computed(() => CHART_TYPES.find((t) => t.id === type.value)!)
</script>

<template>
  <div class="flex min-h-full bg-surface-base">
    <!-- the page: title, then the grid -->
    <div
      class="chart-stage flex min-w-0 flex-1 flex-col pb-12 pl-[33px] pr-[33px] pt-[43px] lg:pr-12"
    >
      <h1 class="text-3xl-semibold leading-tighter text-ink-gray-9">Charts</h1>
      <div
        :key="`${type}-${themeId}`"
        :data-chart-theme="themeId"
        class="chart-grid mt-6"
        :class="{ 'chart-grid--figma': current.figmaSize }"
      >
        <component
          :is="current.section"
          :theme="theme"
          :theme-id="themeId"
          v-bind="current.props"
        />
      </div>
    </div>

    <!-- the rail: the kinds of chart, then the palette. It stays put while
         the cards scroll under it, as the other pages' outline does — that
         one stands outside the stage's scroller; this one is inside it, so
         it sticks to the top instead. -->
    <aside
      class="sticky top-0 hidden h-fit w-[180px] shrink-0 self-start pt-[66px] lg:block"
    >
      <h2
        id="chart-types"
        class="text-base-semibold leading-tighter text-ink-gray-9"
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
            class="block w-full border-l py-1 pl-4 text-start text-base leading-tighter transition-colors"
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

      <h2 class="mt-[45px] text-base-semibold leading-tighter text-ink-gray-9">
        Theme
      </h2>
      <RadioGroup
        v-model="themeId"
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
/* The stage measures itself, so the grid folds on the width it actually has.
   The window's width is the wrong question here: the playground's own nav
   takes 300 of it before the page starts, and the rail another 228. */
.chart-stage {
  container-type: inline-size;
  container-name: chart-stage;
}

/* Every card sits in this grid and carries no width of its own: two equal
   columns the file's 17 apart, rows 18 apart, and one column when the stage
   is too narrow to hold two cards worth reading. A card that wants the whole
   row asks for it with `col-span-full`, which follows the count. */
.chart-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  column-gap: 17px;
  row-gap: 18px;
}
@container chart-stage (min-width: 700px) {
  .chart-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

/* A section drawn at the file's own card size: 580 wide, and 360 tall by the
   card's 580/360 ratio, so it reads 1:1 against the frame. Two of them and the
   file's 17 between need 1177 of stage; under that the grid holds one, and
   under 580 the card gives way rather than overflow. Written after the rules
   above so it wins over the fluid columns. */
.chart-grid--figma {
  grid-template-columns: minmax(0, 580px);
  justify-content: start;
}
@container chart-stage (min-width: 1177px) {
  .chart-grid--figma {
    grid-template-columns: repeat(2, 580px);
  }
}

/* the file's radio rows are 2px apart; the group lays its padded rows flush */
.theme-radios :deep([role='radiogroup']) {
  gap: 2px;
}
</style>

<style>
/* The library's chart tooltip, as the file draws it: an 8px corner under
   the file's three shadows, 12px type. Global, since the tooltip is
   teleported to the body. */
[data-slot='chart-tooltip'] {
  border-radius: 8px;
  box-shadow:
    0 6px 12px -2px rgba(0, 0, 0, 0.12),
    0 0 6px 2px rgba(0, 0, 0, 0.03),
    0 0 1.5px rgba(0, 0, 0, 0.15);
}
/* And a tone above the card it floats over. The library paints its tooltip
   in the card's own surface (elevation-2), which in dark mode is the same
   grey as the card and leaves the box to its shadow alone; elevation-3 is
   that surface one step up, and in light both are white. The map's tooltip
   took this step first. `body` outranks the library's utility class. */
body [data-slot='chart-tooltip'] {
  background-color: var(--surface-elevation-3);
}
/* The file's own tooltip box, where a card draws the file's tooltip body
   (ChartTip): 135 wide on one row with the padding tight to the left of the
   dot, 8 around once the rows carry swatches. The shell is the library's —
   it is teleported to the body, so these are not scoped. */
[data-slot='chart-tooltip']:has([data-tip='figma']) {
  min-width: 135px;
  padding: 5px 8px 5px 3px;
}
[data-slot='chart-tooltip']:has([data-tip='figma'][data-rows='many']) {
  padding: 8px 8px 8px 4px;
}
/* The same box around rows that carry no mark — the scatter cards' two
   measures — which the file draws 160 wide with an even 8 all round
   (1356:67734, 1356:67835). */
[data-slot='chart-tooltip']:has([data-tip='measures']) {
  min-width: 160px;
  padding: 8px;
}
/* And the four-step line card's, which the file draws wider still and names
   no month on: 180 across, an even 8 all round, its four rows 4 apart
   (1356:68437 is 180×92 against the two-line card's 135×62). */
[data-slot='chart-tooltip']:has([data-tip='steps']) {
  min-width: 180px;
  padding: 8px;
}
</style>
