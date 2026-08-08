<template>
  <Spinner :style="scaleStyle" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Spinner } from '../Spinner'
import type { LoadingIndicatorProps } from './types'

// Thin wrapper around Spinner that scales by percentage instead of a fixed
// size step — useful when callers need an arbitrary in-between size.
const props = withDefaults(defineProps<LoadingIndicatorProps>(), {
  scale: 100,
})

const scaleStyle = computed(() =>
  props.scale === 100 ? undefined : { scale: `${props.scale}%` },
)
</script>
