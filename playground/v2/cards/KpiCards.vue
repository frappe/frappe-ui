<script setup lang="ts">
// Figma: espresso-2.0 › kpi-card (31860:13142) — the eleven variants, every
// value read from the file. All on the raised card surface behind a 1px
// outline-gray-1 border, 12px radius, with the file's own charts and icons.
//   sm · none        168 × 62, p 10, 8px gaps: the 14 gray-500 label over
//                    the 16/500 gray-800 value
//   md · bottom      223 × 138 (stacked-bar 133): a p 12 head of the label ·
//                    8px · the 20/500 value · 8px · the trend line, then the
//                    chart full-bleed across the foot (223 × 42, 37 stacked)
//   md · right       223 × 117, p 12: the label, then the value with a
//                    146 × 40 chart beside it, the trend line 6px beneath
// The trend line is the file's 16px arrow-up-right in green-7 · 2px ·
// 13 green-7 "+7%" · 4px · 13 gray-500 period · 4px · the 16px small-down
// chevron in gray-500; KpiCard makes that period a dropdown and the charts
// hoverable.
// Chart colours follow the palette (violet-5 line, amber-5 bars, orange-5
// stacked); the stacked track and the subtle fade follow the card itself,
// so both read in dark.
import KpiCard from './KpiCard.vue'
import {
  B_BAR,
  B_SPARK_FILL,
  B_SPARK_OUTLINE,
  B_SPARK_SUBTLE,
  B_STACKED,
  R_BAR,
  R_SPARK_FILL,
  R_SPARK_OUTLINE,
  R_SPARK_SUBTLE,
  R_STACKED,
} from './kpiSeries'
import bBar from '../assets/cards/kpi/b-bar.svg?raw'
import bSparkFill from '../assets/cards/kpi/b-spark-fill.svg?raw'
import bSparkOutline from '../assets/cards/kpi/b-spark-outline.svg?raw'
import bSparkSubtle from '../assets/cards/kpi/b-spark-subtle.svg?raw'
import bStacked from '../assets/cards/kpi/b-stacked.svg?raw'
import rBar from '../assets/cards/kpi/r-bar.svg?raw'
import rSparkFill from '../assets/cards/kpi/r-spark-fill.svg?raw'
import rSparkOutline from '../assets/cards/kpi/r-spark-outline.svg?raw'
import rSparkSubtle from '../assets/cards/kpi/r-spark-subtle.svg?raw'
import rStacked from '../assets/cards/kpi/r-stacked.svg?raw'

// the file's order along the row: fill, subtle, outline, bars, stacked
const BOTTOM = [
  { key: 'spark-fill', chart: bSparkFill, series: B_SPARK_FILL, height: 42 },
  { key: 'spark-subtle', chart: bSparkSubtle, series: B_SPARK_SUBTLE, height: 42 },
  { key: 'spark-outline', chart: bSparkOutline, series: B_SPARK_OUTLINE, height: 42 },
  { key: 'bar-chart', chart: bBar, series: B_BAR, height: 42 },
  // the stacked bars are 37 tall, so that card is 133
  { key: 'stacked-bar', chart: bStacked, series: B_STACKED, height: 37 },
]

const RIGHT = [
  { key: 'spark-fill', chart: rSparkFill, series: R_SPARK_FILL },
  { key: 'spark-subtle', chart: rSparkSubtle, series: R_SPARK_SUBTLE },
  { key: 'spark-outline', chart: rSparkOutline, series: R_SPARK_OUTLINE },
  { key: 'bar-chart', chart: rBar, series: R_BAR },
  { key: 'stacked-bar', chart: rStacked, series: R_STACKED },
]
</script>

<template>
  <!-- one row per group, as the file lays them out: sm, then the five
       chart-at-the-foot cards, then the five chart-beside-the-value ones.
       A row is 1195 wide, so each scrolls on its own if the panel is
       narrower than that; it stays centred when it fits. -->
  <div class="flex w-full flex-col items-center gap-10">
    <!-- sm · no chart -->
    <div class="w-full overflow-x-auto">
      <div class="mx-auto flex w-max flex-col gap-2">
        <p class="kpi-caption">Default</p>
        <div class="flex gap-5">
          <article
            class="espresso-kpi h-[62px] w-[168px] gap-2 rounded-6 p-2.5"
          >
            <p class="flex h-4 items-center truncate text-base text-ink-gray-5">
              Avg Resolution
            </p>
            <p
              class="flex h-[18px] items-center text-lg-medium text-ink-gray-8"
            >
              1d 12h
            </p>
          </article>
        </div>
      </div>
    </div>

    <!-- md · chart across the foot -->
    <div class="w-full overflow-x-auto">
      <div class="mx-auto flex w-max flex-col gap-2">
        <p class="kpi-caption">md · chart bottom</p>
        <div class="flex items-start gap-5">
          <KpiCard
            v-for="c in BOTTOM"
            :key="c.key"
            layout="bottom"
            :chart="c.chart"
            :series="c.series"
            :chart-height="c.height"
            :total="184"
          />
        </div>
      </div>
    </div>

    <!-- md · chart beside the value -->
    <div class="w-full overflow-x-auto">
      <div class="mx-auto flex w-max flex-col gap-2">
        <p class="kpi-caption">md · chart right</p>
        <div class="flex items-start gap-5">
          <KpiCard
            v-for="c in RIGHT"
            :key="c.key"
            layout="right"
            :chart="c.chart"
            :series="c.series"
            :chart-height="40"
            :total="184"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style>
/* The same shell as the other card types: a raised surface behind a
   hairline, one step lower in dark. `--card-surface` follows it, so the
   subtle chart's fade blends into the card in either theme. */
.espresso-kpi {
  --card-surface: var(--surface-elevation-2);
  background-color: var(--card-surface);
  @apply flex flex-col border border-outline-gray-1;
}
[data-theme='dark'] .espresso-kpi {
  --card-surface: var(--surface-elevation-1);
}
/* the group's name, above its row */
.kpi-caption {
  @apply text-sm text-ink-gray-5;
}
/* 16px icon · 2px · +7% · 4px · the period · 4px · the chevron */
.kpi-trend {
  @apply flex h-4 items-center gap-1;
}
.kpi-trend > :first-child {
  @apply mr-[-2px];
}
/* the charts keep their own aspect; the stroke bleeds past the slot in the
   file too, so the box clips it */
.kpi-chart svg {
  display: block;
  width: 100%;
  height: auto;
}
</style>
