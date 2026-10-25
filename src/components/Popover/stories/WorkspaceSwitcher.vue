<script setup lang="ts">
import { ref } from 'vue'
import { Avatar, Popover } from 'frappe-ui'

const workspaces = ['Acme Inc', 'Globex', 'Initech']
const current = ref(workspaces[0])

function pick(value: string, close: () => void) {
  current.value = value
  close()
}
</script>

<template>
  <Popover match-trigger-width>
    <template #trigger>
      <button
        type="button"
        class="flex h-8 w-60 items-center gap-2 rounded-4 bg-surface-gray-2 px-2 text-base text-ink-gray-8 hover:bg-surface-gray-3"
      >
        <Avatar :label="current" size="sm" shape="square" theme="blue" />
        <span class="flex-1 truncate text-left">{{ current }}</span>
        <span
          class="lucide-chevrons-up-down size-4 text-ink-gray-5"
          aria-hidden="true"
        />
      </button>
    </template>
    <template #default="{ close }">
      <div class="p-1">
        <button
          v-for="workspace in workspaces"
          :key="workspace"
          type="button"
          class="flex w-full items-center gap-2 rounded-4 px-2 py-1.5 text-left text-base text-ink-gray-8 hover:bg-surface-gray-2"
          @click="pick(workspace, close)"
        >
          <Avatar :label="workspace" size="sm" shape="square" theme="blue" />
          <span class="flex-1">{{ workspace }}</span>
          <span
            v-if="workspace === current"
            class="lucide-check size-4 text-ink-gray-7"
            aria-hidden="true"
          />
        </button>
      </div>
    </template>
  </Popover>
</template>
