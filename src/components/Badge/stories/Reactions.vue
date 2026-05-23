<script setup>
import { Badge } from 'frappe-ui'

const reactions = [
  { emoji: '😄', count: 12 },
  { emoji: '🍩', count: 8 },
  { emoji: '🔥', count: 7 },
]
</script>

<template>
  <div class="w-[28rem]">
    <p class="text-base text-ink-gray-8">
      The words breathing and ventilation are hyponyms, not synonyms, of
      respiration.
    </p>
    <div class="mt-2 flex items-center gap-1.5">
      <Badge v-for="r in reactions" :key="r.emoji" size="md">
        <template #prefix>
          <span class="text-sm leading-none">{{ r.emoji }}</span>
        </template>
        {{ r.count }}
      </Badge>
      <button
        type="button"
        class="inline-flex h-5 items-center justify-center rounded-full px-1.5 text-ink-gray-5 hover:bg-surface-gray-2"
        aria-label="Add reaction"
      >
        <span class="lucide-smile-plus size-3.5" aria-hidden="true" />
      </button>
    </div>
  </div>
</template>
