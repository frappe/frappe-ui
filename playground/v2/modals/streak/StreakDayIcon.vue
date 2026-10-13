<script setup lang="ts">
// Espresso day-status glyphs, drawn from the Figma icon paths (exported at
// 2x, so the viewBoxes are 52 and 48). Solid glyphs knock the check / x out
// of the disc, so the surface behind shows through, as in Figma.
//   achieved  icon/solid/success       cyan-500
//   missed    icon/solid/close-circle  gray-400 in the grid, gray-600 in pills
//   holiday   icon/line/nodata + slash gray-400
//   empty     icon/line/nodata ring    gray-400, or a gray-300 disc (`filled`)
export type DayStatus = 'achieved' | 'missed' | 'holiday' | 'empty'

withDefaults(
  defineProps<{
    status: DayStatus
    /** 26px for the week pills, 24px elsewhere. */
    size?: 24 | 26
    /** Missed in gray-600 (week pills) instead of gray-400 (grid). */
    strong?: boolean
    /** Empty day as a solid gray-300 disc instead of a ring. */
    filled?: boolean
  }>(),
  { size: 24, strong: false, filled: false },
)

const DISC =
  'M26 48.75C38.5645 48.75 48.75 38.5645 48.75 26C48.75 13.4355 38.5645 3.25 26 3.25C13.4355 3.25 3.25 13.4355 3.25 26C3.25 38.5645 13.4355 48.75 26 48.75Z'
const CHECK =
  'M36.3115 19.4507C36.8825 18.7582 36.7839 17.7341 36.0915 17.1632C35.399 16.5923 34.3748 16.6908 33.8039 17.3833L22.5936 30.9803L18.2335 25.3454C17.6843 24.6356 16.6637 24.5054 15.9539 25.0546C15.2441 25.6039 15.1139 26.6245 15.6631 27.3343L21.2681 34.5781C21.5705 34.9688 22.0341 35.2008 22.5282 35.2084C23.0222 35.2161 23.4928 34.9986 23.8071 34.6174L36.3115 19.4507Z'
const CROSS =
  'M16.726 16.726C16.0913 17.3606 16.0913 18.3894 16.726 19.024L23.7019 26L16.726 32.976C16.0914 33.6106 16.0914 34.6394 16.726 35.274C17.3606 35.9087 18.3894 35.9087 19.024 35.274L26 28.2981L32.976 35.274C33.6106 35.9087 34.6394 35.9087 35.274 35.274C35.9087 34.6394 35.9087 33.6106 35.274 32.976L28.2981 26L35.274 19.024C35.9087 18.3894 35.9087 17.3606 35.274 16.726C34.6394 16.0913 33.6106 16.0913 32.976 16.726L26 23.7019L19.024 16.726C18.3894 16.0913 17.3606 16.0913 16.726 16.726Z'
const RING =
  'M24 2.25C36.0122 2.25 45.75 11.9878 45.75 24C45.75 36.0122 36.0122 45.75 24 45.75C11.9878 45.75 2.25 36.0122 2.25 24C2.25 11.9878 11.9878 2.25 24 2.25ZM24 5.25C13.6447 5.25 5.25 13.6447 5.25 24C5.25 34.3553 13.6447 42.75 24 42.75C34.3553 42.75 42.75 34.3553 42.75 24C42.75 13.6447 34.3553 5.25 24 5.25Z'
</script>

<template>
  <!-- solid: success / close-circle, or the filled empty disc -->
  <svg
    v-if="status === 'achieved' || status === 'missed' || filled"
    viewBox="0 0 52 52"
    fill="currentColor"
    aria-hidden="true"
    class="shrink-0"
    :class="[
      size === 26 ? 'size-[26px]' : 'size-6',
      {
        'text-ink-cyan-5': status === 'achieved',
        'text-ink-gray-5': status === 'missed' && strong,
        'text-ink-gray-3': status === 'missed' && !strong,
        'text-ink-gray-2': status === 'empty' || status === 'holiday',
      },
    ]"
  >
    <path
      v-if="status === 'achieved' || status === 'missed'"
      fill-rule="evenodd"
      clip-rule="evenodd"
      :d="`${DISC}${status === 'achieved' ? CHECK : CROSS}`"
    />
    <path v-else :d="DISC" />
  </svg>

  <!-- line: nodata ring, slashed for a holiday -->
  <svg
    v-else
    viewBox="0 0 48 48"
    fill="currentColor"
    aria-hidden="true"
    class="shrink-0 text-ink-gray-3"
    :class="size === 26 ? 'size-[26px]' : 'size-6'"
  >
    <path :d="RING" />
    <path
      v-if="status === 'holiday'"
      d="M11.5 36.5L36.5 11.5"
      stroke="currentColor"
      stroke-width="3"
      stroke-linecap="round"
    />
  </svg>
</template>
