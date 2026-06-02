<template>
  <FocusScope
    role="dialog"
    :aria-label="dialogLabel"
    tabindex="-1"
    loop
    trapped
    class="editor-popover rounded-md border border-outline-gray-1 bg-surface-white shadow-xl outline-none"
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
 * floating panel needs — surface styling, `role="dialog"` + label, an enter
 * animation, and a looping focus trap (reka-ui `FocusScope`) — so each feature
 * only renders its own contents.
 *
 * It deliberately does NOT handle Escape or scroll-locking: dismissal and
 * scroll policy vary per popup and are owned by the opener (see the link
 * controller's two-stage Escape and scroll lock).
 */
const props = withDefaults(
  defineProps<{
    /** Accessible name announced for the dialog. */
    dialogLabel: string
    /** Layout/spacing classes for the panel body (width, padding, flex, …). */
    contentClass?: string | string[]
    /** Let FocusScope move focus to the first tabbable on open. Defaults `true`. */
    autofocus?: boolean
  }>(),
  { autofocus: true },
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
