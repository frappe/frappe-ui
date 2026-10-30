<script setup lang="ts">
import { useColorScheme } from '../src'

// `useColorScheme` owns `<html data-theme>` and persists the choice. Light and
// dark only — no "System", so a stored `system` preference resolves to light.
const { colorScheme, setColorScheme } = useColorScheme()
if (colorScheme.value === 'system') setColorScheme('light')

const flip = () =>
  setColorScheme(colorScheme.value === 'dark' ? 'light' : 'dark')
</script>

<template>
  <!--
    Espresso draws this as a button-group: a raised 44px shell with 6px of
    padding, holding one 32px button. Measured off the design —
    · shell   44×44, radius 10, surface-elevation-1, 6px padding.
              Its stroke is in the file but switched off, so no border here.
              Its three shadows are written out rather than taken from
              `shadow-sm`: the design's effects aren't bound to an elevation
              token and they don't match one — 6%/27%/8% against the token's
              14%/20%/16%, which reads as a tighter, crisper edge. They're
              used in both themes, the way the system applies every light
              elevation in dark mode (see tailwind/colorPalette.js).
    · button  32×32, radius 8, surface-gray-2, 7px of padding.
    · icon    18px.
  -->
  <div
    class="flex size-11 items-center justify-center rounded-5 bg-surface-elevation-1 p-1.5 shadow-[inset_0_0.25px_1.5px_rgb(255_255_255/0.08),0_0_1px_rgb(0_0_0/0.27),0_0.5px_3px_rgb(0_0_0/0.06)]"
  >
    <button
      type="button"
      class="grid size-8 place-items-center rounded-4 bg-surface-gray-2 text-ink-gray-7 transition-colors hover:bg-surface-gray-3"
      :aria-label="
        colorScheme === 'dark' ? 'Switch to light' : 'Switch to dark'
      "
      @click="flip"
    >
      <span class="lucide-contrast size-[18px]" aria-hidden="true" />
    </button>
  </div>
</template>
