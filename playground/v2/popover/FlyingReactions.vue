<script setup lang="ts">
// Meeting reactions: a click-through layer over its positioned parent. Each
// `launch(emoji)` pops a 32px emoji in at the bottom corner (`side`), floats
// it up about two-thirds of the way with a gentle sway, and fades it out.
// Every flight gets its own drift and rise so a burst of clicks fans out.
import { ref } from 'vue'

const props = withDefaults(defineProps<{ side?: 'left' | 'right' }>(), {
  side: 'left',
})

interface Flight {
  id: number
  emoji: string
  style: Record<string, string>
}

const MAX_IN_FLIGHT = 24
const DURATION = 3200

const layer = ref<HTMLElement | null>(null)
const flights = ref<Flight[]>([])
let nextId = 0

const rand = (min: number, max: number) => min + Math.random() * (max - min)

function launch(emoji: string) {
  const height = layer.value?.clientHeight ?? 600
  const sway = rand(14, 26) * (Math.random() < 0.5 ? -1 : 1)
  const flight: Flight = {
    id: nextId++,
    emoji,
    style: {
      // start anywhere in a 56px band beside the corner
      [props.side]: `${Math.round(rand(24, 80))}px`,
      '--rise': `${-Math.round(height * rand(0.55, 0.72))}px`,
      '--sway-a': `${Math.round(sway)}px`,
      '--sway-b': `${Math.round(-sway * rand(0.6, 1))}px`,
      '--sway-c': `${Math.round(sway * rand(0.3, 0.7))}px`,
      '--tilt': `${Math.round(rand(-12, 12))}deg`,
      animationDuration: `${Math.round(DURATION * rand(0.9, 1.1))}ms`,
    },
  }
  flights.value = [...flights.value, flight].slice(-MAX_IN_FLIGHT)
}

function land(id: number) {
  flights.value = flights.value.filter((f) => f.id !== id)
}

defineExpose({ launch })
</script>

<template>
  <div
    ref="layer"
    class="pointer-events-none absolute inset-0 z-20 overflow-hidden"
    aria-live="polite"
  >
    <span
      v-for="f in flights"
      :key="f.id"
      class="espresso-flight absolute bottom-4 text-[32px] leading-none"
      :style="f.style"
      role="img"
      :aria-label="`Reaction ${f.emoji}`"
      @animationend="land(f.id)"
    >
      {{ f.emoji }}
    </span>
  </div>
</template>

<style>
/* pop in at the corner, sway up, fade out near the top of the rise */
@keyframes espresso-flight {
  0% {
    opacity: 0;
    transform: translate(0, 0) scale(0.3) rotate(0deg);
  }
  8% {
    opacity: 1;
    transform: translate(0, calc(var(--rise) * 0.04)) scale(1.2)
      rotate(var(--tilt));
  }
  14% {
    transform: translate(0, calc(var(--rise) * 0.08)) scale(1)
      rotate(var(--tilt));
  }
  38% {
    transform: translate(var(--sway-a), calc(var(--rise) * 0.35)) scale(1)
      rotate(calc(var(--tilt) * -0.6));
  }
  66% {
    opacity: 1;
    transform: translate(var(--sway-b), calc(var(--rise) * 0.68)) scale(0.95)
      rotate(calc(var(--tilt) * 0.4));
  }
  100% {
    opacity: 0;
    transform: translate(var(--sway-c), var(--rise)) scale(0.85) rotate(0deg);
  }
}
.espresso-flight {
  animation-name: espresso-flight;
  animation-timing-function: cubic-bezier(0.22, 0.61, 0.36, 1);
  animation-fill-mode: forwards;
  will-change: transform, opacity;
}

/* reduced motion: a short straight rise and fade */
@media (prefers-reduced-motion: reduce) {
  @keyframes espresso-flight {
    0% {
      opacity: 0;
      transform: translateY(0);
    }
    20% {
      opacity: 1;
    }
    100% {
      opacity: 0;
      transform: translateY(-48px);
    }
  }
}
</style>
