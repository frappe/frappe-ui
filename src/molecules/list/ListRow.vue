<template>
  <!-- `custom` so this row's single click handler decides between toggle and
       navigate — with RouterLink's own handler in play, selection could not
       reliably preventDefault before it navigates. -->
  <RouterLink v-if="to" :to="to" custom v-slot="{ href, navigate }">
    <ListRowBase tag="a" :href="href" :value="value" @click="onClick($event, navigate)">
      <slot />
    </ListRowBase>
  </RouterLink>
  <ListRowBase v-else :tag="hasClickListener ? 'button' : 'div'" :value="value" @click="onClick">
    <slot />
  </ListRowBase>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance } from 'vue'
import { RouterLink } from 'vue-router'
import { useListContext } from './list-context'
import ListRowBase from './ListRowBase.vue'
import type { ListRowProps } from './types'

const props = defineProps<ListRowProps>()

const emit = defineEmits<{
  /** Fired on click when the row is not a link. */
  (e: 'click', event: MouseEvent): void
}>()

const context = useListContext()

const instance = getCurrentInstance()
const hasClickListener = computed(() => !!instance?.vnode.props?.onClick)

function onClick(event: MouseEvent, navigate?: (e?: MouseEvent) => void) {
  if (context?.selectable.value && props.value !== undefined) {
    event.preventDefault()
    context.toggleSelection(props.value)
    return
  }
  if (navigate) {
    navigate(event)
  } else {
    emit('click', event)
  }
}
</script>
