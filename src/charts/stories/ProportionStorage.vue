<script setup lang="ts">
import { ref } from 'vue'
import { ProportionBar } from 'frappe-ui/charts'
import type { ProportionSegmentEvent } from 'frappe-ui/charts'

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

const selected = ref<ProportionSegmentEvent | null>(null)
</script>

<template>
  <div class="flex h-full min-h-52 w-full items-center justify-center">
    <div class="flex w-full max-w-lg flex-col gap-3">
      <ProportionBar
        :data="diskBySite"
        category="site"
        value="gb"
        :max-segments="4"
        :format="gigabytes"
        title="Disk used"
        subtitle="374 GB of 500 GB"
        @select="selected = $event"
      />
      <p class="text-p-sm text-ink-gray-5">
        <template v-if="selected">
          Selected {{ selected.name }} · {{ Math.round(selected.percent) }}% ·
          {{ selected.rows.length }} site(s) behind it
        </template>
        <template v-else>
          Select a segment — Others carries every site it groups.
        </template>
      </p>
    </div>
  </div>
</template>
