<script setup lang="ts">
defineProps<{
  enabled: boolean
  wrapperClass?: any
  wrapperStyle?: any
}>()

defineOptions({ inheritAttrs: false })
</script>

<template>
  <div v-if="enabled" :class="wrapperClass" :style="wrapperStyle">
    <slot />
  </div>
  <slot v-else />
</template>
