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
        <ContextMenuList :groups="groups" :slot-fns="slots" />
      </ContextMenuContent>
    </ContextMenuPortal>
  </ContextMenuRoot>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue'
import {
  ContextMenuContent,
  ContextMenuPortal,
  ContextMenuRoot,
  ContextMenuTrigger,
} from 'reka-ui'
import ContextMenuList from './ContextMenuList.vue'
import { menuClasses, normalizeMenuOptions } from '../Menu/utils'
import type { ContextMenuProps, ContextMenuSlots } from './types'

const openModel = defineModel<boolean>('open', { default: false })

const props = withDefaults(defineProps<ContextMenuProps>(), {
  options: () => [],
})

defineSlots<ContextMenuSlots>()

const slots = useSlots()

const groups = computed(() => normalizeMenuOptions(props.options))
</script>
