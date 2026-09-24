<script setup lang="ts">
import { Badge, Dropdown } from '../../../src'
import {
  List,
  ListCell,
  ListHeader,
  ListHeaderCell,
  ListRow,
} from '../../../src/molecules/list'

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
    frappe-ui's List family in table mode. Each row carries an actions menu,
    so rows stay static; `list-row-px-0` keeps the text flush with the
    pattern's left edge. Column labels sit on the same left edge as their
    items, and the gaps between columns are even (see `pl-` below).
  -->
  <List
    class="w-[700px] max-w-full list-row-px-0 [&_[data-slot=list-header]]:!h-10"
    :columns="['minmax(0,1fr)', '136px', '40px']"
  >
    <ListHeader>
      <ListHeaderCell>Name</ListHeaderCell>
      <!--
        `pl-10` on the label and the badge together: it keeps them on one left
        edge while evening out the gaps either side of the badge column
        (~48px each) instead of 8px before and ~88px after.
      -->
      <ListHeaderCell class="pl-10">Status</ListHeaderCell>
      <ListHeaderCell><span class="sr-only">Actions</span></ListHeaderCell>
    </ListHeader>

    <!-- 13px above and below the 39px name/time block: the design's 65px row. -->
    <ListRow v-for="item in imports" :key="item.id" class="py-3">
      <ListCell>
        <div class="min-w-0">
          <div class="truncate text-base-medium text-ink-gray-7">
            {{ item.name }}
          </div>
          <p class="mt-0.5 truncate text-p-base text-ink-gray-5">
            {{ item.uploaded }}
          </p>
        </div>
      </ListCell>

      <ListCell class="pl-10">
        <Badge
          :label="statusBadge[item.status].label"
          :theme="statusBadge[item.status].theme"
          variant="subtle"
          size="md"
        />
      </ListCell>

      <ListCell class="justify-end">
        <Dropdown
          :options="rowActions(item.name)"
          :button="{
            variant: 'ghost',
            icon: 'lucide-ellipsis',
            'aria-label': `Actions for ${item.name}`,
          }"
        />
      </ListCell>
    </ListRow>
  </List>
</template>
