<template>
  <FocusScope
    role="dialog"
    :aria-label="dialogLabel"
    tabindex="-1"
    :loop="loop"
    :trapped="trapped"
    class="editor-popover border border-outline-gray-1 bg-surface-elevation-2 shadow-xl outline-none"
    :class="contentClass"
    @mount-auto-focus="onMountAutoFocus"
    @unmount-auto-focus="onUnmountAutoFocus"
  >
    <slot />
  </FocusScope>
</template>

<script setup lang="ts">
import { FocusScope } from 'reka-ui'

/**
 * Shared chrome for editor popups mounted via `useFloatingPopup`
 * (link editor, font-color picker, …). It owns the cross-cutting concerns a
 * floating panel needs — border/background/shadow, `role="dialog"` + label, an
 * enter animation, and a looping focus trap (reka-ui `FocusScope`) — so each
 * feature only renders its own contents. The corner radius is intentionally NOT
 * owned here: each popup sets its own via `content-class` (e.g. `rounded-md`).
 *
 * It deliberately does NOT handle Escape or scroll-locking: dismissal and
 * scroll policy vary per popup and are owned by the opener (see the link
 * controller's two-stage Escape and scroll lock).
 *
 * Focus trapping is on by default (standalone dialogs like the link/color
 * editors that own focus), but can be turned off for popups that must leave
 * focus in the editor — e.g. suggestion lists, where the user keeps typing to
 * filter. Trapping those would let FocusScope's MutationObserver steal focus on
 * every keystroke-driven re-render.
 */
const props = withDefaults(
  defineProps<{
    /** Accessible name announced for the dialog. */
    dialogLabel: string
    /** Layout/spacing classes for the panel body (width, padding, flex, …). */
    contentClass?: string | string[]
    /** Let FocusScope move focus to the first tabbable on open. Defaults `true`. */
    autofocus?: boolean
    /** Keep focus inside the panel (focus trap). Defaults `true`. */
    trapped?: boolean
    /** Loop Tab focus at the panel edges. Defaults `true`. */
    loop?: boolean
  }>(),
  { autofocus: true, trapped: true, loop: true },
)

function onMountAutoFocus(event: Event) {
  // When the content focuses itself (e.g. the link input autofocuses on its own
  // nextTick), don't let FocusScope steal focus to the first tabbable on open.
  if (!props.autofocus) event.preventDefault()
}

function onUnmountAutoFocus(event: Event) {
  // Don't restore focus on close: the popup owner returns focus on Escape, and
  // a deliberate click-outside should keep focus where the user clicked.
  event.preventDefault()
}
</script>

<style scoped>
.editor-popover {
  animation: editor-popover-in 90ms ease-out;
  transform-origin: center;
}

@keyframes editor-popover-in {
  from {
    opacity: 0;
    transform: scale(0.98);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@media (prefers-reduced-motion: reduce) {
  .editor-popover {
    animation: none;
  }
}
</style>
