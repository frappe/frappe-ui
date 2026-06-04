<script setup lang="ts">
import { onUnmounted, watch } from 'vue'
import {
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  injectContextMenuRootContext,
} from 'reka-ui'
import MenuList from '../Menu/MenuList.vue'
import type { NormalizedMenuGroup } from '../Menu/utils'

defineOptions({
  name: 'ContextMenuList',
})

const props = withDefaults(
  defineProps<{
    groups?: NormalizedMenuGroup[]
    slotFns?: Record<string, ((props?: any) => any) | undefined>
  }>(),
  {
    groups: () => [],
  },
)

const primitives = {
  Item: ContextMenuItem,
  Label: ContextMenuLabel,
  Portal: ContextMenuPortal,
  Sub: ContextMenuSub,
  SubContent: ContextMenuSubContent,
  SubTrigger: ContextMenuSubTrigger,
}

const rootContext = injectContextMenuRootContext()

function close() {
  rootContext.onOpenChange(false)
}

// Standard context menu behaviour: lock scroll while open so an accidental
// trackpad flick doesn't destroy the interaction. `scroll` events aren't
// cancelable, so we intercept `wheel` + `touchmove` instead.
function preventScroll(e: Event) {
  e.preventDefault()
}

let removeScrollLock: (() => void) | null = null

watch(
  rootContext.open,
  (isOpen) => {
    removeScrollLock?.()
    removeScrollLock = null

    if (isOpen) {
      // Lock scroll
      window.addEventListener('wheel', preventScroll, {
        passive: false,
        capture: true,
      })
      window.addEventListener('touchmove', preventScroll, {
        passive: false,
        capture: true,
      })
      // Re-enable scroll when the menu closes
      removeScrollLock = () => {
        window.removeEventListener('wheel', preventScroll, { capture: true })
        window.removeEventListener('touchmove', preventScroll, {
          capture: true,
        })
      }
    }
  },
  { immediate: true },
)

onUnmounted(() => removeScrollLock?.())
</script>

<template>
  <MenuList
    :groups="groups"
    :close="close"
    :slot-fns="slotFns"
    :primitives="primitives"
  />
</template>
