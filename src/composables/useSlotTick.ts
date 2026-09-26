import { getCurrentInstance, onBeforeUpdate, shallowRef } from 'vue'
import type { ComponentInternalInstance, ShallowRef } from 'vue'

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
 * the invalidation those computeds are missing.
 *
 * Components should reach for `useReactiveSlots()` instead — it reads this tick
 * for them. This is the low-level piece, for composables that take slot state
 * as getters rather than reading a slots object.
 */

// One tick per component, however many callers ask for it. `useReactiveSlots`
// and `useInputLabeling` both want it, and a component using the two would
// otherwise register the hook twice and keep two refs in step for nothing.
const ticks = new WeakMap<ComponentInternalInstance, ShallowRef<number>>()

export function useSlotTick(): ShallowRef<number> {
  const instance = getCurrentInstance()
  // Outside a component there is no update to invalidate on. A constant ref
  // saves every caller a branch.
  if (!instance) return shallowRef(0)

  const existing = ticks.get(instance)
  if (existing) return existing

  const slotTick = shallowRef(0)
  onBeforeUpdate(() => {
    slotTick.value++
  })
  ticks.set(instance, slotTick)
  return slotTick
}
