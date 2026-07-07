<template>
  <Dialog v-model="modelValue" :size="size" bare>
    <!--
      TabsRoot wires the sidebar (TabsList) to the panels (TabsContent): roving
      arrow-key focus, aria-selected/aria-controls, and one visible panel at a
      time — all from reka-ui. `manual` activation moves focus on arrow keys
      without selecting until Enter/Space, so a route-driven consumer doesn't
      navigate on every keypress.
    -->
    <TabsRoot
      v-model="activeTab"
      orientation="vertical"
      activation-mode="manual"
      :unmount-on-hide="unmountOnHide"
      class="relative flex h-[100dvh] min-h-0 w-screen flex-col overflow-hidden sm:h-[min(860px,calc(100vh-8rem))] sm:min-h-[560px] sm:w-auto sm:flex-row"
    >
      <!-- Bare mode suppresses the base Dialog's close button, so provide one
           here. Setting the v-model closes the dialog and lets route-driven
           consumers react (e.g. navigate back) via their own watcher. -->
      <Button
        class="absolute right-3 top-3 z-10"
        variant="ghost"
        label="Close"
        @click="modelValue = false"
      >
        <template #icon>
          <span class="lucide-x size-4 text-ink-gray-9" />
        </template>
      </Button>
      <Dialog.Title as-child>
        <h1 class="sr-only"><slot name="title">Settings</slot></h1>
      </Dialog.Title>
      <Dialog.Description as-child>
        <p class="sr-only">
          <slot name="description"
            >Manage your settings across the tabs in this dialog.</slot
          >
        </p>
      </Dialog.Description>
      <slot />
    </TabsRoot>
  </Dialog>
</template>

<script setup lang="ts">
import { useEventListener } from '@vueuse/core'
import { TabsRoot } from 'reka-ui'
import { Dialog } from '../Dialog'
import { Button } from '../Button'
import type { SettingsDialogProps } from './types'

const props = withDefaults(defineProps<SettingsDialogProps>(), {
  size: '4xl',
  shortcut: true,
  unmountOnHide: true,
})

/** Controls whether the dialog is open. */
const modelValue = defineModel<boolean>({ default: false })

/**
 * The selected tab — pairs with SettingsNavItem `:value` and SettingsPanel
 * `:value`. Optional: leave unbound to let reka-ui manage selection internally,
 * or bind `v-model:tab` to drive it (e.g. from the route).
 */
const activeTab = defineModel<string | number | undefined>('tab')

defineSlots<{
  /** Accessible dialog title (visually hidden). Defaults to "Settings". */
  title?: () => any
  /** Accessible dialog description (visually hidden, for aria-describedby). */
  description?: () => any
  /** Sidebar + content panes (compose SettingsSidebar and SettingsContent). */
  default?: () => any
}>()

// Cmd/Ctrl+Shift+, toggles the dialog. Use e.code (physical key) since Shift
// rewrites e.key for "," to "<" on most layouts.
useEventListener(
  () => (typeof window === 'undefined' ? null : window),
  'keydown',
  (e: KeyboardEvent) => {
    if (!props.shortcut) return
    if (e.code === 'Comma' && e.shiftKey && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      modelValue.value = !modelValue.value
    }
  },
)
</script>
