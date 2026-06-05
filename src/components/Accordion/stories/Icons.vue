<script setup lang="ts">
import { Accordion } from 'frappe-ui'

const items = [
  {
    value: 'profile',
    title: 'Profile',
    icon: 'lucide-user',
    content: 'Update your name, avatar, and public profile details.',
  },
  {
    value: 'security',
    title: 'Security',
    icon: 'lucide-shield',
    content: 'Change your password and manage two-factor authentication.',
  },
  {
    value: 'archived',
    title: 'Archived (disabled)',
    icon: 'lucide-archive',
    content: 'This section is read-only.',
    disabled: true,
  },
]
</script>

<template>
  <div class="w-full max-w-lg">
    <Accordion :items="items">
      <template #item-content="{ item }">
        <p class="text-p-base text-ink-gray-6">{{ item.content }}</p>
      </template>
    </Accordion>
  </div>
</template>
