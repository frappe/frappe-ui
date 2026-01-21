<script setup lang="ts">
import { ref } from 'vue'
import { Avatar, Combobox } from 'frappe-ui'
import LucideSettings from '~icons/lucide/settings'

const value = ref('')

const options = [
  { label: 'John Doe', value: 'john-doe' },
  { label: 'Jane Doe', value: 'jane-doe' },
  { label: 'John Smith', value: 'john-smith' },

  {
    type: 'custom',
    key: 'profile',
    label: 'View Profile',
    slotName: 'profile',
  },
  {
    type: 'custom',
    key: 'settings',
    label: 'Settings',
    slotName: 'settings',
  },
]
</script>

<template>
  <Combobox v-model="value" :options="options" placeholder="Type…">
    <template #profile>
      <Avatar label="F" size="sm" />
      <span class="ml-2">View Profile</span>
    </template>

    <template #settings>
      <div class="flex items-center gap-2">
        <LucideSettings class="size-4" />
        <span>Open Settings</span>
      </div>
    </template>
  </Combobox>
</template>
