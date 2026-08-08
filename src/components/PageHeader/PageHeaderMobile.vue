<template>
  <PageHeaderBase
    class="z-10 flex h-[var(--mobile-header-height,52px)] flex-col justify-center border-b bg-surface-base px-3"
  >
    <div
      class="relative flex h-full w-full items-center"
      :style="titleInsetStyle"
    >
      <div
        v-if="hasPrefixSlot"
        ref="prefixSlotEl"
        class="absolute left-0 top-1/2 z-[1] flex max-w-[35%] -translate-y-1/2 justify-start"
      >
        <slot name="prefix" />
      </div>
      <!-- One line, ellipsised. A wrapped title changes the header's height as the
           user navigates, which shifts the page under it. min-w-0 is what lets this
           flex child shrink below its content width so truncate has something to do.
           truncate here covers a plain-text title; a PageHeaderMobileTitle caps
           itself at this width and ellipsises its own text, so the two never race. -->
      <h1
        class="mx-[var(--mobile-header-title-inset)] min-w-0 flex-1 truncate text-center text-xl-semibold leading-tight text-ink-gray-9"
      >
        <slot>{{ title }}</slot>
      </h1>
      <div
        v-if="hasSuffixSlot"
        ref="suffixSlotEl"
        class="absolute right-0 top-1/2 z-[1] flex max-w-[35%] -translate-y-1/2 justify-end"
      >
        <slot name="suffix" />
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

defineSlots<{
  /** A control leading the centered title — usually a `PageHeaderBackButton`. */
  prefix?: () => any
  /** The centered title. Overrides `title`; usually a `PageHeaderMobileTitle`. */
  default?: () => any
  /** A control trailing the centered title — usually an action button. */
  suffix?: () => any
}>()

const slots = useSlots()
const hasPrefixSlot = computed(() => Boolean(slots.prefix))
const hasSuffixSlot = computed(() => Boolean(slots.suffix))

// The title stays visually centered regardless of how wide the prefix/suffix
// controls are: inset it symmetrically by the widest control.
const MIN_CONTROL_WIDTH = 40
const TITLE_CONTROL_GAP = 8

const prefixSlotEl = useTemplateRef<HTMLElement>('prefixSlotEl')
const suffixSlotEl = useTemplateRef<HTMLElement>('suffixSlotEl')
const { width: prefixSlotWidth } = useElementSize(prefixSlotEl)
const { width: suffixSlotWidth } = useElementSize(suffixSlotEl)

const titleInset = computed(() => {
  const widestSlot = Math.max(
    hasPrefixSlot.value
      ? Math.max(prefixSlotWidth.value, MIN_CONTROL_WIDTH)
      : 0,
    hasSuffixSlot.value
      ? Math.max(suffixSlotWidth.value, MIN_CONTROL_WIDTH)
      : 0,
  )

  return widestSlot > 0
    ? `${Math.ceil(widestSlot + TITLE_CONTROL_GAP)}px`
    : '0px'
})

const titleInsetStyle = computed<CSSProperties>(() => ({
  '--mobile-header-title-inset': titleInset.value,
}))
</script>
