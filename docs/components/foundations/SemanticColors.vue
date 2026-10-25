<script setup lang="ts">
import { computed, ref } from 'vue'
import { TabButtons } from 'frappe-ui'
import colors from '../../../tailwind/tokens/colors.js'
import ColorGrid, { type Row, type Swatch } from './ColorGrid.vue'

type Category = 'surface' | 'ink' | 'outline'

// Swatches paint from the CSS variables, so they follow the site's theme
// toggle with no state here.
const TABS: {
  value: Category
  label: string
  prefix: string
  paint: (variable: string) => Pick<Swatch, 'style' | 'text'>
}[] = [
  {
    value: 'surface',
    label: 'Surface',
    prefix: 'bg-',
    paint: (v) => ({ style: { background: `var(${v})` } }),
  },
  {
    value: 'ink',
    label: 'Ink',
    prefix: 'text-',
    paint: (v) => ({
      style: { background: 'var(--surface-base)', color: `var(${v})` },
      text: 'Aa',
    }),
  },
  {
    value: 'outline',
    label: 'Outline',
    prefix: 'border-',
    paint: (v) => ({
      style: {
        background: 'var(--surface-base)',
        boxShadow: `inset 0 0 0 2px var(${v})`,
        // The 2px border is the swatch's edge; the hairline would cover it.
        outline: 'none',
      },
    }),
  },
]

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

const active = ref<Category>('surface')
const tab = computed(() => TABS.find((t) => t.value === active.value)!)

// Surface and outline hues have 10 steps, ink hues 9.
const steps = computed(() => {
  const last = Math.max(
    ...names(active.value).map((n) => Number(n.match(/-(\d+)$/)?.[1] ?? 0)),
  )
  return Array.from({ length: last }, (_, i) => String(i + 1))
})

function names(category: string): string[] {
  const table = colors.themedVariables.light as Record<
    string,
    Record<string, string> | undefined
  >
  return Object.keys(table[category] ?? {})
}

function swatch(category: string, name: string, label?: string): Swatch {
  return {
    copy: `${tab.value.prefix}${category}-${name}`,
    label,
    ...tab.value.paint(`--${category}-${name}`),
  }
}

// A hue row, or null when this category has no such hue.
function hueRow(category: string, hue: string, rowName: string): Row | null {
  const all = new Set(names(category))
  const swatches = steps.value.map((step) =>
    all.has(`${hue}-${step}`) ? swatch(category, `${hue}-${step}`) : null,
  )
  if (swatches.every((s) => !s)) return null
  return { name: rowName, swatches, checker: category.endsWith('-alpha') }
}

const isHueStep = (name: string) =>
  HUES.some((hue) => new RegExp(`^${hue}-\\d+$`).test(name))

const rows = computed<Row[]>(() => {
  const category = active.value
  const alpha = `${category}-alpha`
  const rows = HUES.map((hue) => hueRow(category, hue, hue))
  // The alpha grays sit under the solid ones, for comparison.
  rows.splice(1, 0, hueRow(alpha, 'gray', 'gray alpha'))
  return rows.filter((r): r is Row => r !== null)
})

// Tokens outside the hue grid: base, sidebar, elevation-*, blue-link.
const others = computed<Row[]>(() => {
  const category = active.value
  const alpha = `${category}-alpha`
  const solid = names(category)
    .filter((n) => !isHueStep(n))
    .map((n) => swatch(category, n, n))
  const translucent = names(alpha)
    .filter((n) => !isHueStep(n))
    .map((n) => swatch(alpha, n, n))
  return [
    { name: 'other', swatches: solid },
    ...(translucent.length
      ? [{ name: 'other alpha', swatches: translucent, checker: true }]
      : []),
  ]
})
</script>

<template>
  <div class="not-prose my-8 grid gap-6">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <TabButtons
        v-model="active"
        :options="TABS.map((t) => ({ label: t.label, value: t.value }))"
      />
      <span class="text-sm text-ink-gray-5">
        Click a swatch to copy its class
      </span>
    </div>
    <ColorGrid :columns="steps.length" :steps="steps" :rows="rows" />
    <ColorGrid :columns="steps.length" :rows="others" />
  </div>
</template>
