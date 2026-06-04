<template>
  <ContextMenuRoot v-model:open="isOpen">
    <ContextMenuTrigger as-child>
      <slot v-if="$slots.trigger" name="trigger" :open="isOpen" />
      <slot v-else :open="isOpen" />
    </ContextMenuTrigger>

    <ContextMenuPortal>
      <ContextMenuContent
        data-slot="content"
        data-motion="animated"
        :class="dropdownClasses.content"
      >
        <ContextMenuList :groups="groups" :slot-fns="slots" />
      </ContextMenuContent>
    </ContextMenuPortal>
  </ContextMenuRoot>
</template>

<script setup lang="ts">
import { ref, computed, useSlots } from 'vue'
import {
  ContextMenuContent,
  ContextMenuPortal,
  ContextMenuRoot,
  ContextMenuTrigger,
} from 'reka-ui'
import ContextMenuList from './ContextMenuList.vue'
import { dropdownClasses, normalizeDropdownOptions } from '../Dropdown/utils'
import type { DropdownOptions, DropdownSlots } from '../Dropdown/types'

const props = withDefaults(defineProps<{ options?: DropdownOptions }>(), {
  options: () => [],
})

defineSlots<
  Omit<DropdownSlots, 'default' | 'trigger'> & {
    /** Alternate trigger renderer. */
    default?: (props: { open: boolean }) => any
    /** The right-clickable region that opens the menu. */
    trigger?: (props: { open: boolean }) => any
  }
>()

const slots = useSlots()

const isOpen = ref(false)

const groups = computed(() => normalizeDropdownOptions(props.options))
</script>
