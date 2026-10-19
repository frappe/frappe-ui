<script setup lang="ts">
import { ref } from 'vue'
import { PercentageBarChart } from 'frappe-ui/charts'
import type { DonutSliceEvent } from 'frappe-ui/charts'

const diskBySite = [
  { site: 'shop.example.com', gb: 214 },
  { site: 'crm.example.com', gb: 96 },
  { site: 'docs.example.com', gb: 41 },
  { site: 'staging.example.com', gb: 12 },
  { site: 'blog.example.com', gb: 7 },
  { site: 'status.example.com', gb: 3 },
  { site: 'links.example.com', gb: 1 },
]

const gigabytes = (value: number) => `${value} GB`

const slice = ref<DonutSliceEvent | null>(null)
</script>

<template>
  <div class="flex h-56 w-full flex-col gap-2">
    <div class="min-h-0 flex-1">
      <PercentageBarChart
        :data="diskBySite"
        category="site"
        value="gb"
        :max-slices="4"
        :format="gigabytes"
        title="Disk used by site"
        subtitle="374 GB across 7 sites"
        @select="slice = $event"
      />
    </div>
    <p class="text-p-sm text-ink-gray-5">
      <template v-if="slice">
        Selected {{ slice.label }} · {{ slice.percent }}% ·
        {{ slice.rows.length }} row(s) behind it
      </template>
      <template v-else
        >Select a slice — Others carries every row it groups.</template
      >
    </p>
  </div>
</template>
