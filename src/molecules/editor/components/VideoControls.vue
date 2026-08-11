<script setup lang="ts">
/**
 * Custom video controls for the media node view, replacing the native
 * `controls` attribute so the player matches the design system. Play/pause,
 * scrubbable progress, time, mute, and fullscreen.
 *
 * The row sits on a gradient that fades into the footage rather than in a
 * floating dark pill: a pill draws a hard edge across the picture and has to
 * pick a background dark enough for white icons on ANY frame, which means it
 * is heavier than it needs to be over most of them. The gradient carries the
 * contrast where the controls are and disappears into the image above.
 *
 * Colors here are the fixed white scale, not `ink-*` tokens: the row always
 * sits over footage, so it wants the same color in both themes. The tokens
 * flip with the theme — `text-ink-gray-2` reads as a light gray in light mode
 * and a dark one in dark mode, which dimmed these controls into the video.
 * Full-strength white plus a drop shadow keeps them readable over a bright
 * frame, where a translucent white washes out.
 *
 * Play/pause and volume are inline SVG rather than the lucide mask utilities:
 * the design calls for SOLID glyphs and lucide ships stroke-only outlines,
 * which a mask cannot fill. The expand arrows are an outline, so they stay a
 * lucide icon.
 *
 * The playhead runs off a frame loop rather than `timeupdate`, which only fires
 * about four times a second and walks the thumb across the track in steps.
 *
 * The host passes the live `<video>` element; this component only attaches
 * listeners and drives it imperatively — it never owns playback state.
 */
import { ref, watch, computed, onBeforeUnmount } from 'vue'
import Tooltip from '#components/Tooltip/Tooltip.vue'

const props = defineProps<{
  videoEl: HTMLVideoElement | null
  /** Hidden entirely while true (e.g. during a resize drag). */
  hidden?: boolean
  /**
   * The media is the fullscreen element: the row spans the screen instead of a
   * media box, so it drops the rounded corner and takes more breathing room.
   */
  fullscreen?: boolean
}>()

const playing = ref(false)
const muted = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const scrubbing = ref(false)
const trackRef = ref<HTMLElement | null>(null)

const progress = computed(() =>
  duration.value ? (currentTime.value / duration.value) * 100 : 0,
)

/** Knob diameter in px; the thumb is inset by half of it at either end. */
const KNOB = 14

/**
 * Travel for the thumb, kept a knob's width inside the track so it never hangs
 * off the ends: a plain `left: <progress>%` centers it on the track's edge at
 * 0% and 100%, half of it outside the bar.
 */
const knobLeft = computed(
  () => `calc(${KNOB / 2}px + (100% - ${KNOB}px) * ${progress.value / 100})`,
)

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, '0')
  return `${m}:${s}`
}

let bound: Array<[string, EventListener]> = []

function bind(el: HTMLVideoElement) {
  playing.value = !el.paused
  muted.value = el.muted
  duration.value = el.duration || 0
  currentTime.value = el.currentTime || 0
  const on = (event: string, handler: EventListener) => {
    el.addEventListener(event, handler)
    bound.push([event, handler])
  }
  on('play', () => (playing.value = true))
  on('pause', () => (playing.value = false))
  on('ended', () => (playing.value = false))
  // The playhead is driven per frame while playing (see `follow`); `timeupdate`
  // covers the paused states — a seek from the keyboard, a loop restarting, a
  // reload restoring a position.
  on('timeupdate', () => {
    if (!playing.value) currentTime.value = el.currentTime
  })
  on('loadedmetadata', () => (duration.value = el.duration || 0))
  on('durationchange', () => (duration.value = el.duration || 0))
  on('volumechange', () => (muted.value = el.muted))
}

function unbind(el: HTMLVideoElement) {
  for (const [event, handler] of bound.splice(0)) {
    el.removeEventListener(event, handler)
  }
}

watch(
  () => props.videoEl,
  (el, prev) => {
    if (prev) unbind(prev)
    if (el) bind(el)
  },
  { immediate: true },
)

/**
 * `timeupdate` fires about four times a second, which walks the playhead
 * across the track in visible steps. While the video plays we read
 * `currentTime` once a frame instead, so the fill and the thumb move with the
 * footage. The loop is only alive during playback, and the browser already
 * parks `requestAnimationFrame` in a background tab.
 */
let frame = 0

function follow() {
  frame = requestAnimationFrame(follow)
  const el = props.videoEl
  if (el && !scrubbing.value) currentTime.value = el.currentTime
}

// Immediate, because a video that autoplays is already playing by the time
// this watcher is set up, and nothing would start the loop for it.
watch(
  playing,
  (isPlaying) => {
    cancelAnimationFrame(frame)
    frame = isPlaying ? requestAnimationFrame(follow) : 0
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  cancelAnimationFrame(frame)
  clearTimeout(glideTimer)
  if (props.videoEl) unbind(props.videoEl)
})

function togglePlay() {
  const el = props.videoEl
  if (!el) return
  if (el.paused) void el.play()
  else el.pause()
}

function toggleMute() {
  const el = props.videoEl
  if (el) el.muted = !el.muted
}

function toggleFullscreen() {
  const el = props.videoEl
  if (!el) return
  if (document.fullscreenElement) {
    void document.exitFullscreen()
    return
  }
  // Fullscreen the wrapper so these controls stay visible over the video.
  const root = el.closest('[data-video-fullscreen-root]') ?? el
  void (root as HTMLElement).requestFullscreen?.()
}

function timeFromPointer(event: PointerEvent): number {
  const track = trackRef.value
  if (!track) return 0
  const rect = track.getBoundingClientRect()
  const ratio = Math.min(
    1,
    Math.max(0, (event.clientX - rect.left) / rect.width),
  )
  return ratio * duration.value
}

/**
 * A tap somewhere else on the track is a jump, so the thumb glides there
 * instead of teleporting. Only while paused: during playback the thumb is
 * already being driven every frame, and a transition would leave it trailing
 * the real position for the length of the glide and then snap.
 */
const gliding = ref(false)
let glideTimer: ReturnType<typeof setTimeout> | undefined

/** Matches the `duration-200` on the fill and the thumb. */
const GLIDE_MS = 200

function glide() {
  if (playing.value) return
  gliding.value = true
  clearTimeout(glideTimer)
  glideTimer = setTimeout(() => (gliding.value = false), GLIDE_MS)
}

/** A drag has to track the pointer, so the first move ends the glide. */
function endGlide() {
  if (!gliding.value) return
  clearTimeout(glideTimer)
  gliding.value = false
}

/**
 * `pointerdown` is prevented (in the template) because the node view wrapper is
 * `draggable` — ProseMirror makes it so — and the browser answers a press-and-
 * move inside it by starting a native drag, which fires `pointercancel` and
 * dropped the scrub on the first pixel of movement.
 */
function onTrackPointerDown(event: PointerEvent) {
  if (!props.videoEl || !duration.value) return
  glide()
  scrubbing.value = true
  try {
    trackRef.value?.setPointerCapture(event.pointerId)
  } catch {
    // Inactive pointer id (synthetic events, some pen edge cases) — scrubbing
    // still works through the track's own move/up handlers.
  }
  seekTo(timeFromPointer(event))
}

function onTrackPointerMove(event: PointerEvent) {
  if (!scrubbing.value || !props.videoEl) return
  endGlide()
  seekTo(timeFromPointer(event))
}

/**
 * The thumb follows the pointer directly rather than waiting for the video to
 * report back: neither `timeupdate` (paused only) nor the frame loop (skipped
 * while scrubbing) speaks during a drag, and a seek on a long video can take
 * long enough to make the thumb feel stuck to the footage.
 */
function seekTo(time: number) {
  if (!props.videoEl) return
  currentTime.value = time
  props.videoEl.currentTime = time
}

function onTrackPointerUp() {
  scrubbing.value = false
}

/**
 * The scrim under the row. A two-stop `black/70 → transparent` ramp reads as a
 * hard wash: alpha falls off linearly while the eye tracks it roughly as a
 * square, so the top of the band stays visible as an edge and the bottom sits
 * heavier than it needs to. These stops trace an ease-out curve to a lower
 * peak instead, so the scrim only ever gets dark right under the controls and
 * has faded to nothing well before its top edge. The icons carry their own
 * drop shadow, which is what keeps them legible over a bright frame.
 */
const SCRIM =
  'linear-gradient(to top, rgb(0 0 0 / 0.55) 0%, rgb(0 0 0 / 0.40) 20%, rgb(0 0 0 / 0.22) 45%, rgb(0 0 0 / 0.09) 70%, rgb(0 0 0 / 0) 100%)'
</script>

<template>
  <div
    v-if="videoEl && !hidden"
    class="absolute inset-x-0 bottom-0 z-20 flex items-center gap-3 text-white transition-opacity [filter:drop-shadow(0_1px_2px_rgb(0_0_0/0.45))]"
    :style="{ backgroundImage: SCRIM }"
    :class="[
      fullscreen ? 'px-6 pt-16 pb-6' : 'rounded-b-4 px-3.5 pt-12 pb-3',
      playing && !scrubbing
        ? 'opacity-0 group-hover:opacity-100 focus-within:opacity-100'
        : 'opacity-100',
    ]"
    @click.stop
    @pointerdown.stop
    @dragstart.stop.prevent
  >
    <Tooltip :text="playing ? 'Pause' : 'Play'" class="flex h-5">
      <button
        type="button"
        class="opacity-90 transition-opacity hover:opacity-100"
        :aria-label="playing ? 'Pause' : 'Play'"
        @click="togglePlay"
      >
        <svg
          class="size-5"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <template v-if="playing">
            <rect x="6" y="4" width="4.5" height="16" rx="1.25" />
            <rect x="13.5" y="4" width="4.5" height="16" rx="1.25" />
          </template>
          <path
            v-else
            d="M7.5 4.87v14.26a1.2 1.2 0 0 0 1.83 1.02l11.2-7.13a1.2 1.2 0 0 0 0-2.04L9.33 3.85A1.2 1.2 0 0 0 7.5 4.87Z"
          />
        </svg>
      </button>
    </Tooltip>

    <div
      ref="trackRef"
      class="group/track relative flex h-5 flex-1 cursor-pointer touch-none items-center"
      role="slider"
      aria-label="Seek"
      :aria-valuemin="0"
      :aria-valuemax="Math.round(duration)"
      :aria-valuenow="Math.round(currentTime)"
      @pointerdown.prevent="onTrackPointerDown"
      @pointermove="onTrackPointerMove"
      @pointerup="onTrackPointerUp"
      @pointercancel="onTrackPointerUp"
    >
      <div class="h-[3px] w-full overflow-hidden rounded-full bg-white/30">
        <div
          class="h-full rounded-full bg-white"
          :class="gliding && 'transition-[width] duration-200 ease-out'"
          :style="{ width: `${progress}%` }"
        />
      </div>
      <span
        class="pointer-events-none absolute size-3.5 -translate-x-1/2 rounded-full bg-white"
        :class="[
          scrubbing ? 'scale-125' : 'group-hover/track:scale-110',
          gliding
            ? 'transition-[left,transform] duration-200 ease-out'
            : 'transition-transform',
        ]"
        :style="{ left: knobLeft }"
      />
    </div>

    <span class="text-sm font-medium tabular-nums select-none">
      {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
    </span>

    <Tooltip :text="muted ? 'Unmute' : 'Mute'" class="flex h-5">
      <button
        type="button"
        class="opacity-90 transition-opacity hover:opacity-100"
        :aria-label="muted ? 'Unmute' : 'Mute'"
        @click="toggleMute"
      >
        <svg class="size-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            fill="currentColor"
            d="M11.4 3.86a1 1 0 0 1 .6.92v14.44a1 1 0 0 1-1.66.75L6.02 16H3.6A1.6 1.6 0 0 1 2 14.4V9.6A1.6 1.6 0 0 1 3.6 8h2.42l4.32-4.02a1 1 0 0 1 1.06-.12Z"
          />
          <path
            v-if="muted"
            stroke="currentColor"
            stroke-width="1.75"
            stroke-linecap="round"
            d="m16 9.5 5 5m0-5-5 5"
          />
          <path
            v-else
            stroke="currentColor"
            stroke-width="1.75"
            stroke-linecap="round"
            d="M15.8 9.2a4 4 0 0 1 0 5.6M18.8 6.2a8 8 0 0 1 0 11.6"
          />
        </svg>
      </button>
    </Tooltip>

    <Tooltip text="Fullscreen" class="flex h-5">
      <button
        type="button"
        class="opacity-90 transition-opacity hover:opacity-100"
        aria-label="Fullscreen"
        @click="toggleFullscreen"
      >
        <span class="lucide-maximize-2 size-5" />
      </button>
    </Tooltip>
  </div>
</template>
