<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '../../../src'
import { ListView } from '../../../experimental/ListView'
import { espressoListViewStatic } from './listViewClasses'

type Plan = {
  id: number
  cost: string
  cpu: string
  memory: string
  disk: string
}

// Laid out the way Tasks is: Cost names the row and takes the width, the rest
// are sized to what they hold and sit together on the right, with the action
// last and its button on the table's right edge.
const columns = [
  { label: 'Cost', key: 'cost', width: '1fr' },
  { label: 'CPU', key: 'cpu', width: '152px' },
  { label: 'Memory', key: 'memory', width: '136px' },
  { label: 'Disk', key: 'disk', width: '112px' },
  { label: '', key: 'action', width: '112px' },
]

const plans: Plan[] = [
  { id: 1, cost: '2,050', cpu: '2 compute hr/day', memory: '1GB Database', disk: '25 GB Disk' },
  { id: 2, cost: '4,100', cpu: '4 compute hr/day', memory: '2GB Database', disk: '25 GB Disk' },
  { id: 3, cost: '8,200', cpu: '8 compute hr/day', memory: '4 GB Database', disk: '25 GB Disk' },
  { id: 4, cost: '16,400', cpu: '16 compute hr/day', memory: '8GB Database', disk: '50 GB Disk' },
  { id: 5, cost: '24,600', cpu: '24 compute hr/day', memory: '12GB Database', disk: '50 GB Disk' },
  { id: 6, cost: '32,800', cpu: '32 compute hr/day', memory: '16GB Database', disk: '50 GB Disk' },
  { id: 7, cost: '41,000', cpu: '40 compute hr/day', memory: '20 GB Database', disk: '50 GB Disk' },
  { id: 8, cost: '82,000', cpu: '80 compute hr/day', memory: '40 GB Database', disk: '100 GB Disk' },
  { id: 9, cost: '1,23,000', cpu: '120 compute hr/day', memory: '60 GB Database', disk: '200 GB Disk' },
  { id: 10, cost: '1,64,000', cpu: '160 compute hr/day', memory: '80 GB Database', disk: '200 GB Disk' },
]

// `name` mirrors the id — ListView finds a selected row's neighbours by `name`.
const rows = plans.map((plan) => ({ ...plan, name: plan.id }))

// The plan in force draws a flat, unclickable label; every other row offers
// the upgrade.
const current = ref(1)
</script>

<template>
  <div class="w-[1180px] max-w-full overflow-x-auto">
    <!--
      No checkbox column, and no row click: every row already carries its own
      button, so the row itself is not a target. That costs the row hover,
      which ListView only gives a clickable row — the design doesn't draw one
      here either.
    -->
    <ListView
      :class="`!w-full ${espressoListViewStatic}`"
      :columns="columns"
      :rows="rows"
      row-key="id"
      :options="{ selectable: false, showTooltip: false, rowHeight: 40 }"
    >
      <!--
        `align: 'right'` on a column does nothing: ListView puts `justify-end`
        on the cell, which isn't a flex box. The push comes from inside.
      -->
      <template #cell="{ item, row, column }">
        <span
          class="flex min-w-0 items-center gap-2"
          :class="column.key === 'action' ? 'w-full justify-end' : ''"
        >
          <!-- The design's cost cell: an info glyph, the amount in ink-gray-8
               medium, then a lighter "/mo". -->
          <template v-if="column.key === 'cost'">
            <span
              class="lucide-info size-4 shrink-0 text-ink-gray-5"
              aria-hidden="true"
            />
            <!-- "/mo" runs on from the amount — a gap between them reads as
                 two separate values. -->
            <span class="text-base-medium text-ink-gray-8"
              >₹{{ (row as Plan).cost
              }}<span class="text-base text-ink-gray-5">/mo</span></span
            >
          </template>

          <Button
            v-else-if="column.key === 'action' && (row as Plan).id === current"
            size="sm"
            variant="ghost"
            label="Current plan"
            disabled
          />
          <!-- The plus is an icon in front of the label, not a character glued
               to the front of the word. -->
          <Button
            v-else-if="column.key === 'action'"
            size="sm"
            label="Upgrade"
            icon-left="lucide-plus"
            @click="current = (row as Plan).id"
          />

          <span v-else class="truncate text-base text-ink-gray-6">
            {{ item }}
          </span>
        </span>
      </template>
    </ListView>
  </div>
</template>
