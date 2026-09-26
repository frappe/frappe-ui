import { useSlots } from 'vue'
import type { Slots } from 'vue'
import { useSlotTick } from './useSlotTick'

/**
 * `useSlots()`, but safe to read inside a `computed`.
 *
 * The object Vue hands back is mutated in place and never tracked, so a
 * `computed` that reads it caches the slots filled at mount: a `#prefix`
 * behind a `v-if` renders while the padding reserved for it does not, a gated
 * region never appears at all. This wraps the same object in a proxy that
 * subscribes the caller to the slot tick on every read, so the deriving
 * `computed` re-runs when the slots change.
 *
 * Use it anywhere a component reads its own slots outside the template, and
 * anywhere the object is handed on, as a prop or through `provide`. Reading
 * `$slots` in your own template is already correct, because the render
 * function re-runs on its own; a child reading the same object is not, because
 * nothing re-renders the child when a slot toggles.
 */
export function useReactiveSlots<T extends object = Slots>(): T {
  const slots = useSlots()
  const slotTick = useSlotTick()

  return new Proxy(slots, {
    get(target, key, receiver) {
      slotTick.value
      return Reflect.get(target, key, receiver)
    },
    has(target, key) {
      slotTick.value
      return Reflect.has(target, key)
    },
    ownKeys(target) {
      slotTick.value
      return Reflect.ownKeys(target)
    },
  }) as T
}
