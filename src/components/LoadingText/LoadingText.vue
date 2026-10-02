<template>
  <!-- The visible text says what's loading, so the wrapper announces it and
       the spinner is decorative, instead of both being read out. -->
  <div role="status" class="flex items-center text-base text-ink-gray-4">
    <Spinner label="" class="-ml-1 mr-2 h-3 w-3" /> {{ text }}
  </div>
</template>

<script setup lang="ts">
import { Spinner } from '../Spinner'
import type { LoadingTextProps } from './types'

withDefaults(defineProps<LoadingTextProps>(), { text: 'Loading...' })
</script>
