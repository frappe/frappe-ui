<template>
  <Toaster
    position="bottom-right"
    :close-button="true"
    :expand="false"
    :rich-colors="false"
    :visible-toasts="3"
    :toast-options="{
      unstyled: true,
      classes: {
        toast:
          'group py-2.5 flex items-center px-4 bg-surface-gray-6 rounded-md shadow-xl w-[360px] after:bg-transparent',
        title: 'text-p-base font-medium text-ink-white',
        description: 'text-p-base text-ink-white',
        icon: 'mr-2 text-ink-white',
        closeButton:
          'order-1 ml-auto group-has-[[data-action]]:ml-0 grid place-items-center rounded-sm text-ink-white hover:bg-surface-gray-5 size-5 !transition-colors [&_svg]:size-4',
        actionButton:
          'flex text-ink-blue-link font-medium py-1.5 px-2 h-7 text-base mr-2 ml-auto bg-transparent hover:bg-surface-gray-5 rounded !transition-colors',
        cancelButton:
          'flex text-ink-blue-link font-medium py-1.5 px-2 text-base hover:bg-bg-surface-gray-4 transition-colors',
        error: '[&_[data-icon]]:text-ink-red-2',
        warning: '[&_[data-icon]]:text-ink-amber-2',
      },
    }"
  />
</template>

<script setup lang="ts">
import { Toaster } from 'vue-sonner'
</script>

<style>
@import 'vue-sonner/style.css';

.sonner-loading-wrapper {
  position: static;
}

.sonner-loading-bar {
  background-color: var(--surface-gray-1);
}
</style>
