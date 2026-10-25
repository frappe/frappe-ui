<template>
  <div class="flex items-center text-base text-ink-gray-4">
    <Spinner class="-ml-1 mr-2 h-3 w-3" /> {{ text }}
  </div>
</template>

<script setup lang="ts">
import { Spinner } from '../Spinner'
import type { LoadingTextProps } from './types'

withDefaults(defineProps<LoadingTextProps>(), { text: 'Loading...' })
</script>
