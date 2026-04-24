import { ref, watch, type Ref } from 'vue'

/**
 * Classifies popover open transitions as pointer-driven or keyboard-driven
 * and exposes a `data-motion` value the consumer can bind on its content
 * element, so CSS can skip enter/exit animation for keyboard interactions.
 *
 * The contract is deliberately one-signal: call `onPointerDown` on the
 * trigger's `@pointerdown`. When `open` flips to `true`, an open is
 * classified as pointer-driven only if a `pointerdown` fired within
 * `windowMs` before it. Everything else (tab-focus, typing, Enter, Space,
 * arrow keys, programmatic opens) falls through to `'instant'`.
 *
 * This avoids tracking keydown keys, maintaining reset timers, or
 * differentiating `keydown` from `focus` — the pointer-recency check
 * catches pointer opens by definition and treats every other path as
 * keyboard by exclusion.
 */
export function usePopoverMotion(
  open: Ref<boolean>,
  { windowMs = 300 }: { windowMs?: number } = {},
) {
  const motion = ref<'animated' | 'instant'>('animated')
  let lastPointerDownAt = 0

  function onPointerDown() {
    lastPointerDownAt = Date.now()
  }

  watch(open, (isOpen, wasOpen) => {
    if (!isOpen || wasOpen) return
    motion.value =
      Date.now() - lastPointerDownAt < windowMs ? 'animated' : 'instant'
  })

  return { motion, onPointerDown }
}
