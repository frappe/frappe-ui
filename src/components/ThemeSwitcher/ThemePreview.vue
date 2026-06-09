<!-- Presentational, theme-independent mock shown inside each ThemeSwitcher
     card: a window (PreviewWindow) inset on a gray "desktop" frame. The
     light/dark previews use one full-width frame; the system preview sets a
     light and a dark frame side by side-->
<template>
  <div :class="{ flex: frames.length > 1 }">
    <div
      v-for="(frame, index) in frames"
      :key="index"
      :class="frame.frameClass"
    >
      <PreviewWindow
        :tone="frame.tone"
        :bars="showBars"
        :fill="frame.fill"
        :logo="logo"
        :name="name"
        :logo-is-image="logoIsImage"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, type Component } from 'vue'
import type { Theme } from '../../utils/theme'
import PreviewWindow, { type PreviewTone } from './previews/PreviewWindow.vue'

defineOptions({ name: 'ThemePreview' })

const props = defineProps<{
  theme: Theme
  logo?: string | Component
  name?: string
  logoIsImage: boolean
}>()

/** A window tone inset on its gray desktop frame. */
interface PreviewFrame {
  tone: PreviewTone
  frameClass: string
  /** Whether the window stretches to fill the frame (single) or is clipped (system). */
  fill: boolean
}

const frames = computed<PreviewFrame[]>(() => {
  if (props.theme === 'system') {
    return [
      {
        tone: 'light',
        fill: false,
        frameClass:
          'flex flex-1 overflow-hidden pl-5 pt-3.5 bg-surface-gray-2 rounded-tl-[10.5px]',
      },
      {
        tone: 'dark',
        fill: false,
        frameClass:
          'flex flex-1 overflow-hidden pl-5 pt-3.5 bg-surface-gray-3 rounded-tr-[10.5px]',
      },
    ]
  }
  return [
    {
      tone: props.theme === 'dark' ? 'dark' : 'light',
      fill: true,
      frameClass: 'pl-5 pt-3.5 bg-surface-gray-2 rounded-t-[10.5px]',
    },
  ]
})

// Content rows only appear on the single light/dark previews.
const showBars = computed(() => props.theme !== 'system')
</script>
