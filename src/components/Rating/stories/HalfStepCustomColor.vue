<script setup lang="ts">
import { ref } from 'vue'
import { Rating } from 'frappe-ui'
import LucideHeart from '~icons/lucide/heart'
import type { RatingStarState } from 'frappe-ui'

const heart = ref(3.5)

const redClasses: Record<RatingStarState, string> = {
  filled: 'text-red-500',
  preview: 'text-red-300 dark:text-red-700',
  removing: 'text-red-200 dark:text-red-800',
  empty: 'text-gray-300 dark:text-gray-600',
}
</script>

<template>
  <Rating v-model="heart" :step="0.5" label="Half-star hearts">
    <template #icon="{ state }">
      <LucideHeart
        fill="currentColor"
        class="size-5"
        :class="redClasses[state]"
      />
    </template>
  </Rating>
</template>
