<template>
  <DropdownMenuRoot v-model:open="openModel" v-slot="{ open }">
    <DropdownMenuTrigger as-child @pointerdown="markPointerDown">
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
        :data-motion="contentMotion"
        :class="[
          menuClasses.content,
          {
            'origin-top-left': align === 'start',
            'origin-top-right': align === 'end',
            'origin-top': align === 'center',
          },
        ]"
        :side="side"
        :align="align"
        :side-offset="offset"
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
import { computed, useAttrs, useSlots } from 'vue'
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
import { usePopoverMotion } from '../../composables/usePopoverMotion'

defineOptions({
  inheritAttrs: false,
})

const openModel = defineModel<boolean>('open', { default: false })
const attrs = useAttrs()
const slots = useSlots()

const { motion: contentMotion, onPointerDown: markPointerDown } =
  usePopoverMotion(openModel)

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

defineSlots<DropdownSlots>()
</script>

<style scoped>
/*
 * Dropdown is the only menu with a keyboard-open path, so the `instant`
 * motion lives here. Keyboard opens skip the scale entrance, but a tiny
 * opacity fade still runs — it masks the 1-frame position-settle reka
 * performs after mount. ~80ms is below the perception threshold for motion
 * but long enough to hide the jump.
 *
 * The shared `animated` keyframes + `prefers-reduced-motion` reset live in
 * Menu.vue (rendered by both Dropdown and ContextMenu).
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
