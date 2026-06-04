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
        :class="menuClasses.content"
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
import { menuClasses, normalizeMenuOptions } from '../Menu/utils'
import type { ContextMenuProps, ContextMenuSlots } from './types'

const props = withDefaults(defineProps<ContextMenuProps>(), {
  options: () => [],
})

defineSlots<ContextMenuSlots>()

const slots = useSlots()

const isOpen = ref(false)

const groups = computed(() => normalizeMenuOptions(props.options))
</script>
