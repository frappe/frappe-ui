<template>
  <ContextMenuRoot v-model:open="openModel">
    <ContextMenuTrigger ref="triggerRef" as-child data-slot="trigger">
      <slot v-if="$slots.trigger" name="trigger" v-bind="triggerSlotProps" />
      <slot v-else v-bind="triggerSlotProps" />
    </ContextMenuTrigger>

    <ContextMenuPortal :to="portalTarget">
      <ContextMenuContent
        ref="contentRef"
        data-slot="content"
        data-motion="instant"
        :class="menuClasses.content"
      >
        <Menu
          :groups="groups"
          :close="close"
          :slot-fns="slots"
          :primitives="primitives"
          :portal-to="portalTo"
        />
      </ContextMenuContent>
    </ContextMenuPortal>
  </ContextMenuRoot>
</template>

<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from 'vue'
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
import type {
  ContextMenuProps,
  ContextMenuSlots,
  ContextMenuTriggerSlotProps,
} from './types'
import { usePortalTarget } from '../../composables/usePortalTarget'
import { useReactiveSlots } from '../../composables/useReactiveSlots'

defineOptions({ inheritAttrs: false })

const openModel = defineModel<boolean>('open', { default: false })

const props = withDefaults(defineProps<ContextMenuProps>(), {
  options: () => [],
})

defineSlots<ContextMenuSlots>()

const slots = useReactiveSlots<ContextMenuSlots>()

const portalTarget = usePortalTarget(() => props.portalTo)

const groups = computed(() => normalizeMenuOptions(props.options))
const triggerRef = ref<{ $el?: HTMLElement } | null>(null)
const contentRef = ref<{ $el?: HTMLElement } | null>(null)

const primitives = {
  Item: ContextMenuItem,
  Label: ContextMenuLabel,
  Portal: ContextMenuPortal,
  Sub: ContextMenuSub,
  SubContent: ContextMenuSubContent,
  SubTrigger: ContextMenuSubTrigger,
}

function close() {
  const content = contentRef.value?.$el
  if (openModel.value && content) {
    content.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'Escape',
        code: 'Escape',
        bubbles: true,
        cancelable: true,
      }),
    )
    return
  }
  openModel.value = false
}

function setOpen(value: boolean) {
  if (value && !openModel.value) {
    const trigger = triggerRef.value?.$el
    if (trigger) {
      const bounds = trigger.getBoundingClientRect()
      trigger.dispatchEvent(
        new MouseEvent('contextmenu', {
          bubbles: true,
          cancelable: true,
          clientX: bounds.left,
          clientY: bounds.bottom,
        }),
      )
      return
    }
  }
  openModel.value = value
}

const triggerSlotProps = computed<ContextMenuTriggerSlotProps>(() => ({
  open: openModel.value,
  setOpen,
  close,
}))

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
