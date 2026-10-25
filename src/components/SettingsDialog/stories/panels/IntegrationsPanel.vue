<script setup lang="ts">
import { ref } from 'vue'
import { Badge, Button, SettingsBody, SettingsHeader } from 'frappe-ui'

const integrations = ref([
  {
    name: 'Calendar sync',
    description: 'Show due dates in Google Calendar or Outlook.',
    icon: 'lucide-calendar',
    connected: true,
  },
  {
    name: 'GitHub',
    description: 'Link pull requests to tasks and close them on merge.',
    icon: 'lucide-git-pull-request',
    connected: true,
  },
  {
    name: 'Slack',
    description: 'Post new discussions to a channel.',
    icon: 'lucide-message-square',
    connected: false,
  },
  {
    name: 'Cloud storage',
    description: 'Attach files from Google Drive or Dropbox.',
    icon: 'lucide-hard-drive',
    connected: false,
  },
  {
    name: 'Webhooks',
    description: 'Send workspace events to your own server.',
    icon: 'lucide-webhook',
    connected: false,
  },
])
</script>

<template>
  <SettingsHeader
    title="Integrations"
    description="Connect the tools your team already uses."
  />
  <SettingsBody>
    <div class="mt-4 divide-y divide-outline-gray-1">
      <div
        v-for="app in integrations"
        :key="app.name"
        class="flex items-center gap-4 py-3.5"
      >
        <div
          class="grid size-9 shrink-0 place-items-center rounded-5 bg-surface-gray-2"
        >
          <span
            :class="[app.icon, 'size-4 text-ink-gray-6']"
            aria-hidden="true"
          />
        </div>
        <div class="min-w-0 flex-1">
          <div class="flex items-center gap-2">
            <span class="text-base-medium text-ink-gray-8">{{ app.name }}</span>
            <Badge v-if="app.connected" theme="green">
              <template #prefix><span class="lucide-check" /></template>
              Connected
            </Badge>
          </div>
          <div class="mt-1 text-base text-ink-gray-6">
            {{ app.description }}
          </div>
        </div>
        <Button
          v-if="app.connected"
          variant="ghost"
          @click="app.connected = false"
        >
          Disconnect
        </Button>
        <Button v-else @click="app.connected = true">Connect</Button>
      </div>
    </div>
  </SettingsBody>
</template>
