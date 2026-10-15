<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { Button, Slider } from '../../../src'
import ActivityIcon from './ActivityIcon.vue'

const props = withDefaults(
  defineProps<{
    /** Length of the recording, in seconds. 32:48 in the design. */
    duration?: number
    /** Where the head starts. */
    start?: number
  }>(),
  { duration: 1968, start: 15 },
)

const elapsed = ref(props.start)
const playing = ref(false)
const muted = ref(false)

// There is no audio behind this — the clock is the playback. It runs at 30x so
// the bar visibly moves; at real speed a 33-minute recording crawls a pixel
// every few seconds and the control looks broken.
const RATE = 30
const TICK = 100

let timer: ReturnType<typeof setInterval> | undefined
function stopTimer() {
  if (timer) clearInterval(timer)
  timer = undefined
}

watch(playing, (isPlaying) => {
  stopTimer()
  if (!isPlaying) return
  timer = setInterval(() => {
    elapsed.value = Math.min(
      props.duration,
      elapsed.value + (TICK / 1000) * RATE,
    )
    if (elapsed.value >= props.duration) playing.value = false
  }, TICK)
})

onBeforeUnmount(stopTimer)

// The slider is the head: it follows playback, and dragging it seeks.
const position = computed({
  get: () => [(elapsed.value / props.duration) * 100],
  set: ([percent]) => {
    elapsed.value = (percent / 100) * props.duration
  },
})

const clock = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`
</script>

<template>
  <div class="flex items-center gap-2">
    <Button
      variant="ghost"
      size="sm"
      :aria-label="playing ? 'Pause' : 'Play'"
      @click="playing = !playing"
    >
      <template #icon>
        <ActivityIcon :name="playing ? 'pause' : 'play-16'" class="size-4" />
      </template>
    </Button>

    <Slider
      v-model="position"
      class="flex-1"
      :step="0.1"
      aria-label="Playback position"
    />

    <span class="shrink-0 text-sm text-ink-gray-6 tabular-nums">
      {{ clock(elapsed) }} / {{ clock(duration) }}
    </span>

    <Button
      variant="ghost"
      size="sm"
      :icon="muted ? 'lucide-volume-x' : undefined"
      :aria-label="muted ? 'Unmute' : 'Mute'"
      @click="muted = !muted"
    >
      <!-- The file draws no muted glyph; lucide's crossed speaker stands in -->
      <template v-if="!muted" #icon>
        <ActivityIcon name="volume" class="size-4" />
      </template>
    </Button>
    <!-- Pulled out by the difference between the card's sides and its top. -->
    <Button variant="ghost" size="sm" aria-label="More" class="-mr-0.5">
      <template #icon>
        <ActivityIcon name="dots" class="size-4" />
      </template>
    </Button>
  </div>
</template>
