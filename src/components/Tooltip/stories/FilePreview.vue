<script setup lang="ts">
import { Tooltip } from 'frappe-ui'

const file = {
  name: 'profile-photo-jane-cooper-2026.jpg',
  url: 'https://i.pravatar.cc/80?u=jane@example.com',
}
</script>

<template>
  <div
    class="flex w-48 items-center gap-2 rounded-4 border border-outline-gray-1 px-2 py-1.5"
  >
    <span
      class="lucide-image size-4 shrink-0 text-ink-gray-5"
      aria-hidden="true"
    />
    <Tooltip bare>
      <template #content>
        <img
          :src="file.url"
          :alt="file.name"
          class="size-20 rounded-4 bg-surface-base p-1 shadow-xl"
        />
      </template>
      <span class="truncate text-base text-ink-gray-8" tabindex="0">
        {{ file.name }}
      </span>
    </Tooltip>
  </div>
</template>
