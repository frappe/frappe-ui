<template>
  <Dialog v-model="modelValue" :size="size" bare>
    <div
      class="flex h-[100dvh] min-h-0 w-screen flex-col overflow-hidden sm:h-[min(860px,calc(100vh-8rem))] sm:min-h-[560px] sm:w-auto sm:flex-row"
    >
      <Dialog.Title as-child>
        <h1 class="sr-only"><slot name="title">Settings</slot></h1>
      </Dialog.Title>
      <slot />
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { useEventListener } from '@vueuse/core'
import { Dialog } from '../Dialog'
import type { DialogSize } from '../Dialog/types'
import type { SettingsDialogProps } from './types'

const props = withDefaults(defineProps<SettingsDialogProps>(), {
  size: '4xl',
  shortcut: true,
})

/** Controls whether the dialog is open. */
const modelValue = defineModel<boolean>({ default: false })

defineSlots<{
  /** Accessible dialog title (visually hidden). Defaults to "Settings". */
  title?: () => any
  /** Sidebar + content panes (compose SettingsSidebar and SettingsContent). */
  default?: () => any
}>()

// Cmd/Ctrl+Shift+. toggles the dialog. Use e.code (physical key) since Shift
// rewrites e.key for "." to ">" on most layouts.
useEventListener(window, 'keydown', (e: KeyboardEvent) => {
  if (!props.shortcut) return
  if (e.code === 'Comma' && e.shiftKey && (e.metaKey || e.ctrlKey)) {
    e.preventDefault()
    modelValue.value = !modelValue.value
  }
})
</script>
