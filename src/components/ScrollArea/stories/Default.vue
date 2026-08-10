<script setup lang="ts">
import { ScrollArea } from 'frappe-ui'

const items = Array.from({ length: 30 }, (_, i) => `Item ${i + 1}`)
</script>

<template>
  <ScrollArea class="h-64 w-64 rounded-5 border bg-surface-base">
    <div class="space-y-1 p-3">
      <div
        v-for="item in items"
        :key="item"
        class="rounded-4 px-2 py-1.5 text-base text-ink-gray-8 hover:bg-surface-gray-2"
      >
        {{ item }}
      </div>
    </div>
  </ScrollArea>
</template>
