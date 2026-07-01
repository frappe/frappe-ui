<template>
  <PageHeaderBase
    class="z-10 flex h-[var(--mobile-header-height,52px)] flex-col justify-center border-b bg-surface-base px-3"
  >
    <div
      class="relative flex h-full w-full items-center"
      :style="titleInsetStyle"
    >
      <div
        v-if="hasLeftSlot"
        ref="leftSlotEl"
        class="absolute left-0 top-1/2 z-[1] flex max-w-[35%] -translate-y-1/2 justify-start"
      >
        <slot name="left" />
      </div>
      <h1
        class="mx-[var(--mobile-header-title-inset)] min-w-0 flex-1 overflow-hidden text-center text-xl-semibold leading-tight text-ink-gray-9 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]"
      >
        <slot>{{ title }}</slot>
      </h1>
      <div
        v-if="hasRightSlot"
        ref="rightSlotEl"
        class="absolute right-0 top-1/2 z-[1] flex max-w-[35%] -translate-y-1/2 justify-end"
      >
        <slot name="right" />
      </div>
    </div>
  </PageHeaderBase>
</template>

<script setup lang="ts">
import { useElementSize } from '@vueuse/core'
import { computed, useSlots, useTemplateRef, type CSSProperties } from 'vue'
import PageHeaderBase from './PageHeaderBase.vue'
import type { PageHeaderMobileProps } from './types'

defineProps<PageHeaderMobileProps>()

const slots = useSlots()
const hasLeftSlot = computed(() => Boolean(slots.left))
const hasRightSlot = computed(() => Boolean(slots.right))

// The title stays visually centered regardless of how wide the left/right
// controls are: inset it symmetrically by the widest control.
const MIN_CONTROL_WIDTH = 40
const TITLE_CONTROL_GAP = 8

const leftSlotEl = useTemplateRef<HTMLElement>('leftSlotEl')
const rightSlotEl = useTemplateRef<HTMLElement>('rightSlotEl')
const { width: leftSlotWidth } = useElementSize(leftSlotEl)
const { width: rightSlotWidth } = useElementSize(rightSlotEl)

const titleInset = computed(() => {
  const widestSlot = Math.max(
    hasLeftSlot.value ? Math.max(leftSlotWidth.value, MIN_CONTROL_WIDTH) : 0,
    hasRightSlot.value ? Math.max(rightSlotWidth.value, MIN_CONTROL_WIDTH) : 0,
  )

  return widestSlot > 0
    ? `${Math.ceil(widestSlot + TITLE_CONTROL_GAP)}px`
    : '0px'
})

const titleInsetStyle = computed<CSSProperties>(() => ({
  '--mobile-header-title-inset': titleInset.value,
}))
</script>
