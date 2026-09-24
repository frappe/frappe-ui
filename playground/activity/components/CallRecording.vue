<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { Button, Slider } from '../../../src'

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
      :icon="playing ? 'lucide-pause' : 'lucide-play'"
      :aria-label="playing ? 'Pause' : 'Play'"
      @click="playing = !playing"
    />

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
      :icon="muted ? 'lucide-volume-x' : 'lucide-volume-2'"
      :aria-label="muted ? 'Unmute' : 'Mute'"
      @click="muted = !muted"
    />
    <!-- Pulled out by the difference between the card's sides and its top. -->
    <Button
      variant="ghost"
      size="sm"
      icon="lucide-more-horizontal"
      class="-mr-0.5"
    />
  </div>
</template>
