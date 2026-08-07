<script setup lang="ts">
import { TooltipArrow, TooltipContent, TooltipPortal } from 'reka-ui'
import type { TooltipSide } from './types'

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
 *
 * Internal: not part of the public export surface. Style it from the outside
 * through the `data-slot` hooks, not through class props (P10).
 */
withDefaults(
  defineProps<{
    /** Preferred popover side relative to the trigger. */
    side?: TooltipSide
    /** Distance in px between the trigger and the bubble. */
    offset?: number
    /** Text content when neither `#content` nor `#body` is provided. */
    text?: string
  }>(),
  { side: 'top', offset: 4 },
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
    <TooltipContent
      data-slot="content"
      :side="side"
      :side-offset="offset"
      class="z-[100]"
    >
      <slot name="body">
        <div
          data-slot="bubble"
          class="rounded bg-surface-gray-10 px-2 py-1 text-xs text-ink-base shadow-xl"
        >
          <slot name="content">
            <slot>{{ text }}</slot>
          </slot>
        </div>
      </slot>
      <TooltipArrow
        data-slot="arrow"
        class="fill-surface-gray-10"
        :width="8"
        :height="4"
      />
    </TooltipContent>
  </TooltipPortal>
</template>
