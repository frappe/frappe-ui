<script setup lang="ts">
export type Part = { text: string; strong?: boolean }

defineProps<{
  /** The sentence, split so the values in it can be set in medium. */
  parts: Part[]
  /** Right-hand date. */
  time: string
}>()
</script>

<template>
  <!-- One change, on one 28px line: the sentence left, the date right. -->
  <div class="flex h-7 items-center gap-4">
    <p class="min-w-0 flex-1 truncate text-base text-ink-gray-5">
      <template v-for="(part, index) in parts" :key="index">
        <span v-if="part.strong" class="text-base-medium text-ink-gray-7">{{
          part.text
        }}</span>
        <span v-else>{{ part.text }}</span>
      </template>
    </p>
    <span class="shrink-0 text-sm text-ink-gray-5">{{ time }}</span>
  </div>
</template>
