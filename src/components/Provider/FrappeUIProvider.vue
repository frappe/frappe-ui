<template>
  <ToastProvider>
    <slot />
  </ToastProvider>
</template>

<script setup lang="ts">
import ToastProvider from '../Toast/ToastProvider.vue'
</script>
