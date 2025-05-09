<template>
  <ToastProvider swipe-direction="down">
    <slot />
    <Toasts />
    <ToastViewport
      class="fixed bottom-0 items-end right-0 flex flex-col p-5 gap-[10px] w-auto max-w-full z-[2147483647] outline-none pointer-events-none"
    />
  </ToastProvider>
</template>

<script setup lang="ts">
import { ToastProvider, ToastViewport } from 'reka-ui'
import { Toasts } from '../Toast/index'
</script>
