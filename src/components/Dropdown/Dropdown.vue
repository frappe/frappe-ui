<template>
  <DropdownMenuRoot v-model:open="openModel" v-slot="{ open }">
    <DropdownMenuTrigger as-child @pointerdown="openOnPointerDown">
      <slot
        v-if="$slots.trigger"
        name="trigger"
        v-bind="{ ...attrs, open, close, disabled: triggerDisabled }"
      />
      <slot
        v-else-if="$slots.default"
        v-bind="{ ...attrs, open, close, disabled: triggerDisabled }"
      />
      <Button v-else :active="false" v-bind="{ ...button, ...attrs }">
        {{ button?.label || 'Options' }}
      </Button>
    </DropdownMenuTrigger>

    <DropdownMenuPortal :to="portalTo">
      <DropdownMenuContent
        data-slot="content"
        data-motion="instant"
        :class="menuClasses.content"
        :side="side"
        :align="align"
        :side-offset="offset"
        :style="{
          width: matchTriggerWidth ? 'var(--reka-dropdown-menu-trigger-width)' : undefined,
        }"
      >
        <Menu
          :groups="groups"
          :portal-to="portalTo"
          :close="close"
          :slot-fns="slots"
          :primitives="primitives"
        />
      </DropdownMenuContent>
    </DropdownMenuPortal>
  </DropdownMenuRoot>
</template>

<script setup lang="ts">
import { computed, onScopeDispose, useAttrs, useSlots } from 'vue'
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRoot,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from 'reka-ui'
import { Button } from '../Button'
import Menu from '../Menu/Menu.vue'
import type { DropdownProps, DropdownSlots } from './types'
import { menuClasses, normalizeMenuOptions } from '../Menu/utils'

defineOptions({
  inheritAttrs: false,
})

const openModel = defineModel<boolean>('open', { default: false })
const attrs = useAttrs()
const slots = useSlots()

const props = withDefaults(defineProps<DropdownProps>(), {
  options: () => [],
  side: 'bottom',
  offset: 4,
  portalTo: 'body',
})

function close() {
  openModel.value = false
}

const primitives = {
  Item: DropdownMenuItem,
  Label: DropdownMenuLabel,
  Portal: DropdownMenuPortal,
  Sub: DropdownMenuSub,
  SubContent: DropdownMenuSubContent,
  SubTrigger: DropdownMenuSubTrigger,
}

const groups = computed(() => {
  return normalizeMenuOptions(props.options)
})

const align = computed(() => {
  if (props.align !== undefined) return props.align
  if (props.placement === 'right') return 'end' as const
  if (props.placement === 'center') return 'center' as const
  return 'start' as const
})

const triggerDisabled = computed(() => {
  return (
    props.button?.disabled === true ||
    (attrs.disabled !== undefined && attrs.disabled !== false)
  )
})

/**
 * Workaround for reka-ui 2.9.9: `DropdownMenuTrigger` binds only `click`, so
 * the menu opens on pointer *release* — the whole length of a press (~80-120ms)
 * of dead time that `SelectTrigger` avoids by opening on `pointerdown`. Radix,
 * which reka ports, also opens on pointerdown.
 *
 * So we open on pointerdown ourselves and swallow the click that ends the same
 * press, which would otherwise reach reka's trigger and toggle the menu shut.
 * The swallow is scoped to clicks landing on the trigger: press-drag-release
 * onto a menu item still activates the item, macOS-style.
 *
 * Remove once reka opens on pointerdown; the trailing click is theirs to
 * suppress at that point.
 */
let pendingTrigger: HTMLElement | null = null

function openOnPointerDown(event: PointerEvent) {
  // Touch keeps reka's click path — opening on press there fights scrolling.
  if (event.pointerType === 'touch') return
  if (event.button !== 0 || event.ctrlKey) return
  // An open menu closes on the trigger's click, which reka already handles.
  if (triggerDisabled.value || openModel.value) return

  openModel.value = true
  pendingTrigger = event.currentTarget as HTMLElement
  window.addEventListener('click', swallowOpeningClick, {
    capture: true,
    once: true,
  })
}

function swallowOpeningClick(event: MouseEvent) {
  const trigger = pendingTrigger
  pendingTrigger = null
  if (!trigger || !(event.target instanceof Node)) return
  // Capture phase on window, so this stops the click before it ever reaches
  // reka's handler on the trigger.
  if (trigger.contains(event.target)) event.stopPropagation()
}

onScopeDispose(() => {
  window.removeEventListener('click', swallowOpeningClick, { capture: true })
})

defineSlots<DropdownSlots>()
</script>

<style scoped>
/*
 * Dropdown opens the same way Select does: no scale entrance, just a ~80ms
 * opacity fade. It reads as instant, and still masks the 1-frame
 * position-settle reka performs after mount. Same rhythm for pointer and
 * keyboard opens — a menu that appears at a fixed spot has nothing to scale
 * from, so the entrance only added latency.
 *
 * The `animated` keyframes (used by ContextMenu) + the
 * `prefers-reduced-motion` reset live in Menu.vue, rendered by both menus.
 */
:global(.menu-content[data-motion='instant'][data-state='open']) {
  animation: dropdown-instant-fade 80ms linear;
}

:global(.menu-content[data-motion='instant'][data-state='closed']) {
  animation: none;
}

@keyframes dropdown-instant-fade {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
