<template>
  <slot />
  <Dialogs />
  <ToastProvider />
</template>

<script setup lang="ts">
import Dialogs from '../Dialogs.vue'
import ToastProvider from '../Toast/ToastProvider.vue'

defineSlots<{
  /** The app. Rendered as-is; the provider adds no wrapper element of its own. */
  default?: () => any
}>()
</script>
