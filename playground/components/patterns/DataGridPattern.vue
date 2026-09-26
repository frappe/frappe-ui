<script setup lang="ts">
import { reactive } from 'vue'
import { Button, Checkbox } from '../../../src'
import {
  ListHeader,
  ListHeaderItem,
  ListRows,
  ListView,
} from '../../../experimental/ListView'
import SettingsIcon from '../icons/SettingsIcon.vue'
import EditIcon from '../icons/EditIcon.vue'

type Entry = {
  id: number
  from: string
  to: string
  fromDate: string
  toDate: string
  duration: string
}

// The checkbox, the serial number and the action keep the design's fixed
// widths; the five data columns share what is left of the 1180 — the design
// draws them at 125 each, where the dates clip.
//
// The checkbox is a column of its own rather than ListView's built-in one —
// that arrives as a bare 14px track outside the column grid, which can't be
// boxed like the cells beside it.
const columns = [
  { label: '', key: 'select', width: '34px' },
  { label: 'No', key: 'id', width: '48px', align: 'center' },
  { label: 'From', key: 'from', width: '1fr' },
  { label: 'To', key: 'to', width: '1fr' },
  { label: 'From date', key: 'fromDate', width: '1fr' },
  { label: 'To Date', key: 'toDate', width: '1fr' },
  { label: 'Duration', key: 'duration', width: '1fr' },
  { label: '', key: 'action', width: '40px' },
]

const entries: Entry[] = [
  { id: 1, from: 'Qualification', to: 'Won', fromDate: '2024-04-16 14:32:07', toDate: '2024-04-16 21:04:55', duration: '776326172683' },
  { id: 2, from: 'Won', to: 'Proposal/Quotation', fromDate: '2024-04-16 14:32:07', toDate: '2024-04-16 21:04:55', duration: '776326172683' },
  { id: 3, from: 'Client Meeting', to: 'Scheduled', fromDate: '2024-04-16 14:32:07', toDate: '2024-04-16 21:04:55', duration: '776326172683' },
  { id: 4, from: 'Project Kickoff', to: 'Meeting', fromDate: '2024-04-16 14:32:07', toDate: '2024-04-16 21:04:55', duration: '776326172683' },
  { id: 5, from: 'Design Iteration', to: 'Review', fromDate: '2024-04-16 14:32:07', toDate: '2024-04-16 21:04:55', duration: '776326172683' },
  { id: 6, from: 'Review', to: 'Handover', fromDate: '2024-04-17 09:10:41', toDate: '2024-04-17 18:22:03', duration: '776326172683' },
  { id: 7, from: 'Handover', to: 'Closed', fromDate: '2024-04-18 11:04:19', toDate: '2024-04-18 16:47:30', duration: '776326172683' },
  { id: 8, from: 'Negotiation', to: 'Qualification', fromDate: '2024-04-19 08:55:12', toDate: '2024-04-19 13:31:58', duration: '776326172683' },
  { id: 9, from: 'Discovery', to: 'Negotiation', fromDate: '2024-04-22 15:20:06', toDate: '2024-04-22 19:58:44', duration: '776326172683' },
  { id: 10, from: 'Scheduled', to: 'Client Meeting', fromDate: '2024-04-23 10:02:37', toDate: '2024-04-23 17:12:29', duration: '776326172683' },
]

// `name` mirrors the id — ListView finds a selected row's neighbours by `name`.
const rows = entries.map((entry) => ({ ...entry, name: entry.id }))

const picked = reactive(new Set<number>())
const toggle = (id: number) =>
  picked.has(id) ? picked.delete(id) : picked.add(id)
const toggleAll = () =>
  picked.size === entries.length
    ? picked.clear()
    : entries.forEach((entry) => picked.add(entry.id))

/**
 * The data-grid look, carried over from the settings modal: every cell is
 * boxed, so the rules run vertically as well as across.
 *
 * ListView's own pieces get in the way of that and are undone here — its 16px
 * column gap and 8px row padding would leave gaps in the vertical rules, its
 * label row is a filled bar, and its hover wash would paint over the boxes.
 */
const gridClasses = [
  // No gap and no row padding: the cells have to meet for the rules to join up.
  '[&_.grid]:!gap-0 [&_.grid]:!px-0',
  // Cells: full height, boxed, centred, 8px of padding inside.
  '[&_.grid>*]:flex [&_.grid>*]:h-full [&_.grid>*]:items-center [&_.grid>*]:px-2',
  '[&_.grid>*]:border-b [&_.grid>*]:border-r [&_.grid>*]:border-outline-gray-1',
  // …except the two that hold a control: at 34 and 40 wide, 8px of padding
  // each side leaves less room than the control needs, so it can't centre.
  '[&_.grid>*:first-child]:!px-0 [&_.grid>*:first-child]:justify-center',
  '[&_.grid>*:last-child]:!px-0 [&_.grid>*:last-child]:justify-center',
  // Last row, last column: their rules would sit beside the wrapper's border
  // and read as a double line.
  '[&_.grid>*:last-child]:!border-r-0',
  '[&_.transition-all.flex-col:last-child_.grid>*]:!border-b-0',
  // The label row: 32px, no fill, no rounding, no bottom margin — its cells
  // carry the rules instead.
  '[&_.grid.rounded-4.bg-surface-gray-2]:!mb-0 [&_.grid.rounded-4.bg-surface-gray-2]:!h-8 [&_.grid.rounded-4.bg-surface-gray-2]:!rounded-none [&_.grid.rounded-4.bg-surface-gray-2]:!bg-transparent [&_.grid.rounded-4.bg-surface-gray-2]:!p-0',
  // Rows are boxes here, not washes: a hover fill would cover the rules.
  '[&_.transition-all.flex-col]:!rounded-none',
  // ListView draws its own rule between rows; the cell borders replace it.
  '[&_.h-px.border-t]:hidden',
  // A focus ring is drawn 3px outside its control, and ListView nests boxes
  // that clip it: the cells, the rows container and this wrapper. This grid
  // has its own class list rather than the shared one, so it repeats them.
  '[&_.overflow-x-hidden]:!overflow-visible',
  '[&_.h-full.overflow-y-auto]:!overflow-visible',
  '!overflow-visible',
].join(' ')
</script>

<template>
  <!-- Its outline is the same line colour as its cells. -->
  <div class="w-[1180px] max-w-full overflow-x-auto rounded-4 border border-outline-gray-1">
    <ListView
      :class="`!w-full ${gridClasses}`"
      :columns="columns"
      :rows="rows"
      row-key="id"
      :options="{ selectable: false, showTooltip: false, rowHeight: 40 }"
    >
      <!--
        Composed by hand so the two label-less columns can carry the design's
        select-all checkbox and column-settings gear.
      -->
      <template #default>
        <ListHeader>
          <ListHeaderItem
            v-for="column in columns"
            :key="column.key"
            :item="column"
          >
            <Checkbox
              v-if="column.key === 'select'"
              :model-value="picked.size === entries.length"
              :indeterminate="picked.size > 0 && picked.size < entries.length"
              aria-label="Select all rows"
              @click="toggleAll"
            />
            <!--
              A label, not a control: same ink as every other header label.
              Espresso's own cog (node 34900:31849), not lucide's — eight
              teeth against six, and a narrower bore.
            -->
            <SettingsIcon
              v-else-if="column.key === 'action'"
              class="text-ink-gray-5"
              role="img"
              aria-label="Column settings"
            />
            <span v-else>{{ column.label }}</span>
          </ListHeaderItem>
        </ListHeader>
        <ListRows />
      </template>

      <template #cell="{ item, row, column }">
        <Checkbox
          v-if="column.key === 'select'"
          :model-value="picked.has((row as Entry).id)"
          :aria-label="`Select row ${(row as Entry).id}`"
          @click.stop="toggle((row as Entry).id)"
        />
        <!--
          The design's per-row action: an edit button, ghost and icon-only,
          carrying Espresso's own mark (node 34900:31853). The file fills it
          ink-gray-9, which is heavier than an action in a row wants to read
          — ink-gray-6 here. The `#icon` slot is what keeps the button
          icon-only — the `icon` prop only takes a lucide name.
        -->
        <Button
          v-else-if="column.key === 'action'"
          variant="ghost"
          size="sm"
          :aria-label="`Edit row ${(row as Entry).id}`"
          @click.stop
        >
          <template #icon><EditIcon class="text-ink-gray-6" /></template>
        </Button>
        <!-- Nothing in a grid row is the row's name, so no cell is picked out
             in ink-gray-8 medium the way the other tables do it. -->
        <span v-else class="truncate text-base text-ink-gray-6">
          {{ item }}
        </span>
      </template>
    </ListView>
  </div>
</template>
