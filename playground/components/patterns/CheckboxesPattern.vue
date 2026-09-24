<script setup lang="ts">
import { reactive } from 'vue'
import { Checkbox } from '../../../src'
import { ListView } from '../../../experimental/ListView'
import { espressoListViewStatic } from './listViewClasses'

type Notification = {
  id: number
  title: string
  description: string
}

// Each checkbox sits under the middle of its own label, so the two narrow
// columns read as a pair rather than as two left edges.
const columns = [
  { label: 'Notify me about', key: 'title', width: '1fr' },
  { label: 'In-app', key: 'inApp', width: '96px' },
  { label: 'Mail', key: 'mail', width: '96px' },
]

const notifications: Notification[] = [
  {
    id: 1,
    title: 'New ticket assigned',
    description: 'When a ticket is routed to you',
  },
  {
    id: 2,
    title: 'Ticket status updated',
    description: 'Any status change (e.g., Open → In Progress)',
  },
  {
    id: 3,
    title: 'Ticket follow-up due',
    description: 'Pending customer response or SLA nearing',
  },
  {
    id: 4,
    title: 'Ticket closed',
    description: 'Resolved or marked as completed',
  },
  {
    id: 5,
    title: 'Customer replied',
    description: 'New response from the customer',
  },
  {
    id: 6,
    title: 'Mentioned in a comment',
    description: 'Someone names you on a thread',
  },
  {
    id: 7,
    title: 'SLA breached',
    description: 'A ticket has passed its response target',
  },
  {
    id: 8,
    title: 'Ticket reopened',
    description: 'A closed ticket is active again',
  },
  {
    id: 9,
    title: 'Daily digest',
    description: 'One summary of everything each morning',
  },
  {
    id: 10,
    title: 'Product updates',
    description: 'New releases and changes to the app',
  },
]

// `name` mirrors the id — ListView finds a selected row's neighbours by `name`.
const rows = notifications.map((n) => ({ ...n, name: n.id }))

/** ListView hands the cell slot its own copy of the row, so writes go here. */
const channels = reactive(
  Object.fromEntries(
    notifications.map((n) => [n.id, { inApp: n.id <= 4, mail: n.id === 3 }]),
  ) as Record<number, { inApp: boolean; mail: boolean }>,
)
</script>

<template>
  <!-- The first column takes the slack; the two narrow ones stay paired at the right. -->
  <div class="w-[1180px] max-w-full overflow-x-auto">
    <!--
      Two checkboxes per row, so the row itself is never a click target — and
      with no row click ListView draws no hover, which is right here.
      62px rows, not 63: the settings-modal rule is 12px above and below a
      row's content so that content clears content by 24. ListView draws a 1px
      rule between rows where V1's list draws none, so 12 each side would come
      to 25 — 62 puts the gap back on 24.
    -->
    <ListView
      :class="`!w-full ${espressoListViewStatic}`"
      :columns="columns"
      :rows="rows"
      row-key="id"
      :options="{ selectable: false, showTooltip: false, rowHeight: 62 }"
    >
      <template #cell="{ row, column }">
        <span class="flex min-w-0 items-center">
          <span v-if="column.key === 'title'" class="min-w-0">
            <span class="block truncate text-base-medium text-ink-gray-8">
              {{ (row as Notification).title }}
            </span>
            <span class="mt-[2px] block truncate text-p-base text-ink-gray-6">
              {{ (row as Notification).description }}
            </span>
          </span>

          <!--
            The label is repeated, invisible, to set the box's width — the
            checkbox then centres on exactly the text above it, whatever that
            text is, with no measured offsets to keep in step. `text-sm`
            because that is what ListView sets its own labels in.
          -->
          <span v-else class="grid place-items-center">
            <span
              class="invisible col-start-1 row-start-1 text-sm"
              aria-hidden="true"
            >
              {{ column.label }}
            </span>
            <Checkbox
              v-model="
                channels[(row as Notification).id][
                  column.key as 'inApp' | 'mail'
                ]
              "
              class="col-start-1 row-start-1"
              size="md"
              :aria-label="`${column.label} for ${(row as Notification).title}`"
              @click.stop
            />
          </span>
        </span>
      </template>
    </ListView>
  </div>
</template>
