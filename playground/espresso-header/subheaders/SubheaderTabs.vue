<template>
  <ESubheader variant="tabs">
    <template #left>
      <TabButtons
        v-model="tab"
        :options="tabs"
        variant="underline"
        size="sm"
        class="fill-row h-10 cursor-pointer"
      >
        <template #prefix="{ button, active }">
          <EIcon
            :name="icons[button.value]"
            class="size-4"
            :class="active ? 'text-ink-gray-8' : 'text-ink-gray-5'"
          />
        </template>
      </TabButtons>
    </template>
  </ESubheader>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { TabButtons } from '../../../src'
import EIcon from '../../espresso-sidebar/EIcon.vue'
import ESubheader from '../ESubheader.vue'

const tab = ref('activity')
const tabs = [
  { label: 'Activity', value: 'activity' },
  { label: 'Emails', value: 'emails' },
  { label: 'Calls', value: 'calls' },
  { label: 'Events', value: 'events' },
  { label: 'Tasks', value: 'tasks' },
  { label: 'Notes', value: 'notes' },
]
const icons: Record<string, string> = {
  activity: 'activity',
  emails: 'email-openvv',
  calls: 'call',
  events: 'event',
  tasks: 'tasks',
  notes: 'notes',
}
</script>

<style scoped>
/* The design's tabs fill the 40px row, so the underline rail and the active
   indicator ride its bottom edge. Frappe's pills are shorter on their own. */
.fill-row :deep([data-slot='tab-buttons']) {
  height: 40px;
}
.fill-row :deep([data-slot='tab-button']),
.fill-row :deep([data-slot='tab-button'] > *) {
  height: 100%;
}
</style>
