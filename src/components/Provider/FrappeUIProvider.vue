<template>
  <slot />
  <Dialogs />
  <ToastProvider />
</template>

<script setup lang="ts">
import Dialogs from '../Dialogs.vue'
import ToastProvider from '../Toast/ToastProvider.vue'
</script>
