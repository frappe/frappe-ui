<script setup lang="ts">
/**
 * Corner resize handle for media / embed node views.
 *
 * A single grip in the bottom-right corner — the direction every OS window and
 * image editor already trains people to reach for. It replaces the pair of
 * vertical pills that used to sit centered on the left and right edges: those
 * were easy to miss, covered the middle of the media where the click lands for
 * selecting it, and answered a drag downward with nothing at all.
 *
 * The button is a 32px hit target with the small visible grip pinned to its
 * bottom-right corner, so the target is comfortable without the chrome being
 * heavy. Keyboard resize (arrow keys) is forwarded to the host node view.
 */
defineProps<{
  /** Accessible label, e.g. "Resize media" / "Resize embed". */
  label: string
  /**
   * Lift the handle clear of a bottom control bar. The video playback controls
   * sit at `bottom-2` and stand ~32px tall; without this the grip lands on
   * their fullscreen button.
   */
  raised?: boolean
}>()

const emit = defineEmits<{
  (e: 'resize-start', event: PointerEvent): void
  (e: 'resize-keydown', event: KeyboardEvent): void
}>()
</script>

<template>
  <button
    type="button"
    class="absolute right-0 z-30 flex size-8 cursor-nwse-resize touch-none items-end justify-end bg-transparent p-1.5"
    :class="raised ? 'bottom-9' : 'bottom-0'"
    :aria-label="label"
    @pointerdown.prevent="emit('resize-start', $event)"
    @keydown="emit('resize-keydown', $event)"
  >
    <span
      class="pointer-events-none size-3 rounded-[3px] bg-black/65 ring-1 ring-white/50"
    />
  </button>
</template>
