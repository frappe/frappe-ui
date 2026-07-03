<template>
  <span ref="anchor" hidden />
  <Teleport defer :to="activeTarget ?? 'body'" :disabled="!activeTarget">
    <header v-bind="$attrs" @click="handleHeaderClick">
      <slot />
    </header>
  </Teleport>
</template>

<script setup lang="ts">
import { useTemplateRef } from 'vue'
import { activeTarget } from './target'

defineOptions({
  inheritAttrs: false,
})

// The header teleports away to the target, but the anchor stays at the
// declaration site — inside the page's scroll container — so the shell can
// find that container without being told about it.
const anchor = useTemplateRef<HTMLElement>('anchor')

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
