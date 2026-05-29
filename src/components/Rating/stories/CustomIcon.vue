<script setup lang="ts">
import { ref } from 'vue'
import { Rating } from 'frappe-ui'
import LucideHeart from '~icons/lucide/heart'
import LucideFlame from '~icons/lucide/flame'

const heart = ref(3.5)
const flame = ref(3)
const zap = ref(3)
</script>

<template>
  <div class="flex flex-col gap-4 items-center">
    <Rating v-model="heart" :step="0.5" label="Hearts (red, half-step)">
      <template #icon="{ state }">
        <LucideHeart
          fill="currentColor"
          class="size-5"
          :class="{
            'text-red-500': state === 'filled',
            'text-red-200': state === 'preview',
            'text-red-300': state === 'removing',
            'text-gray-300 dark:text-gray-600': state === 'empty',
          }"
        />
      </template>
    </Rating>
    <Rating v-model="flame" :icon="LucideFlame" label="Flames (component)" />
    <Rating v-model="zap" icon="lucide-zap" label="Zap (lucide-* string)" />
  </div>
</template>
