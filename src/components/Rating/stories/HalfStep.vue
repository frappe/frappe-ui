<script setup lang="ts">
import { ref } from 'vue'
import { Rating } from 'frappe-ui'

const score = ref(3.5)
</script>

<template>
  <div class="flex items-end gap-3">
    <Rating v-model="score" :step="0.5" size="lg" label="Your score" />
    <span class="text-base leading-none text-ink-gray-7 tabular-nums">
      {{ score.toFixed(1) }} / 5
    </span>
  </div>
</template>
