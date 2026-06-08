<script setup lang="ts">
/**
 * Custom video controls for the media node view, replacing the native
 * `controls` attribute so the player matches the design system (same dark
 * pill language as MediaToolbar). Play/pause, scrubbable progress, time,
 * mute, and fullscreen.
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
  on('timeupdate', () => (currentTime.value = el.currentTime))
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

onBeforeUnmount(() => {
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

function onTrackPointerDown(event: PointerEvent) {
  if (!props.videoEl || !duration.value) return
  scrubbing.value = true
  try {
    trackRef.value?.setPointerCapture(event.pointerId)
  } catch {
    // Inactive pointer id (synthetic events, some pen edge cases) — scrubbing
    // still works through the track's own move/up handlers.
  }
  props.videoEl.currentTime = timeFromPointer(event)
}

function onTrackPointerMove(event: PointerEvent) {
  if (!scrubbing.value || !props.videoEl) return
  props.videoEl.currentTime = timeFromPointer(event)
}

function onTrackPointerUp() {
  scrubbing.value = false
}
</script>

<template>
  <div
    v-if="videoEl && !hidden"
    class="absolute inset-x-2 bottom-2 flex items-center gap-2 rounded bg-black/65 px-2 py-1.5 transition-opacity"
    :class="
      playing && !scrubbing
        ? 'opacity-0 group-hover:opacity-100 focus-within:opacity-100'
        : 'opacity-100'
    "
    @click.stop
    @pointerdown.stop
  >
    <Tooltip :text="playing ? 'Pause' : 'Play'" class="h-5">
      <button
        type="button"
        class="text-ink-gray-2 hover:text-ink-white"
        :aria-label="playing ? 'Pause' : 'Play'"
        @click="togglePlay"
      >
        <span :class="[playing ? 'lucide-pause' : 'lucide-play', 'size-4']" />
      </button>
    </Tooltip>

    <span class="text-xs tabular-nums text-ink-gray-2 select-none">
      {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
    </span>

    <div
      ref="trackRef"
      class="relative flex h-4 flex-1 cursor-pointer touch-none items-center"
      role="slider"
      aria-label="Seek"
      :aria-valuemin="0"
      :aria-valuemax="Math.round(duration)"
      :aria-valuenow="Math.round(currentTime)"
      @pointerdown="onTrackPointerDown"
      @pointermove="onTrackPointerMove"
      @pointerup="onTrackPointerUp"
      @pointercancel="onTrackPointerUp"
    >
      <div class="h-1 w-full overflow-hidden rounded-full bg-white/25">
        <div
          class="h-full rounded-full bg-white"
          :style="{ width: `${progress}%` }"
        />
      </div>
    </div>

    <Tooltip :text="muted ? 'Unmute' : 'Mute'" class="h-5">
      <button
        type="button"
        class="text-ink-gray-2 hover:text-ink-white"
        :aria-label="muted ? 'Unmute' : 'Mute'"
        @click="toggleMute"
      >
        <span
          :class="[muted ? 'lucide-volume-x' : 'lucide-volume-2', 'size-4']"
        />
      </button>
    </Tooltip>

    <Tooltip text="Fullscreen" class="h-5">
      <button
        type="button"
        class="text-ink-gray-2 hover:text-ink-white"
        aria-label="Fullscreen"
        @click="toggleFullscreen"
      >
        <span class="lucide-maximize size-4" />
      </button>
    </Tooltip>
  </div>
</template>
