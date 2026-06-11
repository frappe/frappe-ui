<script setup lang="ts">
import { ref } from 'vue'
import { Button, Combobox, Dialog } from 'frappe-ui'

const open = ref(false)
const repo = ref('frappe-ui')
const reaction = ref('')

const repos = [
  'gameplan',
  'frappe-ui',
  'frappe',
  'erpnext',
  'helpdesk',
  'crm',
  'wiki',
  'insights',
]

const emojis = [
  {
    group: 'Smileys',
    options: [
      { label: 'Grinning', value: 'grinning', icon: '😀' },
      { label: 'Laughing', value: 'laughing', icon: '😂' },
      { label: 'Heart Eyes', value: 'heart-eyes', icon: '😍' },
      { label: 'Thinking', value: 'thinking', icon: '🤔' },
    ],
  },
  {
    group: 'Gestures',
    options: [
      { label: 'Thumbs Up', value: 'thumbs-up', icon: '👍' },
      { label: 'Party', value: 'party', icon: '🎉' },
      { label: 'Fire', value: 'fire', icon: '🔥' },
    ],
  },
]
</script>

<template>
  <Button @click="open = true">Open dialog</Button>

  <Dialog v-model="open">
    <template #body-title>
      <h3 class="text-4xl-semibold text-ink-gray-9">
        Combobox inside Dialog
      </h3>
    </template>

    <template #body-content>
      <div class="space-y-4">
        <div class="flex flex-col gap-1">
          <label class="text-sm text-ink-gray-7">Repository</label>
          <Combobox
            v-model="repo"
            :options="repos"
            placeholder="Pick a repo"
            open-on-focus
          />
        </div>

        <div class="flex flex-col gap-1">
          <label class="text-sm text-ink-gray-7">Reaction</label>
          <Combobox
            v-model="reaction"
            trigger="button"
            :options="emojis"
            placeholder="Pick a reaction"
          >
            <template #prefix>
              <span class="lucide-smile size-4 text-ink-gray-6" />
            </template>
          </Combobox>
        </div>

        <div class="rounded bg-surface-gray-1 p-3 text-sm text-ink-gray-7">
          <div>
            Repo: <code>{{ repo || 'None' }}</code>
          </div>
          <div>
            Reaction: <code>{{ reaction || 'None' }}</code>
          </div>
        </div>
      </div>
    </template>

    <template #actions="{ close }">
      <Button variant="solid" @click="close">Done</Button>
    </template>
  </Dialog>
</template>
