<template>
  <div
    class="fui-spinner"
    role="status"
    aria-label="Loading"
    :class="[colorClass, { 'fui-spinner--track': track }]"
    :style="rootStyle"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { SpinnerProps, SpinnerSize } from './types'

const props = withDefaults(defineProps<SpinnerProps>(), {
  size: 'md',
  theme: 'gray',
  track: false,
})

// px diameter + ring thickness per size, matching the Figma sizes
const sizeMap: Record<SpinnerSize, { px: number; thickness: number }> = {
  xs: { px: 12, thickness: 1.5 },
  sm: { px: 14, thickness: 2 },
  md: { px: 16, thickness: 2 },
  lg: { px: 20, thickness: 2 },
}

const colorClass = computed(() => {
  if (props.theme == null) return null
  return { gray: 'text-ink-gray-8', red: 'text-ink-red-4' }[props.theme]
})

const rootStyle = computed(() => {
  // size === null → sized by an external width/height class; thickness falls
  // back to the CSS percentage default so the ring stays proportional.
  if (props.size == null) return undefined
  const { px, thickness } = sizeMap[props.size]
  return {
    width: `${px}px`,
    height: `${px}px`,
    '--fui-spinner-thickness': `${thickness}px`,
  }
})
</script>

<style scoped>
.fui-spinner {
  --fui-spinner-thickness: 15%;
  position: relative;
  display: inline-block;
  flex-shrink: 0;
  border-radius: 50%;
  /* clip everything painted below into a ring of `--fui-spinner-thickness` */
  -webkit-mask: radial-gradient(
    farthest-side,
    transparent calc(100% - var(--fui-spinner-thickness)),
    #000 calc(100% - var(--fui-spinner-thickness))
  );
  mask: radial-gradient(
    farthest-side,
    transparent calc(100% - var(--fui-spinner-thickness)),
    #000 calc(100% - var(--fui-spinner-thickness))
  );
}

.fui-spinner::before,
.fui-spinner::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 50%;
}

/* faint full-circle track behind the arc */
.fui-spinner--track::before {
  background: currentColor;
  opacity: 0.15;
}

/* the spinning comet arc — a rounded solid head fading down a long tail.
   layer 1: a round dot at the top that caps the solid head (rounded end)
   layer 2: a conic gradient that fades from transparent (gap + tail) to solid */
.fui-spinner::after {
  background:
    radial-gradient(farthest-side, currentColor 92%, transparent) top / var(
        --fui-spinner-thickness
      ) var(--fui-spinner-thickness) no-repeat,
    conic-gradient(
      from 0deg,
      transparent 32%,
      currentColor 92%,
      currentColor 100%
    );
  animation: fui-spinner-rotate 0.7s linear infinite;
}

@keyframes fui-spinner-rotate {
  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .fui-spinner::after {
    animation-duration: 1.6s;
  }
}
</style>
