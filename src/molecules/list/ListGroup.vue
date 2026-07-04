<template>
  <!-- A titled section of rows. `role="rowgroup"` gives assistive tech real
       group structure, and keeping the rows as direct children preserves the
       family's `list-row + list-row` divider adjacency *within* the group —
       something a raw <p> spliced between rows silently breaks. -->
  <div data-slot="list-group" role="rowgroup" :aria-label="ariaLabel">
    <div
      v-if="label || $slots.header"
      data-slot="list-group-header"
      class="flex h-8 items-center text-sm-medium text-ink-gray-5"
      :class="sticky && 'sticky top-0 z-10 bg-surface-base'"
    >
      <slot name="header">{{ label }}</slot>
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  /** Section label shown in the group header. Overridden by the #header slot. */
  label?: string
  /**
   * Pin the group header to the top of the scroll container while its rows
   * scroll under it. Off by default.
   */
  sticky?: boolean
}>()

defineSlots<{
  /** The group's rows — `<ListRow>` elements. */
  default?: () => unknown
  /** Replaces the header content (the label). */
  header?: () => unknown
}>()

const ariaLabel = computed(() => props.label || undefined)
</script>
