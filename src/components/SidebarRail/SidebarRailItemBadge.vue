<template>
  <!--
    Both badges are drawn inside the cell, so they move in the same frame as the
    item when a scroll area or the page's overscroll bounce moves it. The pill is
    anchored by its right edge, so a longer count grows over the item instead of
    out past the rail's right gutter.
  -->
  <span
    v-if="showCount"
    data-slot="sidebar-rail-item-badge"
    aria-hidden="true"
    class="pointer-events-none absolute -right-2.5 -top-2 inline-flex rounded-full border border-[var(--surface-base)]"
  >
    <Badge variant="solid" theme="red" size="sm">
      {{ formattedCount }}
    </Badge>
  </span>

  <span
    v-else-if="showDot"
    data-slot="sidebar-rail-item-badge-dot"
    aria-hidden="true"
    class="pointer-events-none absolute -right-0.5 -top-0.5 block size-2 rounded-full border border-[var(--surface-base)] bg-surface-red-6"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Badge from '../Badge/Badge.vue'

const props = defineProps<{
  count: number
  variant: 'count' | 'dot'
}>()

const showCount = computed(() => props.count > 0 && props.variant === 'count')
const showDot = computed(() => props.count > 0 && props.variant === 'dot')

/** Caps an unread count for display, e.g. 142 -> "99+". */
const formattedCount = computed(() =>
  props.count > 99 ? '99+' : props.count.toString(),
)
</script>
