<script setup lang="ts">
import { ref } from 'vue'
import { SplitButton } from 'frappe-ui'

// A mail composer: Send goes now, and the chevron schedules it instead.
const sent = ref('')

const options = [
  {
    group: 'Send later',
    options: [
      {
        label: 'Tomorrow at 8:00 AM',
        icon: 'lucide-sunrise',
        onClick: () => (sent.value = 'Scheduled for tomorrow at 8:00 AM'),
      },
      {
        label: 'Monday at 8:00 AM',
        icon: 'lucide-calendar',
        onClick: () => (sent.value = 'Scheduled for Monday at 8:00 AM'),
      },
    ],
  },
]
</script>

<template>
  <div
    class="flex w-full max-w-md items-center gap-2 rounded-6 border border-outline-gray-2 p-2"
  >
    <span class="flex-1 truncate px-1 text-base text-ink-gray-5">
      {{ sent || 'Draft saved' }}
    </span>
    <SplitButton
      label="Send"
      icon-left="lucide-send-horizontal"
      menu-label="Schedule send"
      variant="solid"
      :options="options"
      @click="sent = 'Sent'"
    />
  </div>
</template>
