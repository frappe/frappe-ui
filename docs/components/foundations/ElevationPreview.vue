<script setup lang="ts">
import { ref } from 'vue'

const ELEVATION_STEPS = ['sm', 'base', 'md', 'lg', 'xl', '2xl'] as const

// Dark-mode surface pairing — sm/base/md sit on the deepest layer, lg/xl
// step up one, 2xl sits on top.
const DARK_SURFACE_BY_STEP: Record<string, string> = {
  sm: 'bg-surface-gray-1',
  base: 'bg-surface-gray-1',
  md: 'bg-surface-gray-1',
  lg: 'bg-surface-gray-2',
  xl: 'bg-surface-gray-2',
  '2xl': 'bg-surface-gray-3',
}

const previewTheme = ref<'light' | 'dark'>('light')
</script>

<template>
  <div>
    <div class="flex justify-end mb-3">
      <div class="inline-flex rounded-md border border-outline-gray-2 p-0.5 text-xs">
        <button
          class="px-2 py-1 rounded-sm transition-colors"
          :class="previewTheme === 'light' ? 'bg-surface-gray-3 text-ink-gray-8' : 'text-ink-gray-5'"
          @click="previewTheme = 'light'"
        >Light</button>
        <button
          class="px-2 py-1 rounded-sm transition-colors"
          :class="previewTheme === 'dark' ? 'bg-surface-gray-3 text-ink-gray-8' : 'text-ink-gray-5'"
          @click="previewTheme = 'dark'"
        >Dark</button>
      </div>
    </div>

    <div
      class="grid grid-cols-2 sm:grid-cols-3 gap-6 p-8 rounded-xl border border-outline-gray-2"
      :class="previewTheme === 'dark' ? 'bg-[#1a1a1a]' : 'bg-[#f5f5f5]'"
      :data-theme="previewTheme"
    >
      <div v-for="step in ELEVATION_STEPS" :key="step" class="grid gap-3">
        <div
          class="h-24 rounded-lg"
          :class="[
            `shadow-${step}`,
            previewTheme === 'dark' ? DARK_SURFACE_BY_STEP[step] : 'bg-surface-white',
          ]"
        ></div>
        <div class="grid gap-0.5">
          <span class="text-2xs font-mono text-ink-gray-5">shadow-{{ step }}</span>
          <span class="text-xs text-ink-gray-6">--elevation-{{ step }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
