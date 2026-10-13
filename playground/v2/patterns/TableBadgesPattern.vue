<script setup lang="ts">
import { Badge, Dropdown } from '../../../src'
import {
  ListHeader,
  ListHeaderItem,
  ListRows,
  ListView,
} from '../../../experimental/ListView'
import {
  settingsListView,
  settingsListViewOptions,
} from '../settingsListViewClasses'

// Widths as the List version set them. `pl-10` on the status label and its
// badge together keeps them on one left edge while evening out the gaps
// either side of the column (~48px each) instead of 8 before and ~88 after.
const columns = [
  { label: 'Name', key: 'name', width: 'minmax(0,1fr)' },
  { label: 'Status', key: 'status', width: '136px', headerClass: 'pl-10' },
  { label: '', key: 'actions', width: '40px' },
]

type Status = 'completed' | 'in-progress' | 'cancelled'

// The design's badge states: green Completed, amber In progress, gray
// Cancelled — all `subtle`.
const statusBadge: Record<
  Status,
  { label: string; theme: 'green' | 'amber' | 'gray' }
> = {
  completed: { label: 'Completed', theme: 'green' },
  'in-progress': { label: 'In progress', theme: 'amber' },
  cancelled: { label: 'Cancelled', theme: 'gray' },
}

// Five rows from the design's import list, covering all three states.
const imports: {
  id: string
  name: string
  uploaded: string
  status: Status
}[] = [
  {
    id: 'deal-conflict',
    name: 'Deal_conflict.csv',
    uploaded: 'Uploaded just now',
    status: 'completed',
  },
  {
    id: 'csv-deal',
    name: 'CSV_deal.csv',
    uploaded: '2 days ago',
    status: 'in-progress',
  },
  {
    id: 'file-import',
    name: 'file_import_2135e72328.csv',
    uploaded: '2 days ago',
    status: 'cancelled',
  },
  {
    id: 'sales-data',
    name: 'sales_data_2023.csv',
    uploaded: '1 day ago',
    status: 'completed',
  },
  {
    id: 'monthly-report',
    name: 'monthly_report_jan.csv',
    uploaded: '1 hour ago',
    status: 'completed',
  },
]

function rowActions(name: string) {
  return [
    { label: 'Download', icon: 'lucide-download', onClick: () => {} },
    { label: 'View log', icon: 'lucide-scroll-text', onClick: () => {} },
    {
      label: `Delete ${name}`,
      icon: 'lucide-trash-2',
      theme: 'red' as const,
      onClick: () => {},
    },
  ]
}
</script>

<template>
  <!--
    The experimental ListView, drawn as the List family drew this table. Each
    row carries an actions menu, so nothing about the row itself is a click
    target — `settingsListViewOptions` is what turns selection, routing and
    the hover off, and what keeps ListRow from wrapping the cells in a button.
  -->
  <ListView
    :class="`w-[700px] max-w-full ${settingsListView}`"
    :columns="columns"
    :rows="imports"
    row-key="id"
    :options="settingsListViewOptions"
  >
    <template #default>
      <ListHeader>
        <!--
          The label goes in the slot rather than through `:class`:
          ListHeaderItem applies `$attrs.class` to its inner div, and Vue has
          already merged the same class onto its root, so any inset passed
          that way lands twice and the label drifts right of its column.
        -->
        <ListHeaderItem
          v-for="column in columns"
          :key="column.key"
          :item="column"
        >
          <span v-if="!column.label" class="sr-only">Actions</span>
          <div v-else class="truncate" :class="column.headerClass">
            {{ column.label }}
          </div>
        </ListHeaderItem>
      </ListHeader>
      <ListRows />
    </template>

    <template #cell="{ row, column }">
      <!-- 13px above and below the 39px name/time block: the design's 65px row. -->
      <div v-if="column.key === 'name'" class="min-w-0">
        <div class="truncate text-base-medium text-ink-gray-7">
          {{ row.name }}
        </div>
        <p class="mt-0.5 truncate text-p-base text-ink-gray-5">
          {{ row.uploaded }}
        </p>
      </div>

      <div v-else-if="column.key === 'status'" class="pl-10">
        <Badge
          :label="statusBadge[row.status].label"
          :theme="statusBadge[row.status].theme"
          variant="subtle"
          size="md"
        />
      </div>

      <div v-else class="flex justify-end">
        <Dropdown
          :options="rowActions(row.name)"
          :button="{
            variant: 'ghost',
            icon: 'lucide-ellipsis',
            'aria-label': `Actions for ${row.name}`,
          }"
        />
      </div>
    </template>
  </ListView>
</template>
