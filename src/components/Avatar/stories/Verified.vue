<script setup lang="ts">
import { Avatar } from 'frappe-ui'
</script>

<template>
  <div class="flex items-center gap-3 rounded-lg bg-surface-gray-2 p-3">
    <Avatar
      image="https://i.pravatar.cc/80?u=jane@example.com"
      label="Jane Cooper"
      size="3xl"
    >
      <template #indicator>
        <span
          class="flex size-full items-center justify-center rounded-full bg-surface-blue-6 text-white"
        >
          <span class="lucide-check size-2" aria-hidden="true" />
          <span class="sr-only">Verified</span>
        </span>
      </template>
    </Avatar>
    <div class="flex flex-col gap-0.5">
      <span class="text-base font-medium text-ink-gray-9">Jane Cooper</span>
      <span class="text-sm text-ink-gray-5">Verified account</span>
    </div>
  </div>
</template>
