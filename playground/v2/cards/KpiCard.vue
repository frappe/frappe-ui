<script setup lang="ts">
// One KPI card (Figma 31860:13142): the layout and every value come from the
// file — see KpiCards.vue for the measurements. Two things are live here:
//   · the period behind "vs last month" is a dropdown, and the delta follows
//     the pick
//   · the chart reads out the point under the pointer (KpiChart), with the
//     period spacing its dates
import { computed, ref } from 'vue'
import { Dropdown } from '../../../src'
import KpiChart from './KpiChart.vue'
import arrowUpRight from '../assets/cards/kpi/icon-arrow-up-right.svg?raw'
import smallDown from '../assets/cards/kpi/icon-small-down.svg?raw'
import { PERIODS, type Period, type Series } from './kpiSeries'

defineProps<{
  layout: 'bottom' | 'right'
  chart: string
  series: Series
  /** the chart slot's height in px (42, 37 for the stacked bars, 40 right) */
  chartHeight: number
  total: number
}>()

const period = ref<Period>(PERIODS[1])

const periodOptions = computed(() =>
  PERIODS.map((p) => ({
    label: p.label,
    selected: p.label === period.value.label,
    onClick: () => (period.value = p),
  })),
)
</script>

<template>
  <article
    class="espresso-kpi w-[223px] rounded-6"
    :class="
      layout === 'bottom'
        ? 'justify-between overflow-hidden'
        : 'h-[117px] justify-between p-3'
    "
    :style="
      layout === 'bottom' ? { height: `${96 + chartHeight}px` } : undefined
    "
  >
    <template v-if="layout === 'bottom'">
      <div class="flex flex-col gap-2 p-3">
        <p class="flex h-4 items-center truncate text-base text-ink-gray-5">
          Course Subscribers
        </p>
        <div class="flex flex-col gap-2">
          <p class="flex h-[23px] items-center text-3xl-medium text-ink-gray-8">
            {{ total }}
          </p>
          <div class="kpi-trend">
            <span
              class="size-4 shrink-0 text-ink-green-7"
              v-html="arrowUpRight"
            />
            <span class="text-sm text-ink-green-7">+{{ period.delta }}%</span>
            <Dropdown :options="periodOptions" align="start" :offset="6">
              <button type="button" class="kpi-period">
                {{ period.label }}
                <span class="size-4 shrink-0" v-html="smallDown" />
              </button>
            </Dropdown>
          </div>
        </div>
      </div>
      <KpiChart
        full-bleed
        :chart="chart"
        :series="series"
        :height="chartHeight"
        :period="period"
        :total="total"
      />
    </template>

    <template v-else>
      <p class="flex h-4 items-center truncate text-base text-ink-gray-5">
        Course Subscribers
      </p>
      <div class="flex flex-col gap-1.5">
        <!-- the value sits on the chart's baseline -->
        <div class="flex h-10 items-end">
          <p
            class="flex h-[23px] flex-1 items-center text-3xl-medium text-ink-gray-8"
          >
            {{ total }}
          </p>
          <KpiChart
            :chart="chart"
            :series="series"
            :height="chartHeight"
            :period="period"
            :total="total"
          />
        </div>
        <div class="kpi-trend">
          <span class="size-4 shrink-0 text-ink-green-7" v-html="arrowUpRight" />
          <span class="text-sm text-ink-green-7">+{{ period.delta }}%</span>
          <Dropdown :options="periodOptions" align="start" :offset="6">
            <button type="button" class="kpi-period">
              {{ period.label }}
              <span class="size-4 shrink-0" v-html="smallDown" />
            </button>
          </Dropdown>
        </div>
      </div>
    </template>
  </article>
</template>

<style>
/* the period reads as the design's plain line until it is pointed at */
.kpi-period {
  @apply -mx-1 flex h-5 items-center gap-1 rounded-3 px-1 text-sm text-ink-gray-5 transition-colors;
}
.kpi-period:hover,
.kpi-period[data-state='open'] {
  @apply bg-surface-gray-2 text-ink-gray-7;
}
</style>
