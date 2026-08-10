<script setup lang="ts">
import { TooltipArrow, TooltipContent, TooltipPortal } from 'reka-ui'
import { usePortalTarget } from '../../composables/usePortalTarget'
import type { TooltipSide } from './types'

/**
 * Renders the styled tooltip popover (portal + content + arrow) so the
 * bubble styling lives in exactly one place. Consumers supply the
 * content via `text` or `#content`, and drop the bubble shell with `bare`.
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
    /** Text content when `#content` is not provided. */
    text?: string
    /** Render the content without the bubble shell. The arrow still renders. */
    bare?: boolean
  }>(),
  { side: 'top', offset: 4, bare: false },
)

const portalTarget = usePortalTarget()

defineSlots<{
  /** The bubble's content. Takes precedence over `text`. */
  content?: () => any
}>()
</script>

<template>
  <TooltipPortal :to="portalTarget">
    <TooltipContent
      data-slot="content"
      :side="side"
      :side-offset="offset"
      class="z-[100]"
    >
      <slot v-if="bare" name="content" />
      <div
        v-else
        data-slot="bubble"
        class="rounded-4 bg-surface-gray-10 px-2 py-1 text-xs text-ink-base shadow-xl"
      >
        <slot name="content">{{ text }}</slot>
      </div>
      <TooltipArrow
        data-slot="arrow"
        class="fill-surface-gray-10"
        :width="8"
        :height="4"
      />
    </TooltipContent>
  </TooltipPortal>
</template>
