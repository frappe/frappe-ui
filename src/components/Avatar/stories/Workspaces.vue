<script setup lang="ts">
import { Avatar } from 'frappe-ui'
import type { AvatarTheme } from 'frappe-ui'

// Square avatars stand for places, round ones for people.
const workspaces: { name: string; members: number; theme: AvatarTheme }[] = [
  { name: 'Acme Design', members: 12, theme: 'blue' },
  { name: 'Growth', members: 5, theme: 'green' },
  { name: 'Support', members: 8, theme: 'amber' },
]
</script>

<template>
  <div
    class="flex w-60 flex-col gap-1 rounded-lg bg-surface-elevation-2 p-1.5 shadow-xl ring-1 ring-black/5"
  >
    <button
      v-for="(w, i) in workspaces"
      :key="w.name"
      type="button"
      class="flex items-center gap-2 rounded px-2 py-1.5 text-left hover:bg-surface-gray-2"
    >
      <Avatar :label="w.name" :theme="w.theme" shape="square" size="xl" />
      <span class="flex flex-1 flex-col">
        <span class="text-base font-medium text-ink-gray-8">{{ w.name }}</span>
        <span class="text-sm text-ink-gray-5">{{ w.members }} members</span>
      </span>
      <span
        v-if="i === 0"
        class="lucide-check size-4 text-ink-gray-7"
        aria-hidden="true"
      />
    </button>
    <div class="my-1 border-t border-outline-gray-1" />
    <button
      type="button"
      class="flex items-center gap-2 rounded px-2 py-1.5 text-left hover:bg-surface-gray-2"
    >
      <!-- The default slot replaces the initial, here with an icon. -->
      <Avatar shape="square" size="xl">
        <span class="lucide-plus size-full" aria-hidden="true" />
      </Avatar>
      <span class="text-base text-ink-gray-8">New workspace</span>
    </button>
  </div>
</template>
