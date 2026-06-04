<script setup lang="ts">
import {
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  injectContextMenuRootContext,
} from 'reka-ui'
import MenuList from '../Menu/MenuList.vue'
import type { NormalizedMenuGroup } from '../Menu/utils'

defineOptions({
  name: 'ContextMenuList',
})

const props = withDefaults(
  defineProps<{
    groups?: NormalizedMenuGroup[]
    slotFns?: Record<string, ((props?: any) => any) | undefined>
  }>(),
  {
    groups: () => [],
  },
)

const rootContext = injectContextMenuRootContext()

function close() {
  rootContext.onOpenChange(false)
}

const primitives = {
  Item: ContextMenuItem,
  Label: ContextMenuLabel,
  Portal: ContextMenuPortal,
  Sub: ContextMenuSub,
  SubContent: ContextMenuSubContent,
  SubTrigger: ContextMenuSubTrigger,
}
</script>

<template>
  <MenuList
    :groups="groups"
    :close="close"
    :slot-fns="slotFns"
    :primitives="primitives"
  />
</template>
