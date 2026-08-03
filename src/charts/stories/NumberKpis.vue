<script setup lang="ts">
import { ref } from 'vue'
import { Dropdown } from 'frappe-ui'
import { NumberCard } from 'frappe-ui/charts'
import type { NumberCardProps } from 'frappe-ui/charts'

const revenueTrend = [
  144500, 150700, 157400, 172700, 188600, 171700, 177100, 186700, 193600,
  202100, 209500, 220200,
]

const cards: NumberCardProps[] = [
  {
    title: 'Net revenue',
    value: 220200,
    prefix: '$',
    compact: true,
    delta: 5.1,
    deltaSuffix: '%',
    sparkline: { data: revenueTrend },
  },
  {
    title: 'Monthly churn',
    value: 2.1,
    suffix: '%',
    precision: 1,
    delta: -0.4,
    deltaSuffix: 'pts',
    deltaCaption: 'vs last month',
    // Churn falling is the good direction, so the arrow colors flip.
    negativeIsBetter: true,
  },
  { title: 'Orders shipped', value: 2560 },
  { title: 'Refunds', value: null },
]

// The card states the comparison period; picking it is the app's business.
const period = ref('last month')
const periodOptions = ['last month', 'last quarter', 'last year'].map(
  (label) => ({ label: `vs ${label}`, onClick: () => (period.value = label) }),
)
</script>

<template>
  <div class="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
    <NumberCard v-bind="cards[0]">
      <template #caption>
        <Dropdown :options="periodOptions" placement="left">
          <!-- Not a Button: every Button size carries a fixed height and would
               push the 20px caption row open. -->
          <button
            type="button"
            class="-mx-1 flex h-5 min-w-0 items-center gap-1 rounded-sm px-1 text-sm text-ink-gray-5 outline-none hover:bg-surface-gray-2 hover:text-ink-gray-7 focus-visible:ring-2 focus-visible:ring-outline-gray-3"
          >
            <span class="truncate">vs {{ period }}</span>
            <span
              class="lucide-chevron-down size-3.5 shrink-0"
              aria-hidden="true"
            />
          </button>
        </Dropdown>
      </template>
    </NumberCard>
    <NumberCard
      v-for="card in cards.slice(1)"
      :key="card.title"
      v-bind="card"
    />
  </div>
</template>
