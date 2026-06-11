<template>
  <svg
    class="fui-spinner inline-block shrink-0"
    width="16"
    height="16"
    role="status"
    aria-label="Loading"
    :class="[colorClass, { 'fui-spinner--track': track }]"
    :style="rootStyle"
  ></svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { SpinnerProps, SpinnerSize } from './types'

const props = withDefaults(defineProps<SpinnerProps>(), {
  track: false,
})

// px diameter, ring thickness and inner padding per size, matching the
// Figma sizes (the ring is inset from the box edge by `inset`, 7.5% of
// the diameter)
const sizeMap: Record<
  SpinnerSize,
  { px: number; thickness: number; inset: number }
> = {
  xs: { px: 12, thickness: 1.5, inset: 0.9 },
  sm: { px: 14, thickness: 2, inset: 1.05 },
  md: { px: 16, thickness: 2, inset: 1.2 },
  lg: { px: 20, thickness: 2, inset: 1.5 },
}

const colorClass = computed(() => {
  // No `theme` → inherit the current text color (customizable with a
  // text-* class on the spinner or a parent).
  if (props.theme == null) return null
  return { gray: 'text-ink-gray-8', red: 'text-ink-red-8' }[props.theme]
})

const rootStyle = computed(() => {
  // Fixed sizing applies only when `size` is a valid SpinnerSize. Otherwise
  // the spinner is sized by CSS — a width/height class or an inline style —
  // falling back to the 16px width/height attributes on the svg, which any
  // CSS wins over. Ring thickness and inset stay proportional via the
  // % defaults.
  const size = props.size != null ? sizeMap[props.size] : undefined
  if (!size) return undefined
  return {
    width: `${size.px}px`,
    height: `${size.px}px`,
    '--fui-spinner-thickness': `${size.thickness}px`,
    '--fui-spinner-mask-thickness': `${size.thickness}px`,
    '--fui-spinner-inset': `${size.inset}px`,
  }
})
</script>

<style scoped>
/* Registered so the angle interpolates in animation. The animation spins
   the GRADIENT angle, not the element: rotating the element rasterizes
   the circle once and any sub-device-pixel offset in that raster orbits
   visibly (wobble at 16px/18px on 2x displays). With a static element the
   circle is re-painted antialiased around a fixed center every frame —
   wobble is geometrically impossible. Baseline: Chrome 111+, Safari
   16.4+, Firefox 128+ (same as Tailwind v4). */
@property --fui-spinner-angle {
  syntax: '<angle>';
  inherits: false;
  initial-value: 0deg;
}

/* The root is an empty <svg> used purely as a paint surface: its
   width/height attributes provide the 16px default size at the lowest
   possible CSS priority (any class or inline style overrides them).

   Everything is drawn into a centered square (`--fui-spinner-paint-size`)
   slightly smaller than the box — per Figma the ring is inset from the
   edge (1.2px at 16px). */
.fui-spinner {
  /* Two rulers, one thickness: a percentage resolves against the paint
     radius in the mask gradient but against the paint box in the cap
     gradient, so the mask value is 2× the cap value. Anchored to the md
     spec: 16px box − 2×1.2px inset = 13.6px paint box; 2px ring =
     14.7% of 13.6px = 29.4% of the 6.8px radius. A valid `size` prop
     overrides all three with px values. */
  --fui-spinner-thickness: 14.7%;
  --fui-spinner-mask-thickness: 29.4%;
  --fui-spinner-inset: 7.5%;
  --fui-spinner-paint-size: calc(100% - 2 * var(--fui-spinner-inset));
  --fui-spinner-track-color: transparent;
  /* the spinning comet arc over an optional faint track —
     layer 1: a round dot capping the solid head (rounded end); it orbits
              the arc centerline radius (50% − t/2) at the animated angle
     layer 2: a conic gradient fading from transparent (gap + tail) to
              solid, rotated by the same animated angle
     layer 3: a full circle, transparent unless `track` is set */
  background-image:
    radial-gradient(
      calc(var(--fui-spinner-thickness) / 2)
        calc(var(--fui-spinner-thickness) / 2) at
        calc(
          50% + (50% - var(--fui-spinner-thickness) / 2) *
            sin(var(--fui-spinner-angle))
        )
        calc(
          50% - (50% - var(--fui-spinner-thickness) / 2) *
            cos(var(--fui-spinner-angle))
        ),
      currentColor 92%,
      transparent
    ),
    conic-gradient(
      from var(--fui-spinner-angle),
      transparent 32%,
      currentColor 92%,
      currentColor 100%
    ),
    linear-gradient(
      var(--fui-spinner-track-color),
      var(--fui-spinner-track-color)
    );
  background-size: var(--fui-spinner-paint-size) var(--fui-spinner-paint-size);
  background-position: center;
  background-repeat: no-repeat;
  /* clip everything painted above into a ring of the configured thickness.
     The outer transparent stop bounds the ring circle (the corners of the
     square mask image sit beyond `farthest-side` and would show otherwise);
     the half-pixel fade is for antialiasing. */
  -webkit-mask: radial-gradient(
      farthest-side,
      transparent calc(100% - var(--fui-spinner-mask-thickness)),
      #000 calc(100% - var(--fui-spinner-mask-thickness)),
      #000 calc(100% - 0.5px),
      transparent 100%
    )
    center / var(--fui-spinner-paint-size) var(--fui-spinner-paint-size)
    no-repeat;
  mask: radial-gradient(
      farthest-side,
      transparent calc(100% - var(--fui-spinner-mask-thickness)),
      #000 calc(100% - var(--fui-spinner-mask-thickness)),
      #000 calc(100% - 0.5px),
      transparent 100%
    )
    center / var(--fui-spinner-paint-size) var(--fui-spinner-paint-size)
    no-repeat;
  /* spins the gradient angle — the element itself never moves */
  animation: fui-spinner-rotate 0.7s linear infinite;
}

/* faint full-circle track behind the arc */
.fui-spinner--track {
  --fui-spinner-track-color: color-mix(in srgb, currentColor 15%, transparent);
}

@keyframes fui-spinner-rotate {
  to {
    --fui-spinner-angle: 360deg;
  }
}

@media (prefers-reduced-motion: reduce) {
  .fui-spinner {
    animation-duration: 1.6s;
  }
}
</style>
