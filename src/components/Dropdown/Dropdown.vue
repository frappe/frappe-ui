<template>
  <DropdownMenuRoot v-model:open="openModel" v-slot="{ open }">
    <DropdownMenuTrigger as-child>
      <slot
        v-if="$slots.trigger"
        name="trigger"
        v-bind="{ open, close, disabled: triggerDisabled, ...attrs }"
      />
      <slot
        v-else-if="$slots.default"
        v-bind="{ open, close, disabled: triggerDisabled, ...attrs }"
      />
      <Button v-else :active="false" v-bind="{ ...button, ...attrs }">
        {{ button?.label || 'Options' }}
      </Button>
    </DropdownMenuTrigger>

    <DropdownMenuPortal :to="portalTo">
      <DropdownMenuContent
        data-slot="content"
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
import type {
  DropdownGroupOption,
  DropdownOption,
  DropdownProps,
} from './types'
import { dropdownClasses, normalizeDropdownOptions } from './utils'

defineOptions({
  inheritAttrs: false,
})

const openModel = defineModel<boolean>('open', { default: false })
const attrs = useAttrs()
const slots = useSlots()

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
  return Boolean(props.button?.disabled || attrs.disabled)
})

defineSlots<{
  default?: (props: {
    open: boolean
    close: () => void
    disabled: boolean
    [key: string]: any
  }) => any
  trigger?: (props: {
    open: boolean
    close: () => void
    disabled: boolean
    [key: string]: any
  }) => any
  item?: (props: {
    item: DropdownOption
    close: () => void
    selected: boolean
  }) => any
  'item-prefix'?: (props: {
    item: DropdownOption
    close: () => void
    selected: boolean
  }) => any
  'item-label'?: (props: {
    item: DropdownOption
    close: () => void
    selected: boolean
  }) => any
  'item-suffix'?: (props: {
    item: DropdownOption
    close: () => void
    selected: boolean
  }) => any
  'group-label'?: (props: { group: DropdownGroupOption }) => any
  empty?: () => any
  [slotName: string]: ((props: any) => any) | undefined
}>()
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

:global(.dropdown-content[data-state='open']) {
  animation: dropdown-in 100ms ease-out;
}

:global(.dropdown-content[data-state='closed']) {
  animation: dropdown-out 75ms ease-in;
}
</style>
