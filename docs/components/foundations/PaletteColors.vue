<script setup lang="ts">
import { computed, ref } from 'vue'
import { TabButtons } from 'frappe-ui'
import colors from '../../../tailwind/tokens/colors.js'
import ColorGrid, { type Row } from './ColorGrid.vue'

type Ramp = 'lightMode' | 'darkMode'

const HUES = [
  'gray',
  'red',
  'orange',
  'amber',
  'yellow',
  'green',
  'teal',
  'cyan',
  'blue',
  'violet',
  'purple',
  'pink',
]

// `gray-*` holds the light theme's values and `dark-gray-*` the dark theme's.
// Neither changes with the theme, so this switch picks a ramp, not a theme.
const ramp = ref<Ramp>('lightMode')
const rampButtons = [
  { label: 'gray-*', value: 'lightMode' },
  { label: 'dark-gray-*', value: 'darkMode' },
]

const shades = computed(() => colors[ramp.value])
const steps = computed(() => Object.keys(shades.value.gray))
const prefix = computed(() => (ramp.value === 'darkMode' ? 'dark-' : ''))

function row(family: string, name = family, checker = false): Row {
  const values = (shades.value as Record<string, Record<string, string>>)[
    family
  ]
  return {
    name,
    checker,
    swatches: steps.value.map((step) =>
      values[step]
        ? {
            copy: `bg-${prefix.value}${family}-${step}`,
            style: { background: values[step] },
          }
        : null,
    ),
  }
}

const rows = computed(() => [
  row('gray'),
  row('gray-alpha', 'gray alpha', true),
  ...HUES.slice(1).map((hue) => row(hue)),
])

// Overlays have no dark twin. Each is drawn on the color it is meant to sit on.
const overlays = computed<Row[]>(() =>
  (['white', 'black'] as const).map((tone) => ({
    name: `${tone} overlay`,
    swatches: Object.entries(colors.overlay[tone]).map(([step, value]) => ({
      copy: `bg-${tone}-overlay-${step}`,
      style: {
        background: `linear-gradient(${value}, ${value}), ${tone === 'white' ? '#000' : '#fff'}`,
      },
    })),
  })),
)

const overlaySteps = Object.keys(colors.overlay.white)

const neutrals: Row[] = [
  {
    name: 'other',
    swatches: (['white', 'black'] as const).map((name) => ({
      copy: `bg-${name}`,
      label: name,
      style: { background: colors.neutral[name] },
    })),
  },
]
</script>

<template>
  <div class="not-prose my-8 grid gap-6">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <TabButtons v-model="ramp" :options="rampButtons" />
      <span class="text-sm text-ink-gray-5">
        Click a swatch to copy its class
      </span>
    </div>
    <ColorGrid :columns="steps.length" :steps="steps" :rows="rows" />
    <ColorGrid
      :columns="overlaySteps.length"
      :steps="overlaySteps"
      :rows="overlays"
    />
    <ColorGrid :columns="steps.length" :rows="neutrals" />
  </div>
</template>
