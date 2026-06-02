<script setup lang="ts">
import { TooltipProvider as RekaTooltipProvider } from 'reka-ui'
import { computed } from 'vue'

/**
 * Groups multiple `<Tooltip>`s (and tooltip-bearing `<Button>`s) under a
 * single tooltip context. Once any tooltip in the group has opened, moving
 * the pointer to another trigger within `skipDelay` opens its tooltip
 * instantly — no hover delay between neighbouring buttons.
 *
 * `<Tooltip>` and `<Button>` detect this provider and skip mounting their
 * own, so the shared skip-delay window spans the whole group:
 *
 * ```vue
 * <TooltipProvider>
 *   <Button icon="bold" :tooltip="'Bold'" />
 *   <Tooltip text="Italic"><button>…</button></Tooltip>
 *   <Tooltip text="Underline"><button>…</button></Tooltip>
 * </TooltipProvider>
 * ```
 */
const props = withDefaults(
  defineProps<{
    /** Delay (in seconds) before the first tooltip in the group opens. */
    hoverDelay?: number
    /**
     * Window (in seconds) during which moving to another trigger in this
     * group opens its tooltip with no delay. Mirrors reka's
     * `skipDelayDuration`.
     */
    skipDelay?: number
    /**
     * When `true`, hovering the tooltip body closes it as the pointer
     * leaves the trigger.
     */
    disableHoverableContent?: boolean
  }>(),
  { hoverDelay: 0.5, skipDelay: 0.3, disableHoverableContent: false },
)

const delayDuration = computed(() => props.hoverDelay * 1000)
const skipDelayDuration = computed(() => props.skipDelay * 1000)
</script>

<template>
  <RekaTooltipProvider
    :delay-duration="delayDuration"
    :skip-delay-duration="skipDelayDuration"
    :disable-hoverable-content="disableHoverableContent"
  >
    <slot />
  </RekaTooltipProvider>
</template>
