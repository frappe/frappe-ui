<script setup lang="ts">
import { ref } from 'vue'
import { Avatar, Badge, Dropdown, Select } from '../../../src'
import { faceFor } from '../../components/patterns/designAssets'
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
import * as shellPending from '../../pendingFrappeUIChanges'

// Widths as the List version set them: the name column takes what's left of
// 700 after the 98px role, the 40px menu and the two 8px gaps.
const columns = [
  { label: 'Name', key: 'name', width: 'minmax(0,1fr)' },
  // The ghost Select insets its value by its own `px-2`, so the label takes
  // the same 8px to line up with the roles beneath it.
  { label: 'Role', key: 'role', width: '98px', headerClass: 'pl-2' },
  { label: '', key: 'actions', width: '40px' },
]

const roleOptions = [
  { label: 'Admin', value: 'Admin' },
  { label: 'Editor', value: 'Editor' },
  { label: 'Member', value: 'Member' },
  { label: 'Guest', value: 'Guest' },
]

// Five rows is enough to show the pattern, including the inactive state.
const members = ref([
  {
    id: 1,
    name: 'Jayaprakash',
    email: 'jayaprakash@frappe.io',
    role: 'Member',
    inactive: false,
  },
  {
    id: 2,
    name: 'Ella Thompson',
    email: 'ellathompson@frappe.io',
    role: 'Admin',
    inactive: false,
  },
  {
    id: 3,
    name: 'Olivia Martinez',
    email: 'oliviamartinez@frappe.io',
    role: 'Member',
    inactive: false,
  },
  {
    id: 4,
    name: 'Ryan Scott',
    email: 'ryanscott@frappe.io',
    role: 'Guest',
    inactive: false,
  },
  {
    id: 5,
    name: 'Emma Brown',
    email: 'emma.b@frappe.io',
    role: 'Editor',
    inactive: true,
  },
])

function rowActions(name: string) {
  return [
    { label: 'Resend invite', icon: 'lucide-send', onClick: () => {} },
    { label: 'Copy email', icon: 'lucide-copy', onClick: () => {} },
    {
      label: `Remove ${name}`,
      icon: 'lucide-user-minus',
      theme: 'red' as const,
      onClick: () => {},
    },
  ]
}
</script>

<template>
  <!--
    The experimental ListView, drawn as the List family drew this table.
    Rows hold two controls (the role select and the actions menu), so nothing
    about a row is a click target: `settingsListViewOptions` turns selection
    off and returns no route, which is also what keeps ListRow from wrapping
    the cells in a button.

    Header and rows are composed by hand rather than left to ListView's
    default, because the role label needs its own 8px inset.
  -->
  <ListView
    :class="`w-[700px] max-w-full ${settingsListView}`"
    :columns="columns"
    :rows="members"
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
      <!-- 13px above and below the 39px name/email block: the design's 65px row. -->
      <div v-if="column.key === 'name'" class="flex min-w-0 items-center gap-2">
        <!--
          A photo for everyone who has actually joined; the inactive row keeps
          its initial, which is what an account with no one behind it shows.
        -->
        <Avatar
          size="xl"
          :label="row.name"
          :image="row.inactive ? undefined : faceFor(row.name)"
          class="shrink-0"
          :class="{ 'opacity-50': row.inactive }"
        />
        <div class="min-w-0">
          <div class="flex items-center gap-1.5">
            <span class="truncate text-base-medium text-ink-gray-7">
              {{ row.name }}
            </span>
            <!-- `sm` (16px): an `md` badge is 20 and made this one row 4px
                 taller than the rest. -->
            <Badge v-if="row.inactive" label="Inactive" size="sm" />
          </div>
          <p class="mt-0.5 truncate text-p-base text-ink-gray-5">
            {{ row.email }}
          </p>
        </div>
      </div>

      <!--
        `w-full` pins every select to the column's width, so the role labels
        start on one line and the chevrons finish on another.
      -->
      <Select
        v-else-if="column.key === 'role'"
        v-model="row.role"
        class="w-full"
        :class="shellPending.ghostSelectFocus"
        variant="ghost"
        size="sm"
        :options="roleOptions"
        placeholder="Select role"
        :aria-label="`Role for ${row.name}`"
      />

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
