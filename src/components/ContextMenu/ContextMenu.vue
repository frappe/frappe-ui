<template>
  <ContextMenuRoot v-model:open="openModel">
    <ContextMenuTrigger as-child>
      <slot v-if="$slots.trigger" name="trigger" :open="openModel" />
      <slot v-else :open="openModel" />
    </ContextMenuTrigger>

    <ContextMenuPortal>
      <ContextMenuContent
        data-slot="content"
        data-motion="animated"
        :class="menuClasses.content"
      >
        <Menu
          :groups="groups"
          :close="close"
          :slot-fns="slots"
          :primitives="primitives"
        />
      </ContextMenuContent>
    </ContextMenuPortal>
  </ContextMenuRoot>
</template>

<script setup lang="ts">
import { computed, onUnmounted, useSlots, watch } from 'vue'
import {
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuPortal,
  ContextMenuRoot,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from 'reka-ui'
import Menu from '../Menu/Menu.vue'
import { menuClasses, normalizeMenuOptions } from '../Menu/utils'
import type { ContextMenuProps, ContextMenuSlots } from './types'

const openModel = defineModel<boolean>('open', { default: false })

const props = withDefaults(defineProps<ContextMenuProps>(), {
  options: () => [],
})

defineSlots<ContextMenuSlots>()

const slots = useSlots()

const groups = computed(() => normalizeMenuOptions(props.options))

const primitives = {
  Item: ContextMenuItem,
  Label: ContextMenuLabel,
  Portal: ContextMenuPortal,
  Sub: ContextMenuSub,
  SubContent: ContextMenuSubContent,
  SubTrigger: ContextMenuSubTrigger,
}

function close() {
  openModel.value = false
}

// Standard context menu behaviour: lock scroll while open so an accidental
// trackpad flick doesn't destroy the interaction. `scroll` events aren't
// cancelable, so we intercept `wheel` + `touchmove` instead.
function preventScroll(e: Event) {
  if (e.target instanceof Element && e.target.closest('[role="menu"]')) return
  e.preventDefault()
}

let removeScrollLock: (() => void) | null = null

watch(
  openModel,
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
