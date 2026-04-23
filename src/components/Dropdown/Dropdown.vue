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
          dropdownClasses.content,
          {
            'origin-top-left': placement === 'left',
            'origin-top-right': placement === 'right',
            'origin-top': placement === 'center',
          },
        ]"
        :side="side"
        :align="align"
        :side-offset="offset"
      >
        <DropdownMenuList
          :groups="groups"
          :portal-to="portalTo"
          :close="close"
          :slot-fns="slots"
        />
      </DropdownMenuContent>
    </DropdownMenuPortal>
  </DropdownMenuRoot>
</template>

<script setup lang="ts">
import { computed, useAttrs, useSlots } from 'vue'
import {
  DropdownMenuContent,
  DropdownMenuPortal,
  DropdownMenuRoot,
  DropdownMenuTrigger,
} from 'reka-ui'
import { Button } from '../Button'
import DropdownMenuList from './DropdownMenuList.vue'
import type { DropdownProps, DropdownSlots } from './types'
import { dropdownClasses, normalizeDropdownOptions } from './utils'
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
  placement: 'left',
  side: 'bottom',
  offset: 4,
  portalTo: 'body',
})

function close() {
  openModel.value = false
}

const groups = computed(() => {
  return normalizeDropdownOptions(props.options)
})

const align = computed(() => {
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
@keyframes dropdown-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes dropdown-out {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.95);
  }
}

:global(.dropdown-content[data-motion='animated'][data-state='open']) {
  animation: dropdown-in 100ms ease-out;
}

:global(.dropdown-content[data-motion='animated'][data-state='closed']) {
  animation: dropdown-out 75ms ease-in;
}

/*
 * Keyboard opens skip the scale entrance, but a tiny opacity fade still
 * runs — it masks the 1-frame position-settle reka performs after mount.
 * ~80ms is below the perception threshold for motion but long enough to
 * hide the jump.
 */
:global(.dropdown-content[data-motion='instant'][data-state='open']) {
  animation: dropdown-instant-fade 80ms linear;
}

:global(.dropdown-content[data-motion='instant'][data-state='closed']) {
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

@media (prefers-reduced-motion: reduce) {
  :global(.dropdown-content) {
    animation-duration: 0ms !important;
  }
}
</style>
