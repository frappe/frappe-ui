<template>
  <DropdownMenuRoot v-model:open="openModel" v-slot="{ open }">
    <DropdownMenuTrigger
      as-child
      :disabled="triggerDisabled"
      @pointerdown="openOnPointerDown"
    >
      <slot
        v-if="$slots.trigger"
        name="trigger"
        v-bind="{ ...attrs, open, close, disabled: triggerDisabled }"
      />
      <slot
        v-else-if="$slots.default"
        v-bind="{ ...attrs, open, close, disabled: triggerDisabled }"
      />
      <!--
        No active/open prop: reka stamps `data-state="open"` on the trigger and
        Button holds the pressed look off that.
      -->
      <Button v-else v-bind="{ ...button, ...attrs }">
        {{ button?.label || 'Options' }}
      </Button>
    </DropdownMenuTrigger>

    <DropdownMenuPortal :to="portalTarget">
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
import { menuClasses, normalizeMenuOptions, warnRemoved } from '../Menu/utils'
import { usePortalTarget } from '../../composables/usePortalTarget'

defineOptions({
  inheritAttrs: false,
})

const openModel = defineModel<boolean>('open', { default: false })
const attrs = useAttrs()
const slots = useSlots()

const props = withDefaults(defineProps<DropdownProps>(), {
  options: () => [],
  side: 'bottom',
  align: 'start',
  offset: 4,
})

const portalTarget = usePortalTarget(() => props.portalTo)

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


const triggerDisabled = computed(() => {
  return (
    props.button?.disabled === true ||
    (attrs.disabled !== undefined && attrs.disabled !== false)
  )
})

if (import.meta.env.DEV && 'placement' in attrs) {
  warnRemoved(
    '[Dropdown] `placement` is removed and ignored; use `align` (`placement="right"` → `align="end"`, `placement="center"` → `align="center"`).',
  )
}

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
 * The swallow lives only as long as its press: a press that ends without a
 * click (released outside the window, canceled) must not leave it armed, or
 * the next independent activation would be eaten. One that starts with a
 * pointerdown disarms it — the opening press's own trailing click never has
 * one — and one without (keyboard, script, assistive tech) reports
 * `detail: 0`, which the swallow passes through.
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
  window.addEventListener('pointerdown', disarmSwallow, {
    capture: true,
    once: true,
  })
}

function swallowOpeningClick(event: MouseEvent) {
  const trigger = pendingTrigger
  disarmSwallow()
  if (!trigger || !(event.target instanceof Node)) return
  // A `detail` of 0 means the click came from a keyboard or script, not a
  // pointer press — it is never the trailing click this swallow exists for.
  if (event.detail === 0) return
  // Capture phase on window, so this stops the click before it ever reaches
  // reka's handler on the trigger.
  if (trigger.contains(event.target)) event.stopPropagation()
}

function disarmSwallow() {
  pendingTrigger = null
  window.removeEventListener('click', swallowOpeningClick, { capture: true })
  window.removeEventListener('pointerdown', disarmSwallow, { capture: true })
}

onScopeDispose(disarmSwallow)

defineSlots<DropdownSlots>()
</script>
