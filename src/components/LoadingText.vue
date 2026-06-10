<template>
  <div class="flex items-center text-base text-ink-gray-4">
    <LoadingIndicator class="-ml-1 mr-2 h-3 w-3" /> {{ text }}
  </div>
</template>

<script setup lang="ts">
import LoadingIndicator from './LoadingIndicator.vue'

withDefaults(defineProps<{ text?: string }>(), { text: 'Loading...' })
</script>
