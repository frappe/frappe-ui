<script setup lang="ts">
import { Avatar } from 'frappe-ui'
import type { AvatarTheme } from 'frappe-ui'

// Square avatars stand for places, round ones for people.
const workspaces: { name: string; members: number; theme: AvatarTheme }[] = [
  { name: 'Acme Design', members: 12, theme: 'blue' },
  { name: 'Growth', members: 5, theme: 'green' },
  { name: 'Support', members: 8, theme: 'amber' },
]

// The panel and rows use Dropdown's own classes (Menu's panel and its `sm`
// row), so the switcher looks like the menus around it.
const panel =
  'w-64 divide-y divide-outline-elevation-2 rounded-6 bg-surface-elevation-2 shadow-2xl ring-1 ring-black ring-opacity-5'
const group = 'flex flex-col p-1.5'
const row =
  'flex w-full items-center gap-2 rounded-4 px-2 py-1.5 text-left outline-none transition-colors hover:bg-surface-gray-3 focus-visible:bg-surface-gray-3'
</script>

<template>
  <div :class="panel">
    <div :class="group">
      <button
        v-for="(w, i) in workspaces"
        :key="w.name"
        type="button"
        :class="row"
      >
        <Avatar
          decorative
          :label="w.name"
          :theme="w.theme"
          shape="square"
          size="lg"
        />
        <span class="flex min-w-0 flex-1 flex-col">
          <span class="truncate text-base text-ink-gray-8">{{ w.name }}</span>
          <span class="text-sm text-ink-gray-5">{{ w.members }} members</span>
        </span>
        <span
          v-if="i === 0"
          class="lucide-check size-4 shrink-0 text-ink-gray-7"
          aria-label="Current workspace"
        />
      </button>
    </div>
    <div :class="group">
      <button type="button" :class="row">
        <!-- The default slot replaces the initial, here with an icon. -->
        <Avatar decorative shape="square" size="lg">
          <span class="lucide-plus size-4" aria-hidden="true" />
        </Avatar>
        <span class="text-base text-ink-gray-8">New workspace</span>
      </button>
    </div>
  </div>
</template>
