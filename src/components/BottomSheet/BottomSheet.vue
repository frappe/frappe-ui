<template>
  <DialogRoot v-model:open="isOpen">
    <DialogPortal>
      <DialogOverlay
        class="fixed inset-0 z-50 bg-black-overlay-200 dark:bg-black-overlay-700 bottom-sheet-overlay outline-none"
        @after-leave="emit('after-leave')"
      />
      <DialogContent
        class="fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-2xl transform-gpu rounded-t-[36px] bg-surface-base shadow-lg [corner-shape:squircle] bottom-sheet-content focus:outline-none after:pointer-events-none after:absolute after:inset-x-0 after:top-full after:h-screen after:bg-surface-base"
        :style="dragStyle"
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
        <div class="h-[70vh] overflow-y-auto">
          <slot />
        </div>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import {
  DialogRoot,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogTitle,
} from 'reka-ui'
import { usePointerSwipe } from '@vueuse/core'
import type { BottomSheetProps, BottomSheetEmits } from './types'

const props = withDefaults(defineProps<BottomSheetProps>(), {
  dismissible: true,
})
const emit = defineEmits<BottomSheetEmits>()

// Canonical `open`, with `v-model` (modelValue) also honored — mirrors Dialog.
// Both are Boolean props, so an unpassed one is `false` (not `undefined`);
// `||` lets whichever model the caller actually drives win.
const isOpen = computed({
  get: () => props.open || props.modelValue || false,
  set(value: boolean) {
    emit('update:open', value)
    emit('update:modelValue', value)
  },
})

function onDismissAttempt(event: Event) {
  if (!props.dismissible) event.preventDefault()
}

// Swipe-down-to-dismiss on the handle. While dragging we translate the sheet
// 1:1 with the pointer (transition off). On release we either fling it shut
// *from the release point* or spring it back to rest.
const handleRef = ref<HTMLElement | null>(null)
const dragY = ref(0)
const dragging = ref(false)
const closing = ref(false)

// Dismiss when the drag passes this fraction of the sheet's own height...
const CLOSE_HEIGHT_RATIO = 0.25
// ...or when released with at least this downward speed (px per ms) — a flick.
const CLOSE_VELOCITY = 0.5
const CLOSE_DURATION = 260

// Recent (offset, timestamp) samples during a drag, for release-velocity.
let samples: { y: number; t: number }[] = []
// Sheet height captured at drag start — drives both the rubber-band and the
// height-relative close threshold without re-measuring on every move.
let dragHeight = 0

/**
 * iOS-style resistance for the upward overscroll: the further you pull past the
 * resting position, the less the sheet follows, asymptotically. `overscroll` is
 * a positive distance; returns the (negative) damped offset.
 */
function rubberband(overscroll: number, dimension: number, constant = 0.55) {
  const d = dimension || window.innerHeight
  return -((overscroll * d * constant) / (d + constant * overscroll))
}

/** Downward speed (px/ms) over the last ~100ms of the drag; positive = down. */
function flickVelocity() {
  if (samples.length < 2) return 0
  const latest = samples[samples.length - 1]
  const oldest = samples.find((s) => latest.t - s.t <= 100) ?? samples[0]
  const dt = latest.t - oldest.t
  return dt > 0 ? (latest.y - oldest.y) / dt : 0
}

const dragStyle = computed(() => {
  // Fling shut: keep sliding down from the current offset and off-screen.
  // `animation: none` suppresses reka's exit keyframe so it can't restart the
  // slide from translateY(0) — which is what caused the "jump back up" flash.
  if (closing.value) {
    return {
      transform: 'translateY(100%)',
      transition: `transform ${CLOSE_DURATION}ms cubic-bezier(0.32, 0.72, 0, 1)`,
      animation: 'none',
    }
  }
  // Live drag: track the pointer with no transition.
  if (dragging.value) {
    return { transform: `translateY(${dragY.value}px)`, transition: 'none' }
  }
  // Rest / spring-back.
  return {
    transform: dragY.value ? `translateY(${dragY.value}px)` : undefined,
    transition: 'transform 200ms ease-out',
  }
})

const { distanceY, direction } = usePointerSwipe(handleRef, {
  // Accept mouse and pen as well as touch, so the handle is draggable on desktop.
  pointerTypes: ['mouse', 'touch', 'pen'],
  // Track from the first pixel — the default 50px threshold makes the sheet sit
  // still, then jump 50px once crossed, which reads as choppy.
  threshold: 0,
  onSwipeStart() {
    samples = []
    dragHeight =
      handleRef.value?.closest<HTMLElement>('.bottom-sheet-content')
        ?.offsetHeight ?? window.innerHeight
  },
  onSwipe() {
    if (!props.dismissible || closing.value) return
    dragging.value = true
    // distanceY is start.y - current.y, so -distanceY is +down / -up.
    // Down tracks 1:1; up gets rubber-band resistance and springs back on release.
    const raw = -distanceY.value
    dragY.value = raw >= 0 ? raw : rubberband(-raw, dragHeight)
    samples.push({ y: dragY.value, t: performance.now() })
  },
  onSwipeEnd() {
    if (!props.dismissible || closing.value) return
    dragging.value = false
    // Close on either a long-enough downward pull (relative to the sheet's
    // height) or a fast downward flick; anything else (incl. an upward pull)
    // springs back to rest.
    const draggedDown = direction.value === 'down' && dragY.value > 0
    const shouldClose =
      draggedDown &&
      (dragY.value > dragHeight * CLOSE_HEIGHT_RATIO ||
        flickVelocity() > CLOSE_VELOCITY)
    if (shouldClose) {
      // Animate the fling, then unmount. `closing` stays true through the
      // unmount so reka drops the node without replaying its own exit.
      closing.value = true
      window.setTimeout(() => (isOpen.value = false), CLOSE_DURATION + 20)
    } else {
      dragY.value = 0
    }
  },
})

// Fresh drag state each time the sheet opens.
watch(isOpen, (open) => {
  if (open) {
    closing.value = false
    dragY.value = 0
  }
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

/* iOS-style sheet easing (fast-out, settle-in) — a spring feel without a lib. */
:global(.bottom-sheet-content[data-state='open']) {
  animation: bottom-sheet-content-in 300ms cubic-bezier(0.32, 0.72, 0, 1);
}

:global(.bottom-sheet-content[data-state='closed']) {
  animation: bottom-sheet-content-out 200ms ease-in;
}
</style>
