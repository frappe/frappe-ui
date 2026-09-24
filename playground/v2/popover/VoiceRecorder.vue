<script setup lang="ts">
// Figma: espresso-2.0 › Popover › voice recorder (30873:37808) — default,
// recording and replay, as one working recorder. 280px, 12px radius, lg
// shadow:
//   wave    44px, px 12: 60 bars 1.4px wide ~4.3px apart, centred — idle
//           3px gray-300 ticks; recorded bars gray-700; while replaying a
//           red playhead holds the centre and the take slides past it, the
//           played part (left of the line) gray-300
//   footer  40px, py 8 · px 12, ruled above: 24px round buttons — record
//           (gray-2, red dot / ■ stop) and play (▶ / ❚❚) · 12 gray-800
//           timer, centred · delete and a ✓ that fills gray-900 once
//           there's something to keep
// No microphone: the levels are made up, so it only looks like it hears.
//
// The wave is drawn on a canvas every frame so it moves like a real meter:
// the row glides left at a steady pace (no per-bar steps), each new bar
// grows in from a tick at the right edge, and every bar eases toward its
// height, so starting, stopping and deleting all settle instead of snap.
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

type State = 'idle' | 'recording' | 'recorded' | 'playing'

const emit = defineEmits<{ save: [seconds: number]; discard: [] }>()

const BARS = 60
const MAX_H = 32
const TICK_H = 3
const BAR_W = 1.4
const BAR_EVERY = 0.085 // seconds per new bar while recording
const EASE = 0.09 // seconds for a bar to close ~63% of the way to its height
const MAX_SECONDS = 5 * 60

const state = ref<State>('idle')
const elapsed = ref(0) // recorded length, in seconds (whole, for the clock)
const position = ref(0) // replay position, in seconds
const saved = ref(false)

// ---- levels: a speech-like signal — a slow envelope that swells and
// dips in phrases, with syllable-sized wobble on top and brief pauses
let t = 0
let breath = 0 // seconds left in a pause between phrases
function nextLevel(dt: number) {
  t += dt
  if (breath > 0) {
    breath -= dt
    return 0.04 + Math.random() * 0.04
  }
  if (Math.random() < dt * 0.35) breath = 0.18 + Math.random() * 0.35
  const phrase = 0.5 + 0.35 * Math.sin(t * 1.3) * Math.sin(t * 0.47 + 1)
  const syllable = 0.5 + 0.5 * Math.sin(t * 11 + Math.sin(t * 3.1) * 2)
  const grain = 0.75 + Math.random() * 0.5
  return Math.min(1, Math.max(0.08, phrase * (0.3 + 0.7 * syllable) * grain))
}

// The whole take, one entry per bar. Slots with no bar (before the take
// starts, after it ends) draw as idle ticks.
interface Bar {
  target: number // the level it's heading for
  shown: number // the level it shows now, eased toward target
}
let take: Bar[] = []
let sinceBar = 0
let recordedSeconds = 0 // exact, for playback
let discarding = false

// The camera: which bar index sits under the centre line. Every view is
// just a camera position —
//   recording / at rest  the newest bar at the right edge
//   playing / paused     the playback position at the centre (the fixed
//                        red line); the take slides past it
// Outside recording it eases, so play glides back to the start and the
// end of playback glides back to the end view.
const HALF = (BARS - 1) / 2
let camera = -1 - HALF
const endView = () => take.length - 1 - HALF + sinceBar / BAR_EVERY
const playing = () => state.value === 'playing' || position.value > 0

// ---- one loop drives everything
let frame: number | undefined
let last = 0
function loop(now: number) {
  const dt = Math.min(0.05, (now - last) / 1000 || 0)
  last = now

  if (state.value === 'recording') {
    recordedSeconds += dt
    elapsed.value = Math.floor(recordedSeconds)
    sinceBar += dt
    while (sinceBar >= BAR_EVERY) {
      sinceBar -= BAR_EVERY
      take.push({ target: nextLevel(BAR_EVERY), shown: 0 })
    }
    camera = endView()
    if (recordedSeconds >= MAX_SECONDS) stopRecording()
  } else {
    if (state.value === 'playing') {
      position.value = Math.min(recordedSeconds, position.value + dt)
      if (position.value >= recordedSeconds) {
        state.value = 'recorded'
        position.value = 0
      }
    }
    const target = playing() ? position.value / BAR_EVERY : endView()
    // a quick glide when the view changes; steady tracking while playing
    const far = Math.abs(target - camera) > 2
    camera += (target - camera) * (1 - Math.exp(-dt / (far ? 0.16 : 0.03)))
  }

  const k = 1 - Math.exp(-dt / EASE)
  for (const b of take) b.shown += (b.target - b.shown) * k
  if (discarding && take.every((b) => b.shown < 0.02)) {
    take = []
    sinceBar = 0
    camera = -1 - HALF
    discarding = false
  }

  draw()
  frame = requestAnimationFrame(loop)
}

// ---- drawing
const canvas = ref<HTMLCanvasElement | null>(null)
const inkBar = ref<HTMLElement | null>(null)
const inkTick = ref<HTMLElement | null>(null)
const inkHead = ref<HTMLElement | null>(null)

function draw() {
  const el = canvas.value
  if (!el) return
  const dpr = window.devicePixelRatio || 1
  const w = el.clientWidth
  const h = el.clientHeight
  if (el.width !== Math.round(w * dpr) || el.height !== Math.round(h * dpr)) {
    el.width = Math.round(w * dpr)
    el.height = Math.round(h * dpr)
  }
  const ctx = el.getContext('2d')
  if (!ctx) return
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.clearRect(0, 0, w, h)

  const barColour = getComputedStyle(inkBar.value!).color
  const tickColour = getComputedStyle(inkTick.value!).color
  const step = (w - BAR_W) / (BARS - 1)
  const centre = w / 2
  const mid = h / 2
  const headOn = playing()
  ctx.lineCap = 'round'
  ctx.lineWidth = BAR_W

  // every slot on screen, anchored to the camera
  const first = Math.floor(camera - HALF) - 1
  const lastSlot = Math.ceil(camera + HALF) + 1
  for (let i = first; i <= lastSlot; i++) {
    const x = centre + (i - camera) * step
    if (x < -BAR_W || x > w + BAR_W) continue
    const b = take[i]
    const level = b ? b.shown : 0
    const height = Math.max(TICK_H, level * MAX_H)
    const isTick = !b || (b.target === 0 && b.shown < 0.05)
    // with the head showing, what's left of the line has played
    const played = headOn && x < centre
    ctx.strokeStyle = isTick || played ? tickColour : barColour
    // soften both edges so bars slide in and out rather than clip
    const edge = Math.min(x, w - x)
    ctx.globalAlpha = edge < step ? Math.max(0, edge / step) : 1
    ctx.beginPath()
    ctx.moveTo(x, mid - height / 2 + BAR_W / 2)
    ctx.lineTo(x, mid + height / 2 - BAR_W / 2)
    ctx.stroke()
  }
  ctx.globalAlpha = 1

  // the playhead: fixed at the centre
  if (headOn) {
    ctx.strokeStyle = getComputedStyle(inkHead.value!).color
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(centre, 6)
    ctx.lineTo(centre, h - 6)
    ctx.stroke()
  }
}

onMounted(() => {
  last = performance.now()
  frame = requestAnimationFrame(loop)
})
onBeforeUnmount(() => {
  if (frame) cancelAnimationFrame(frame)
})

// ---- controls
function startRecording() {
  saved.value = false
  position.value = 0
  discarding = false
  if (recordedSeconds === 0) take = []
  sinceBar = 0
  state.value = 'recording'
}

function stopRecording() {
  // a very short take still counts as one second
  if (recordedSeconds < 1) recordedSeconds = 1
  elapsed.value = Math.floor(recordedSeconds)
  state.value = 'recorded'
}

function play() {
  if (position.value >= recordedSeconds) position.value = 0
  state.value = 'playing'
}

function pause() {
  state.value = 'recorded'
}

function stopPlayback() {
  state.value = 'recorded'
  position.value = 0
}

function discard() {
  state.value = 'idle'
  // bars ease back down to ticks rather than vanish
  for (const b of take) b.target = 0
  discarding = true
  recordedSeconds = 0
  elapsed.value = 0
  position.value = 0
  saved.value = false
  emit('discard')
}

function save() {
  if (!canKeep.value) return
  if (state.value === 'recording') stopRecording()
  if (state.value === 'playing') stopPlayback()
  saved.value = true
  emit('save', elapsed.value)
}

const hasTake = computed(() => elapsed.value > 0 || state.value === 'recording')
const canKeep = computed(() => elapsed.value > 0)

const clock = computed(() => {
  // while playing or paused mid-take, the clock shows the playback position
  const s = Math.floor(state.value === 'playing' || position.value > 0 ? position.value : elapsed.value)
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
})

function onRecordButton() {
  if (state.value === 'recording') stopRecording()
  else if (state.value === 'playing' || position.value > 0) stopPlayback()
  else startRecording()
}
</script>

<template>
  <div
    class="w-[280px] overflow-hidden rounded-6 bg-surface-elevation-2 shadow-lg"
    role="group"
    aria-label="Voice recorder"
  >
    <!-- waveform: drawn on the canvas; the probes lend it theme colours -->
    <div class="relative h-11 px-3" aria-hidden="true">
      <canvas ref="canvas" class="block h-full w-full" />
      <span ref="inkBar" class="hidden text-ink-gray-7" />
      <span ref="inkTick" class="hidden text-ink-gray-3" />
      <span ref="inkHead" class="hidden text-ink-red-5" />
    </div>

    <!-- controls -->
    <div
      class="flex h-10 items-center justify-between border-t border-outline-gray-1 px-3 py-2 dark:border-outline-gray-2"
    >
      <div class="flex w-14 items-center gap-2">
        <button
          type="button"
          class="flex size-6 items-center justify-center rounded-full bg-surface-gray-2 transition-colors hover:bg-surface-gray-3 dark:bg-surface-gray-3"
          :aria-label="
            state === 'recording'
              ? 'Stop recording'
              : state === 'playing' || position > 0
                ? 'Stop'
                : 'Record'
          "
          @click="onRecordButton"
        >
          <span
            v-if="state === 'recording' || state === 'playing' || position > 0"
            class="size-2.5 rounded-[2px] bg-current text-ink-gray-7"
          />
          <span
            v-else
            class="size-2.5 rounded-full bg-current text-ink-red-5"
          />
        </button>
        <button
          type="button"
          class="flex size-6 items-center justify-center rounded-full text-ink-gray-8 transition-colors hover:bg-surface-gray-2 disabled:text-ink-gray-4 disabled:hover:bg-transparent"
          :disabled="!canKeep || state === 'recording'"
          :aria-label="state === 'playing' ? 'Pause' : 'Play'"
          @click="state === 'playing' ? pause() : play()"
        >
          <!-- solid glyphs, as drawn (lucide's are outlines) -->
          <svg v-if="state === 'playing'" viewBox="0 0 14 14" class="size-3.5" aria-hidden="true">
            <rect x="3" y="2.5" width="2.6" height="9" rx="0.8" fill="currentColor" />
            <rect x="8.4" y="2.5" width="2.6" height="9" rx="0.8" fill="currentColor" />
          </svg>
          <svg v-else viewBox="0 0 14 14" class="size-3.5" aria-hidden="true">
            <path d="M4 2.6c0-.6.66-.97 1.17-.65l6.6 4.4c.46.3.46.98 0 1.3l-6.6 4.4A.77.77 0 0 1 4 11.4V2.6Z" fill="currentColor" />
          </svg>
        </button>
      </div>

      <span
        class="flex items-center gap-1.5 text-xs tabular-nums text-ink-gray-8"
        role="timer"
        :aria-label="`${clock}${state === 'recording' ? ', recording' : ''}`"
      >
        <span
          v-if="state === 'recording'"
          class="size-1.5 animate-pulse rounded-full bg-current text-ink-red-5"
        />
        {{ clock }}
      </span>

      <div class="flex w-14 items-center justify-end gap-2">
        <button
          type="button"
          class="flex size-6 items-center justify-center rounded-full text-ink-gray-7 transition-colors hover:bg-surface-gray-2 disabled:text-ink-gray-4 disabled:hover:bg-transparent"
          :disabled="!hasTake"
          aria-label="Delete recording"
          @click="discard"
        >
          <span class="lucide-trash-2 size-3.5" />
        </button>
        <button
          type="button"
          class="flex size-6 items-center justify-center rounded-full transition-colors"
          :class="
            canKeep
              ? saved
                ? 'bg-surface-green-3 text-ink-green-7'
                : 'bg-surface-gray-10 text-ink-base hover:bg-surface-gray-9'
              : 'bg-surface-gray-2 text-ink-gray-4 dark:bg-surface-gray-3'
          "
          :disabled="!canKeep"
          :aria-label="saved ? 'Saved' : 'Save recording'"
          @click="save"
        >
          <span class="lucide-check size-3.5" />
        </button>
      </div>
    </div>
  </div>
</template>
