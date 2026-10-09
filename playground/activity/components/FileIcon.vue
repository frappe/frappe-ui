<script setup lang="ts">
import { computed } from 'vue'

defineProps<{
  /** Which mark to draw. */
  type: 'zip' | 'pdf' | 'doc'
}>()

/**
 * The file marks, traced out of the Espresso file (node 35100:116642) rather
 * than approximated with a lucide glyph: 16px icons drawn on a 32 grid.
 *
 * Their colours are the design's own, written as tokens rather than hexes —
 * each one matches its Figma value exactly in the light theme (#E2E2E2
 * outline-gray-2, #7C7C7C ink-gray-5, #E03434 ink-red-5, #0C8EF8 ink-blue-5)
 * and steps down with the theme instead of glaring out of a dark page.
 */
let instances = 0
const shadowId = computed(() => `file-icon-zip-shadow-${++instances}`)
</script>

<template>
  <svg
    class="size-4 shrink-0"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <template v-if="type === 'zip'">
      <rect
        x="2.5"
        y="2.5"
        width="27"
        height="27"
        rx="2.5"
        fill="var(--outline-gray-2)"
        stroke="var(--outline-gray-2)"
      />
      <g :filter="`url(#${shadowId})`">
        <path
          d="M16 20H20V22.5C20 24.7091 18.2091 26.5 16 26.5C13.7909 26.5 12 24.7091 12 22.5V18H16V20ZM16 21.5C15.1716 21.5 14.5 22.1716 14.5 23C14.5 23.8284 15.1716 24.5 16 24.5C16.8284 24.5 17.5 23.8284 17.5 23C17.5 22.1716 16.8284 21.5 16 21.5ZM20 18H16V16H20V18ZM16 16H12V14H16V16ZM20 14H16V12H20V14ZM16 12H12V10H16V12ZM20 10H16V8H20V10ZM16 8H12V6H16V8ZM20 6H16V4H20V6ZM16 4H12V2H16V4Z"
          fill="var(--ink-gray-5)"
        />
      </g>
      <defs>
        <filter
          :id="shadowId"
          x="12"
          y="2"
          width="8"
          height="25.5"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="0.5" />
          <feGaussianBlur stdDeviation="0.5" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
          />
          <feBlend in2="shape" result="innerShadow" />
        </filter>
      </defs>
    </template>

    <path
      v-else-if="type === 'pdf'"
      fill="var(--ink-red-5)"
      d="M24 2C27.3137 2 30 4.68629 30 8V24C30 27.3137 27.3137 30 24 30H8C4.68629 30 2 27.3137 2 24V8C2 4.68629 4.68629 2 8 2H24ZM14.8945 6C14.3431 6.00027 13.8913 6.24378 13.5898 6.70508C12.6942 8.07566 13.3908 10.938 14.2891 13.0586C13.8705 14.2401 13.3489 15.5143 12.7734 16.7559C12.1244 18.1565 11.4827 19.4305 10.8652 20.5449C9.10171 21.3793 6.28895 22.9298 6.02148 24.4395C5.94437 24.8769 6.07348 25.2785 6.39453 25.5996C6.65637 25.8614 6.97938 26 7.32812 26C8.04602 26 9.26867 25.5136 11.6172 21.3555C12.9708 20.7346 14.457 20.1775 15.9258 19.7422C16.9931 19.4262 18.0617 19.1779 19.1055 19.0039C20.8262 20.0601 22.8264 20.7363 24.25 20.7363C25.8236 20.7361 25.9856 19.8449 25.998 19.5723C26.0149 19.199 25.882 18.8534 25.6133 18.5723C25.0424 17.9749 23.878 17.6719 22.1543 17.6719C21.2965 17.6719 20.3486 17.7499 19.334 17.9023C18.3072 17.2251 17.4587 16.4269 16.873 15.5859C16.3228 14.7966 15.8348 13.9323 15.4199 13.0156C16.5437 9.72437 16.7629 7.56148 16.0703 6.58789C15.7963 6.20322 15.3889 6 14.8945 6ZM9.86328 22.2402C8.23856 24.7977 7.48147 24.9472 7.32812 24.9473C7.27767 24.9473 7.21936 24.9359 7.13867 24.8555C7.05277 24.769 7.04417 24.7049 7.05859 24.623C7.14577 24.1302 8.04887 23.2544 9.86328 22.2402ZM14.9336 14.416C15.2607 15.0362 15.6209 15.6293 16.0098 16.1875C16.49 16.877 17.1202 17.5377 17.8652 18.1348L17.7598 18.1504L17.8047 18.1797C17.083 18.3325 16.3542 18.5169 15.627 18.7324C14.5645 19.0472 13.4926 19.4239 12.4648 19.8418L12.498 19.7832L12.4551 19.8027C12.8736 18.9943 13.3002 18.1222 13.7285 17.1973C14.1523 16.2828 14.5478 15.3497 14.8965 14.4473L14.9102 14.4805L14.9336 14.416ZM22.1543 18.7246C24.1449 18.7246 24.7217 19.1633 24.8516 19.2988C24.9397 19.391 24.9491 19.4652 24.9453 19.5371C24.9253 19.5682 24.7495 19.6835 24.25 19.6836C23.4685 19.6836 22.2322 19.3976 20.9023 18.7773C21.3396 18.7423 21.7577 18.7246 22.1543 18.7246ZM14.8945 7.05273C15.0702 7.05273 15.1488 7.11044 15.2109 7.19727C15.5196 7.63122 15.5407 8.97142 14.8086 11.4629C14.1318 9.43349 14.0977 7.85473 14.4727 7.28125C14.5771 7.12146 14.7033 7.05295 14.8945 7.05273Z"
    />

    <path
      v-else
      fill="var(--ink-blue-5)"
      d="M24 2C27.3137 2 30 4.68629 30 8V24C30 27.3137 27.3137 30 24 30H8C4.68629 30 2 27.3137 2 24V8C2 4.68629 4.68629 2 8 2H24ZM9 20V22H19V20H9ZM9 15V17H23V15H9ZM9 10V12H23V10H9Z"
    />
  </svg>
</template>
