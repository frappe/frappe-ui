<template>
  <!-- `custom` so this row's single click handler decides between toggle and
       navigate — with RouterLink's own handler in play, selection could not
       reliably preventDefault before it navigates. -->
  <RouterLink v-if="to" :to="to" custom v-slot="{ href, navigate }">
    <ListRowBase
      tag="a"
      :href="href"
      :value="value"
      @click="onClick($event, navigate)"
    >
      <slot />
    </ListRowBase>
  </RouterLink>
  <ListRowBase
    v-else
    :tag="hasClickListener() ? 'button' : 'div'"
    :value="value"
    @click="onClick"
  >
    <slot />
  </ListRowBase>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useListContext } from './list-context'
import ListRowBase from './ListRowBase.vue'
import type { ListRowProps } from './types'

const props = defineProps<ListRowProps>()

const context = useListContext()

function hasClickListener() {
  return Boolean(props.onClick)
}

function onClick(event: MouseEvent, navigate?: (e?: MouseEvent) => void) {
  if (context?.selectable.value && props.value !== undefined) {
    event.preventDefault()
    context.toggleSelection(props.value)
    return
  }
  props.onClick?.(event)
  navigate?.(event)
}
</script>
