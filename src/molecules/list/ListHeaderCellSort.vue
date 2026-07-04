<template>
  <div
    data-slot="list-header-cell"
    role="columnheader"
    :aria-sort="
      direction ? (direction === 'asc' ? 'ascending' : 'descending') : undefined
    "
    :data-sort="direction || undefined"
    class="flex min-w-0 items-center"
    :class="isEnd && 'justify-end'"
  >
    <!-- Controlled: sort state and toggle rules live in the app, surfaced
         back via `direction`. The cell renders only the behavioral chrome —
         real button, aria-sort, tooltip, suffix reveal. -->
    <Tooltip :text="tooltipText" :disabled="!tooltipText">
      <button
        ref="button"
        type="button"
        class="group inline-flex h-7 min-w-0 items-center gap-1 rounded text-sm-medium text-ink-gray-5 transition-colors"
        @click="emit('click', $event)"
      >
        <!-- End-aligned: the glyph leads so the label stays flush with the
             column's right edge (aligned with the values below). A trailing
             glyph would reserve space and push the label off the edge. -->
        <span
          v-if="isEnd && $slots.suffix"
          class="shrink-0"
          :class="suffixRevealClass"
          aria-hidden="true"
        >
          <slot name="suffix" :direction="direction ?? null" />
        </span>
        <span v-if="$slots.prefix" class="shrink-0">
          <slot name="prefix" :direction="direction ?? null" />
        </span>
        <span class="truncate"><slot /></span>
        <!-- The glyphs are consumer content; the cell only owns the reveal:
             an inactive column's suffix shows on hover. -->
        <span
          v-if="!isEnd && $slots.suffix"
          class="shrink-0"
          :class="suffixRevealClass"
          aria-hidden="true"
        >
          <slot name="suffix" :direction="direction ?? null" />
        </span>
      </button>
    </Tooltip>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, useTemplateRef } from 'vue'
import { Tooltip } from '../../components/Tooltip'
import type { ListHeaderCellSortProps } from './types'

const props = defineProps<ListHeaderCellSortProps>()

const emit = defineEmits<{
  /** Fired on sort button click — update your sort state here. */
  (e: 'click', event: MouseEvent): void
}>()

const isEnd = computed(() => props.align === 'end')

// An inactive column's sort glyph is hidden until hover — but with opacity, not
// display, so revealing it never shifts the label's position.
const suffixRevealClass = computed(() =>
  props.direction ? '' : 'opacity-0 group-hover:opacity-100',
)

defineSlots<{
  /** Column label. */
  default?: () => unknown
  /** Leading adornment, rendered before the label. */
  prefix?: (props: { direction: 'asc' | 'desc' | null }) => unknown
  /**
   * Trailing adornment — sort glyphs go here, app-supplied (e.g. a lucide
   * arrow span). The cell owns the reveal: an inactive column's suffix
   * shows on hover. Render per `direction`.
   */
  suffix?: (props: { direction: 'asc' | 'desc' | null }) => unknown
}>()

// The label is slot content, so the tooltip reads the rendered text.
const buttonEl = useTemplateRef('button')
const label = ref('')
onMounted(() => {
  label.value = buttonEl.value?.textContent?.trim() ?? ''
})
const tooltipText = computed(() =>
  label.value ? `Order by ${label.value.toLowerCase()}` : undefined,
)
</script>
