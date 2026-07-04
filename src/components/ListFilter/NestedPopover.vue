<template>
  <Popover v-slot="{ open }">
    <PopoverButton
      as="div"
      ref="reference"
      @click="updatePosition"
      @focusin="updatePosition"
      @keydown="updatePosition"
      v-slot="{ open }"
    >
      <slot name="target" v-bind="{ open }" />
    </PopoverButton>
    <div v-show="open">
      <PopoverPanel
        v-slot="{ open, close }"
        ref="popover"
        static
        class="z-[100]"
      >
        <slot name="body" v-bind="{ open, close }" />
      </PopoverPanel>
    </div>
  </Popover>
</template>

<script setup lang="ts">
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue'
import { createPopper, type Instance, type Placement } from '@popperjs/core'
import { nextTick, ref, onBeforeUnmount } from 'vue'

const props = withDefaults(
  defineProps<{
    placement?: Placement
  }>(),
  {
    placement: 'bottom-start',
  },
)

type HeadlessElementRef = {
  el: HTMLElement
}

const reference = ref<HeadlessElementRef | null>(null)
const popover = ref<HeadlessElementRef | null>(null)

let popper = ref<Instance | null>(null)

function setupPopper() {
  if (!reference.value?.el || !popover.value?.el) return
  if (!popper.value) {
    popper.value = createPopper(reference.value.el, popover.value.el, {
      placement: props.placement,
    })
  } else {
    popper.value.update()
  }
}

function updatePosition() {
  nextTick(() => setupPopper())
}

onBeforeUnmount(() => {
  popper.value?.destroy()
})
</script>
