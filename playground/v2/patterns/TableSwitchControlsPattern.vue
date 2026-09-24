<script setup lang="ts">
import { ref } from 'vue'
import { Dropdown, Switch } from '../../../src'
import {
  List,
  ListCell,
  ListHeader,
  ListHeaderCell,
  ListRow,
} from '../../../src/molecules/list'

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
    frappe-ui's List family in table mode. Header and rows share one column
    grid, so every label sits exactly over its column (the design's header runs
    ~30px left of the rows — not followed). Rows hold a switch and a menu, so
    they stay static; `list-row-px-0` keeps the text flush with the pattern's
    left edge.
  -->
  <List
    class="w-[700px] max-w-full list-row-px-0 [&_[data-slot=list-header]]:!h-10"
    :columns="['minmax(0,1fr)', '198px', '90px', '40px']"
  >
    <ListHeader>
      <ListHeaderCell>Template name</ListHeaderCell>
      <!--
        Table rule: a column's label and its items share one left edge. The
        three gaps as the rows show them — first column's cut-off → For,
        For → switch, switch → the "…" glyph — are equal (~92px), so the
        columns read evenly: `pl-21` (+ the list's 8px gap) places For, and
        the 198 / 90px tracks place Enabled, while the first column still
        ends at 348px.
      -->
      <ListHeaderCell class="pl-21">For</ListHeaderCell>
      <ListHeaderCell>Enabled</ListHeaderCell>
      <ListHeaderCell><span class="sr-only">Actions</span></ListHeaderCell>
    </ListHeader>

    <!-- 14px above and below the 39px title/description: the design's 67px row. -->
    <ListRow v-for="template in templates" :key="template.id" class="py-3">
      <ListCell>
        <div class="min-w-0">
          <div class="truncate text-base-medium text-ink-gray-7">
            {{ template.name }}
          </div>
          <p class="mt-0.5 truncate text-p-base text-ink-gray-6">
            {{ template.description }}
          </p>
        </div>
      </ListCell>

      <ListCell class="pl-21">
        <span class="truncate text-base text-ink-gray-6">
          {{ template.for }}
        </span>
      </ListCell>

      <ListCell>
        <Switch
          v-model="template.enabled"
          size="sm"
          :aria-label="`Enable ${template.name}`"
        />
      </ListCell>

      <ListCell class="justify-end">
        <Dropdown
          :options="rowActions(template.name)"
          :button="{
            variant: 'ghost',
            icon: 'lucide-ellipsis',
            'aria-label': `Actions for ${template.name}`,
          }"
        />
      </ListCell>
    </ListRow>
  </List>
</template>
