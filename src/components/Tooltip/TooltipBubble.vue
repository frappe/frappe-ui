<script setup lang="ts">
import { TooltipArrow, TooltipContent, TooltipPortal } from 'reka-ui'

/**
 * Renders the styled tooltip popover (portal + content + arrow) so the
 * bubble styling lives in exactly one place. Consumers supply the
 * content via `text`, `#content`, or `#body`.
 *
 * Used by:
 *  - `<Tooltip>` — the wrapper Vue component
 *  - `<Button>` — renders reka Tooltip primitives inline to keep
 *    `<button>` as the effective DOM root; shares the bubble styling
 *    through this component
 */
withDefaults(
  defineProps<{
    /** Preferred popover side relative to the trigger. */
    side?: 'top' | 'right' | 'bottom' | 'left'
    /** Text content when neither `#content` nor `#body` is provided. */
    text?: string
    /** Fill class for the arrow — defaults to match the bubble shell. */
    arrowClass?: string
  }>(),
  { side: 'top', arrowClass: 'fill-surface-gray-7' },
)

defineSlots<{
  /** Replaces just the text inside the standard bubble. */
  default?: () => any
  /** Replaces just the text inside the standard bubble. */
  content?: () => any
  /** Replaces the entire bubble (including its shell) — arrow still renders. */
  body?: () => any
}>()
</script>

<template>
  <TooltipPortal>
    <TooltipContent :side="side" :side-offset="4" class="z-[100]">
      <slot name="body">
        <div
          class="rounded bg-surface-gray-7 px-2 py-1 text-xs text-ink-white shadow-xl"
        >
          <slot name="content">
            <slot>{{ text }}</slot>
          </slot>
        </div>
      </slot>
      <TooltipArrow :class="arrowClass" :width="8" :height="4" />
    </TooltipContent>
  </TooltipPortal>
</template>
