import { onBeforeUpdate, shallowRef } from 'vue'
import type { ShallowRef } from 'vue'

/**
 * Reactive invalidation for anything derived from `useSlots()`.
 *
 * `useSlots()` returns `instance.slots`, which Vue mutates in place and does
 * not track. A `computed` reading it caches on first evaluation and never
 * re-runs, so a slot behind a `v-if` leaves the derived value stuck at whatever
 * was filled at mount.
 *
 * Slot content only ever changes as part of a re-render, and `beforeUpdate`
 * runs after `updateSlots` and before the render function, so bumping here is
 * the invalidation those computeds are missing. Read `slotTick.value` inside
 * the computed to subscribe to it.
 */
export function useSlotTick(): ShallowRef<number> {
  const slotTick = shallowRef(0)
  onBeforeUpdate(() => {
    slotTick.value++
  })
  return slotTick
}
