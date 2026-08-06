<template>
  <DialogRoot v-model:open="isOpen">
    <DialogPortal>
      <DialogOverlay
        class="fixed inset-0 z-50 bg-black-overlay-200 dark:bg-black-overlay-700 bottom-sheet-overlay outline-none"
        @after-leave="emit('after-leave')"
      />
      <DialogContent
        class="fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-2xl rounded-t-[36px] bg-surface-base shadow-lg [corner-shape:squircle] bottom-sheet-content focus:outline-none after:pointer-events-none after:absolute after:inset-x-0 after:top-full after:h-screen after:bg-surface-base"
        :aria-label="title || 'Bottom sheet'"
        @escape-key-down="onDismissAttempt"
        @interact-outside="onDismissAttempt"
        @open-auto-focus="(e: Event) => e.preventDefault()"
      >
        <div
          ref="handleRef"
          class="cursor-grab touch-none select-none active:cursor-grabbing"
        >
          <div class="flex justify-center pb-2 pt-3">
            <div class="h-1.5 w-10 rounded-full bg-surface-gray-3" />
          </div>
          <DialogTitle
            v-if="title"
            class="px-2 pb-3 pt-2 text-center text-3xl-semibold text-ink-gray-9"
          >
            {{ title }}
          </DialogTitle>
        </div>
        <!--
          `pan-y` lets the body scroll natively; the drag gesture reclaims it on
          the first move when the body is already at its top. `overscroll-contain`
          stops a scroll that runs out of content from chaining to the page
          behind the sheet. `dvh` so the height does not change when a mobile
          URL bar collapses, and `max-h` so a short sheet is not padded out with
          blank space.
        -->
        <div
          class="max-h-[70dvh] touch-pan-y overflow-y-auto overscroll-contain"
        >
          <slot />
        </div>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  DialogRoot,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogTitle,
} from 'reka-ui'
import { useSheetDrag } from '../../composables/useSheetDrag'
import type { BottomSheetProps, BottomSheetEmits } from './types'

const props = withDefaults(defineProps<BottomSheetProps>(), {
  dismissible: true,
})
const emit = defineEmits<BottomSheetEmits>()

const isOpen = computed({
  get: () => props.open || false,
  set(value: boolean) {
    emit('update:open', value)
  },
})

function onDismissAttempt(event: Event) {
  if (!props.dismissible) event.preventDefault()
}

// Swipe-down-to-dismiss. The gesture is bound to the whole sheet, not just the
// handle, so a swipe anywhere on it moves and closes it. `useSheetDrag` owns
// the decision of whether a given gesture belongs to the sheet or to a scroller
// inside it, and writes the sheet's transform directly rather than through a
// reactive binding, so a drag does not re-render the component on every frame.
const handleRef = ref<HTMLElement | null>(null)

/*
 * Found from the handle rather than from a ref on `DialogContent`. That
 * component's `$el` only becomes the sheet once the content is present, and
 * reka mounts it while the sheet is still closed, when `$el` is the placeholder
 * comment. A compiled consumer never patches that vnode again, so a ref on it
 * fires exactly once, with the comment, and the gesture is bound to nothing.
 * `handleRef` is a plain element ref, which Vue re-runs every time the content
 * mounts and unmounts, so this re-resolves on every open.
 */
const sheetEl = computed(
  () => handleRef.value?.closest<HTMLElement>('.bottom-sheet-content') ?? null,
)

useSheetDrag({
  target: sheetEl,
  handle: handleRef,
  enabled: () => props.dismissible,
  onDismiss: () => (isOpen.value = false),
})
</script>

<style scoped>
@keyframes bottom-sheet-overlay-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes bottom-sheet-overlay-out {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

@keyframes bottom-sheet-content-in {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

@keyframes bottom-sheet-content-out {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(100%);
  }
}

:global(.bottom-sheet-overlay[data-state='open']) {
  animation: bottom-sheet-overlay-in 150ms ease-out;
}

:global(.bottom-sheet-overlay[data-state='closed']) {
  animation: bottom-sheet-overlay-out 200ms ease-in;
}

/*
 * iOS-style sheet easing (fast-out, settle-in) — a spring feel without a lib.
 *
 * A running animation outranks the inline `transform` a drag writes, so for the
 * first 300ms after opening, a drag would move nothing and then snap. Dropping
 * the animation on `data-dragged` hands the transform back. It is done with an
 * attribute rather than an inline `animation: none` because clearing that later
 * would restart the entry animation, and because leaving it set would suppress
 * the exit animation on a normal close.
 */
:global(.bottom-sheet-content[data-state='open']:not([data-dragged])) {
  animation: bottom-sheet-content-in 300ms cubic-bezier(0.32, 0.72, 0, 1);
}

:global(.bottom-sheet-content[data-state='closed']) {
  animation: bottom-sheet-content-out 200ms ease-in;
}
</style>
