import { getCurrentInstance, ref } from 'vue'

/**
 * Defers an overlay's popup machinery (reka root, trigger, portal) until its
 * trigger is first hovered or focused.
 *
 * Until then the overlay renders its trigger alone through reka's `Slot`,
 * with the data attributes reka's closed trigger carries, so the DOM is the
 * same and nothing shifts. On the first hover or focus the overlay mounts in
 * full and the event is sent again to the new trigger, so reka opens the
 * popup with its usual delay, as if it had been mounted all along.
 *
 * The shell listens for what the reka trigger of that `kind` opens on, so it
 * mounts in the same cases. Touch screens do not hover: there a tooltip never
 * mounts, and a hover card mounts only when a tap focuses its trigger.
 *
 * Mounting replaces the trigger element, because its ancestors change from
 * `Slot` to reka's root and trigger. Focus and text selection inside the
 * trigger move to the new element.
 *
 * Call it from the overlay's `setup`, and render the full overlay as its root
 * once `mounted` is true.
 */
export function useDeferredTrigger(kind: 'tooltip' | 'hoverCard') {
  const instance = getCurrentInstance()!
  const mounted = ref(false)
  // Reka's tooltip ignores focus that comes from a press (a click or a tap),
  // so a pressed tooltip trigger does not mount either. Its hover card opens
  // on any focus.
  let pressed = false

  function mount(event?: Event) {
    if (mounted.value) return
    mounted.value = true

    const shell = event?.currentTarget
    if (!event || !(shell instanceof Element)) return
    const focus = captureFocus(shell)

    // Render now rather than on the next tick, so reka starts its hover-delay
    // timer in the same task as the real event, as it did when it was mounted
    // from the start. Tests that hover and then advance a fake clock rely on it.
    instance.update()
    const trigger = firstElement(instance.subTree.el)
    if (!trigger) return
    const gotFocus = receivesEvent(trigger, 'focus', () =>
      focus?.restore(trigger),
    )
    replay(event, trigger, gotFocus)
  }

  function onPointer(event: Event) {
    if ((event as Partial<PointerEvent>).pointerType !== 'touch') mount(event)
  }

  function onFocus(event: Event) {
    if (!pressed) mount(event)
  }

  function onPointerdown() {
    if (kind !== 'tooltip') return
    pressed = true
    document.addEventListener(
      'pointerup',
      () => setTimeout(() => (pressed = false), 1),
      { once: true },
    )
  }

  /** Props for the `Slot` that renders the trigger before mounting. */
  const shellProps = {
    'data-slot': 'trigger',
    'data-state': 'closed',
    'data-grace-area-trigger': '',
    // Reka's tooltip opens on pointermove, its hover card on pointerenter.
    [kind === 'tooltip' ? 'onPointermove' : 'onPointerenter']: onPointer,
    // `focus` covers the trigger itself, `focusin` its descendants.
    onFocus,
    onFocusin: onFocus,
    onPointerdown,
  }

  return { mounted, mount, shellProps }
}

// Sends the event that mounted the overlay to the new trigger, so reka runs
// its own open logic: hover delay, skip delay, touch filtering.
function replay(event: Event, trigger: Element, gotFocus: boolean) {
  if (event.type.startsWith('pointer')) {
    // A script can dispatch a plain `Event` named "pointermove", and reka
    // still treats it as a pointer, so read its fields as optional.
    const pointer: Partial<PointerEvent> = event
    trigger.dispatchEvent(
      new PointerEvent(event.type, {
        pointerId: pointer.pointerId,
        pointerType: pointer.pointerType ?? 'mouse',
        isPrimary: pointer.isPrimary,
        clientX: pointer.clientX,
        clientY: pointer.clientY,
      }),
    )
    return
  }
  // Reka opens on a `focus` event that reaches the trigger. A descendant's
  // focus only arrives as `focusin`, so it is not sent again. Restoring focus
  // already sends `focus`, unless the window does not have focus. Reka must
  // see it exactly once: a hover card starts an open timer for each one.
  if (event.type === 'focus' && !gotFocus) {
    trigger.dispatchEvent(new FocusEvent('focus'))
  }
}

// The first element a rendered tree starts with. Reka's root renders a
// fragment, whose node is an empty text anchor placed before the trigger.
// Vue types a rendered node loosely, as any renderer's node.
function firstElement(node: unknown): Element | null {
  if (node instanceof Element) return node
  if (node instanceof CharacterData) return node.nextElementSibling
  return null
}

// Runs `action` and reports whether it dispatched `type` on `target`.
// Focus events dispatch synchronously inside `focus()`.
function receivesEvent(target: Element, type: string, action: () => void) {
  let received = false
  const listener = () => (received = true)
  target.addEventListener(type, listener)
  action()
  target.removeEventListener(type, listener)
  return received
}

// Remembers where focus is inside the trigger by child position, so it can be
// put back in the same place once the trigger element is replaced.
function captureFocus(shell: Element) {
  const active = document.activeElement
  if (!active || !shell.contains(active)) return

  const path: number[] = []
  for (let node = active; node !== shell; node = node.parentElement!) {
    path.unshift(Array.from(node.parentElement!.children).indexOf(node))
  }
  const selection = isTextField(active)
    ? ([
        active.selectionStart,
        active.selectionEnd,
        active.selectionDirection ?? undefined,
      ] as const)
    : null

  return {
    restore(trigger: Element) {
      let target: Element | undefined = trigger
      for (const index of path) target = target?.children[index]
      if (!(target instanceof HTMLElement)) return
      target.focus({ preventScroll: true })
      if (!selection || !isTextField(target)) return
      try {
        target.setSelectionRange(...selection)
      } catch {
        // Inputs like type="email" do not support selection ranges.
      }
    },
  }
}

function isTextField(
  element: Element,
): element is HTMLInputElement | HTMLTextAreaElement {
  return (
    element instanceof HTMLInputElement ||
    element instanceof HTMLTextAreaElement
  )
}
