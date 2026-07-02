<template>
  <!--
    Count pill: an invisible anchor stays inside the (overflow-hidden) rail cell
    while the pill itself is teleported to <body> and positioned against the
    anchor, so the scroll area can't clip it.
  -->
  <span
    v-if="showCount"
    ref="referenceEl"
    aria-hidden="true"
    class="pointer-events-none absolute -top-2 right-2 size-0"
  />

  <span
    v-else-if="showDot"
    data-slot="rail-item-badge-dot"
    aria-hidden="true"
    class="pointer-events-none absolute -right-0.5 -top-0.5 block size-2 rounded-full border border-[var(--surface-base)] bg-surface-red-6"
  />

  <Teleport to="body">
    <span
      v-if="showCount"
      ref="floatingEl"
      class="pointer-events-none inline-flex rounded-full border border-[var(--surface-base)]"
      :class="{ invisible: !isPositioned }"
      :style="floatingStyles"
    >
      <Badge variant="solid" theme="red" size="sm" aria-hidden="true">
        {{ formattedCount }}
      </Badge>
    </span>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, useTemplateRef } from 'vue'
import { autoUpdate, useFloating } from '@floating-ui/vue'
import Badge from '../Badge/Badge.vue'

const props = defineProps<{
  count: number
  variant: 'count' | 'dot'
}>()

const referenceEl = useTemplateRef<HTMLElement>('referenceEl')
const floatingEl = useTemplateRef<HTMLElement>('floatingEl')

const showCount = computed(() => props.count > 0 && props.variant === 'count')
const showDot = computed(() => props.count > 0 && props.variant === 'dot')

/** Caps an unread count for display, e.g. 142 -> "99+". */
const formattedCount = computed(() =>
  props.count > 99 ? '99+' : props.count.toString(),
)

const { floatingStyles, isPositioned } = useFloating(referenceEl, floatingEl, {
  open: showCount,
  placement: 'bottom-start',
  strategy: 'fixed',
  transform: false,
  whileElementsMounted: autoUpdate,
})
</script>
