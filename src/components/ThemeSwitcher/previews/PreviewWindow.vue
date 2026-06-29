<!-- SVG for the ThemeSwitcher preview card used in ThemePreview as per theme variant. -->
<template>
  <div
    class="relative"
    :class="fill ? 'w-full' : 'w-fit shrink-0'"
  >
    <svg
      width="207"
      height="68"
      viewBox="0 0 207 68"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      class="block h-auto rounded-tl-sm"
      :class="{ 'w-full': fill }"
    >
      <path d="M0 4C0 1.79086 1.79086 0 4 0H207V83H0V4Z" :fill="colors.background" />
      <template v-if="bars">
        <rect x="104" y="28" width="103" height="6" :fill="colors.bar" />
        <rect x="104" y="39" width="103" height="6" :fill="colors.bar" />
        <rect x="104" y="50" width="103" height="6" :fill="colors.bar" />
      </template>
      <rect x="4" y="3" width="6" height="6" rx="3" fill="#FF5F57" />
      <rect x="13" y="3" width="6" height="6" rx="3" fill="#FEBC2D" />
      <rect x="22" y="3" width="6" height="6" rx="3" fill="#28C840" />
      <line y1="13.5" x2="207" y2="13.5" :stroke="colors.line" />
    </svg>

    <div
      class="absolute flex items-center gap-1 text-xs font-semibold text-ink-gray-5 top-[24px] left-[10px]"
    >
      <img
        v-if="logoIsImage"
        :src="logo as string"
        class="size-5 object-cover"
        alt=""
      />
      <component
        :is="logo"
        v-else-if="logo"
        class="size-5 shrink-0 rounded-[5px]"
      />
      <div v-if="name">{{ name }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, type Component } from 'vue'

export type PreviewTone = 'light' | 'dark'

defineOptions({ name: 'PreviewWindow' })

const props = withDefaults(
  defineProps<{
    tone: PreviewTone
    /** Placeholder content rows, shown for single previews, hidden for system. */
    bars?: boolean
    /** Stretch to the container instead of rendering at natural width. */
    fill?: boolean
    logo?: string | Component
    name?: string
    logoIsImage?: boolean
  }>(),
  { bars: true, fill: false },
)

const tones: Record<PreviewTone, { background: string; bar: string; line: string }> = {
  light: { background: '#FFFFFF', bar: '#F3F3F3', line: '#EDEDED' },
  dark: { background: '#171717', bar: '#383838', line: '#383838' },
}

const colors = computed(() => tones[props.tone])
</script>
