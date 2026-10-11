<script setup lang="ts">
import { ref } from 'vue'
import { Button, SplitButton } from 'frappe-ui'

// A chat composer. Send goes now, and the chevron schedules the message.
// Both halves stay disabled until there's something to send.
const message = ref('')
const status = ref('')

function send(when?: string) {
  status.value = when ? `Scheduled for ${when}` : 'Sent'
  message.value = ''
}

const options = [
  {
    group: 'Send later',
    options: [
      {
        label: 'Tomorrow at 9:00 AM',
        icon: 'lucide-sunrise',
        onClick: () => send('tomorrow at 9:00 AM'),
      },
      {
        label: 'Monday at 9:00 AM',
        icon: 'lucide-calendar',
        onClick: () => send('Monday at 9:00 AM'),
      },
    ],
  },
]

const tools = [
  [
    { icon: 'lucide-paperclip', label: 'Attach a file' },
    { icon: 'lucide-type', label: 'Formatting' },
  ],
  [
    { icon: 'lucide-at-sign', label: 'Mention someone' },
    { icon: 'lucide-smile-plus', label: 'Add an emoji' },
  ],
  [
    { icon: 'lucide-chart-no-axes-column', label: 'Create a poll' },
    { icon: 'lucide-file-box', label: 'Share a document' },
  ],
]
</script>

<template>
  <div class="flex w-full max-w-lg flex-col gap-2">
    <p class="h-5 px-1 text-sm text-ink-gray-5">{{ status }}</p>
    <div
      class="flex flex-col gap-2 rounded-6 border border-outline-gray-2 bg-surface-base p-2"
    >
      <textarea
        v-model="message"
        rows="2"
        aria-label="Message"
        placeholder="Type a message…"
        class="w-full resize-none border-0 bg-transparent px-1 py-0.5 text-base text-ink-gray-8 placeholder:text-ink-gray-4 focus:outline-none focus:ring-0"
      />
      <div class="flex items-center gap-1">
        <template v-for="(group, i) in tools" :key="i">
          <span
            v-if="i > 0"
            class="mx-1 h-4 border-l border-outline-gray-2"
            aria-hidden="true"
          />
          <Button
            v-for="tool in group"
            :key="tool.icon"
            variant="ghost"
            :icon="tool.icon"
            :label="tool.label"
          />
        </template>
        <div class="flex-1" />
        <SplitButton
          label="Send"
          icon-left="lucide-send"
          menu-label="Schedule message"
          variant="solid"
          :disabled="!message.trim()"
          :options="options"
          @click="send()"
        />
      </div>
    </div>
  </div>
</template>
