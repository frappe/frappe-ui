<script setup lang="ts">
import {
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from 'reka-ui'
import MenuList from '../Menu/MenuList.vue'
import type { NormalizedMenuGroup } from '../Menu/utils'

defineOptions({
  name: 'DropdownMenuList',
})

const props = withDefaults(
  defineProps<{
    groups?: NormalizedMenuGroup[]
    portalTo?: string | HTMLElement
    close: () => void
    slotFns?: Record<string, ((props?: any) => any) | undefined>
  }>(),
  {
    groups: () => [],
    portalTo: 'body',
  },
)

const primitives = {
  Item: DropdownMenuItem,
  Label: DropdownMenuLabel,
  Portal: DropdownMenuPortal,
  Sub: DropdownMenuSub,
  SubContent: DropdownMenuSubContent,
  SubTrigger: DropdownMenuSubTrigger,
}
</script>

<template>
  <MenuList
    :groups="groups"
    :close="close"
    :slot-fns="slotFns"
    :portal-to="portalTo"
    :primitives="primitives"
  />
</template>
