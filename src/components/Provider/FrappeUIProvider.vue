<template>
  <slot />
  <Dialogs />
  <Toaster
    position="bottom-right"
    :duration="5000"
    :close-button="true"
    :expand="false"
    :rich-colors="false"
    :visible-toasts="3"
    :toast-options="{
      classes: {
        actionButton: 'text-ink-blue-link hover:text-ink-gray-3',
      },
    }"
  />
</template>

<script setup lang="ts">
import { Toaster } from 'vue-sonner'
import Dialogs from '../Dialogs.vue'
</script>

<style>
@import 'vue-sonner/style.css';

[data-sonner-toaster][data-sonner-theme='light'],
[data-sonner-toaster][data-sonner-theme='dark'],
[data-sonner-toaster][data-sonner-theme='system'] {
  --normal-bg: var(--surface-gray-6);
  --normal-text: var(--ink-white);
  --normal-border: transparent;
  --success-bg: var(--normal-bg);
  --success-text: var(--normal-text);
  --success-border: transparent;
  --error-bg: var(--normal-bg);
  --error-text: var(--normal-text);
  --error-border: transparent;
  --warning-bg: var(--normal-bg);
  --warning-text: var(--normal-text);
  --warning-border: transparent;
  --info-bg: var(--normal-bg);
  --info-text: var(--normal-text);
  --info-border: transparent;
  --border-radius: 0.625rem;
}
</style>
