<script setup lang="ts">
import { ref } from 'vue'
import { Rating } from 'frappe-ui'
import LucideHeart from '~icons/lucide/heart'
import LucideFlame from '~icons/lucide/flame'
import type { RatingStarState } from 'frappe-ui'

const heart = ref(4)
const flame = ref(3)

const redClasses: Record<RatingStarState, string> = {
  filled: 'text-red-500',
  preview: 'text-red-300 dark:text-red-700',
  removing: 'text-red-200 dark:text-red-800',
  empty: 'text-gray-300 dark:text-gray-600',
}

const orangeClasses: Record<RatingStarState, string> = {
  filled: 'text-orange-500',
  preview: 'text-orange-300 dark:text-orange-700',
  removing: 'text-orange-200 dark:text-orange-800',
  empty: 'text-gray-300 dark:text-gray-600',
}
</script>

<template>
  <div class="w-full flex flex-col gap-4 items-start">
    <Rating v-model="heart" label="Hearts">
      <template #icon="{ state }">
        <LucideHeart
          fill="currentColor"
          class="size-5"
          :class="redClasses[state]"
        />
      </template>
    </Rating>
    <Rating v-model="flame" label="Flames">
      <template #icon="{ state }">
        <LucideFlame
          fill="currentColor"
          class="size-5"
          :class="orangeClasses[state]"
        />
      </template>
    </Rating>
  </div>
</template>
