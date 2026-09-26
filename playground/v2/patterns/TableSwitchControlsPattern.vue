<script setup lang="ts">
import { ref } from 'vue'
import { Dropdown, Switch } from '../../../src'
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

// Widths as the List version set them. Table rule: a column's label and its
// items share one left edge. The three gaps the rows show — first column's
// cut-off to For, For to the switch, switch to the menu glyph — come out
// equal (~92px) with `pl-21` placing For and the 198/90 tracks placing
// Enabled, while the first column still ends at 348.
const columns = [
  { label: 'Template name', key: 'name', width: 'minmax(0,1fr)' },
  { label: 'For', key: 'for', width: '198px', headerClass: 'pl-21' },
  { label: 'Enabled', key: 'enabled', width: '90px' },
  { label: '', key: 'actions', width: '40px' },
]

// Five rows from the design's email-template list.
const templates = ref([
  {
    id: 'welcome',
    name: 'Welcome to Frappe CRM',
    description:
      'Hi {name}, welcome aboard—here’s your quick start and a demo link.',
    for: 'Lead',
    enabled: true,
  },
  {
    id: 'demo-invite',
    name: 'Demo Invite – {deal.name}',
    description:
      'Let’s walk through a live demo for {{ deal.name }}. Pick a slot that works for you.',
    for: 'Deal',
    enabled: true,
  },
  {
    id: 'demo-follow-up',
    name: 'Follow-Up on Demo',
    description:
      'Thanks for joining the demo, {name}. Any questions or feedback?',
    for: 'Deal',
    enabled: false,
  },
  {
    id: 'contract-review',
    name: 'Contract Review',
    description:
      'Looking forward to your insights on the contract. Let’s finalize this!',
    for: 'Deal',
    enabled: true,
  },
  {
    id: 'onboarding',
    name: 'Onboarding Steps',
    description:
      'Excited to have you onboard! Here are the next steps for a smooth start.',
    for: 'Lead',
    enabled: false,
  },
])

function rowActions(name: string) {
  return [
    { label: 'Edit', icon: 'lucide-pencil', onClick: () => {} },
    { label: 'Duplicate', icon: 'lucide-copy', onClick: () => {} },
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
    The experimental ListView, drawn as the List family drew this table.
    Header and rows share one column grid, so every label sits exactly over
    its column (the design's header runs ~30px left of the rows — not
    followed). Rows hold a switch and a menu, so nothing about the row itself
    is a click target.
  -->
  <ListView
    :class="`w-[700px] max-w-full ${settingsListView}`"
    :columns="columns"
    :rows="templates"
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
      <!-- 14px above and below the 39px title/description: the design's 67px row. -->
      <div v-if="column.key === 'name'" class="min-w-0">
        <div class="truncate text-base-medium text-ink-gray-7">
          {{ row.name }}
        </div>
        <p class="mt-0.5 truncate text-p-base text-ink-gray-6">
          {{ row.description }}
        </p>
      </div>

      <span
        v-else-if="column.key === 'for'"
        class="truncate pl-21 text-base text-ink-gray-6"
      >
        {{ row.for }}
      </span>

      <Switch
        v-else-if="column.key === 'enabled'"
        v-model="row.enabled"
        size="sm"
        :aria-label="`Enable ${row.name}`"
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
