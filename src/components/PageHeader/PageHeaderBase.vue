<template>
  <span ref="anchor" hidden />
  <Teleport defer :to="target ?? 'body'" :disabled="!target">
    <header v-bind="$attrs" @click="handleHeaderClick">
      <slot />
    </header>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, inject, useTemplateRef } from 'vue'
import { activeTarget, pageHeaderTargetKey } from './target'

defineOptions({
  inheritAttrs: false,
})

defineSlots<{
  /** The header's contents. */
  default?: () => any
}>()

// The header teleports away to the target, but the anchor stays at the
// declaration site — inside the page's scroll container — so the shell can
// find that container without being told about it.
const anchor = useTemplateRef<HTMLElement>('anchor')

// The nearest shell wins; the registry is the fallback for a header that is not
// a descendant of any shell (SHELL-Q3).
const provided = inject(pageHeaderTargetKey, null)
const target = computed(() => provided?.value ?? activeTarget.value)

function handleHeaderClick(event: MouseEvent) {
  const el = event.target as HTMLElement | null
  if (!el) return
  if (
    el.closest(
      'a, button, input, textarea, select, label, [role="button"], [data-no-scroll-top]',
    )
  ) {
    return
  }
  getScrollParent(anchor.value)?.scrollTo({ top: 0, behavior: 'smooth' })
}

function getScrollParent(el: HTMLElement | null): Element | null {
  let node = el?.parentElement
  while (node) {
    const { overflowY } = getComputedStyle(node)
    if (
      overflowY === 'auto' ||
      overflowY === 'scroll' ||
      overflowY === 'overlay'
    ) {
      return node
    }
    node = node.parentElement
  }
  return document.scrollingElement
}
</script>
