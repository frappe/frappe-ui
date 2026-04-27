<script setup lang="ts">
import type { HTMLAttributes, StyleValue } from 'vue'

defineProps<{
  enabled: boolean
  wrapperClass?: HTMLAttributes['class']
  wrapperStyle?: StyleValue
}>()

defineOptions({ inheritAttrs: false })
</script>

<template>
  <div v-if="enabled" :class="wrapperClass" :style="wrapperStyle">
    <slot />
  </div>
  <slot v-else />
</template>
