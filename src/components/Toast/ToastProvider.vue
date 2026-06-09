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
        icon: 'mr-2 text-ink-white [&_svg]:size-4',
        closeButton:
          'order-1 ml-auto group-has-[[data-action]]:ml-0 grid place-items-center rounded-sm text-ink-white hover:bg-surface-gray-5 size-5 !transition-colors [&_svg]:size-4',
        actionButton:
          'flex shrink-0 text-ink-blue-link font-medium py-1.5 px-2 h-7 text-base mr-2 ml-auto bg-transparent hover:bg-surface-gray-5 rounded !transition-colors',
        cancelButton:
          'flex text-ink-blue-link font-medium py-1.5 px-2 text-base hover:bg-surface-gray-5 transition-colors',
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

/* --initial-height is measured on mount (loading state). After the promise
   resolves the toast grows (action button), so clamp to auto instead of the
   stale measured value. */
[data-sonner-toast][data-mounted='true'][data-expanded='true'] {
  height: auto;
}

/* In the collapsed stack vue-sonner clamps every non-front toast to the front
   toast's height (--front-toast-height) and hides their content. The content is
   hidden only on [data-styled='true'] toasts, which `unstyled` strips — so a
   multiline toast behind a single-line one spills its extra lines out the top.
   Replicate sonner's intended behavior and fade the collapsed back toasts out. */
[data-sonner-toast][data-expanded='false'][data-front='false'] > * {
  opacity: 0;
}

.sonner-loading-wrapper {
  position: static;
}

.sonner-loading-bar {
  background-color: var(--surface-gray-1);
}
</style>
