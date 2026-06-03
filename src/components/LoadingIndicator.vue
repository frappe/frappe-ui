<template>
  <Spinner :size="null" :theme="null" :style="scaleStyle" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Spinner from './Spinner/Spinner.vue'

// Thin wrapper kept for backward compatibility: it forwards sizing/color
// classes through to the new Spinner. Size and color come from the
// width/height and text-color classes the caller passes.
const props = withDefaults(defineProps<{ scale?: number }>(), { scale: 100 })

const scaleStyle = computed(() =>
  props.scale === 100 ? undefined : { scale: `${props.scale}%` },
)
</script>
