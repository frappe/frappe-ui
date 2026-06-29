<script setup>
import { Badge } from 'frappe-ui'
</script>

<template>
  <div class="w-96 rounded-r-md border-l-2 border-outline-gray-3 px-3 py-2 transition-colors hover:bg-surface-gray-1">
    <Badge theme="red" size="md">
      <template #prefix>
        <span class="lucide-mail" aria-hidden="true" />
      </template>
      Awaiting response
    </Badge>
    <p class="mt-2 text-base-medium leading-relaxed text-ink-gray-8">Supply Chain Sync</p>
    <p class="text-sm leading-relaxed text-ink-gray-6">2:30 PM - 3:00 PM</p>
  </div>
</template>
