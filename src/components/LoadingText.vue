<template>
  <div class="flex items-center text-base text-ink-gray-4">
    <LoadingIndicator class="-ml-1 mr-2 h-3 w-3" /> {{ __(text) }}
  </div>
</template>
<script setup>
import { __ } from '../utils/translation'
import LoadingIndicator from './LoadingIndicator.vue'

const props = defineProps({
  text: {
    type: String,
    default: 'Loading...',
  },
})
</script>
