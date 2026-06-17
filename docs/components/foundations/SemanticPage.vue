<script setup lang="ts">
import { computed } from 'vue'
import { TabButtons } from 'frappe-ui'
import { useTheme, setTheme } from '../../composables/useTheme'
import colors from '../../../tailwind/colors.json'

type Mode = 'light' | 'dark'

// The switcher drives the global theme so the whole page matches the example.
const globalTheme = useTheme()
const mode = computed<Mode>({
  get: () => globalTheme.value,
  set: (next) => setTheme(next),
})

const modeButtons = [
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' },
]

function resolveRef(ref: string): string {
  const [bucket, family, shade] = ref.split('/')
  if (bucket === 'neutral') return colors.neutral[family as 'white' | 'black']
  if (bucket === 'overlay')
    return colors.overlay[family as 'white' | 'black'][shade]
  const modeData = colors[bucket as 'lightMode' | 'darkMode'] as Record<
    string,
    Record<string, string>
  >
  return modeData?.[family]?.[shade] ?? ref
}

// "lightMode/gray/50" → "gray-50"
// "neutral/white"     → "neutral-white"
// "overlay/black/10"  → "overlay-black-10"
function formatRef(ref: string): string {
  const parts = ref.split('/')
  if (parts[0] === 'lightMode' || parts[0] === 'darkMode') parts.shift()
  return parts.join('-')
}

type Group = {
  category: 'surface' | 'surface-alpha' | 'ink' | 'outline' | 'outline-alpha'
  prefix: string
  description: string
}

const GROUPS: Group[] = [
  {
    category: 'surface',
    prefix: 'bg-surface-',
    description:
      'Use for cards, panels, page chrome, alert backgrounds. Steps from soft (gray-1) to inverted (gray-7).',
  },
  {
    category: 'surface-alpha',
    prefix: 'bg-surface-alpha-',
    description:
      'Use when a surface needs transparency over variable backgrounds, overlays, or layered chrome.',
  },
  {
    category: 'ink',
    prefix: 'text-ink-',
    description:
      'Use for typography, icons, and any glyph-style fill. gray-8 is body text; gray-4/5 is secondary.',
  },
  {
    category: 'outline',
    prefix: 'border-outline-',
    description: 'Use for borders, dividers, focus rings, outlined controls.',
  },
  {
    category: 'outline-alpha',
    prefix: 'border-outline-alpha-',
    description:
      'Use for borders and dividers that should preserve translucency across layered surfaces.',
  },
]

function pickEntries(category: Group['category']) {
  const data = colors.themedVariables[mode.value][category] as Record<
    string,
    string
  >
  return Object.entries(data).map(([name, ref]) => ({
    name,
    ref,
    refLabel: formatRef(ref),
    value: resolveRef(ref),
  }))
}

const sections = computed(() =>
  GROUPS.map((g) => ({ ...g, entries: pickEntries(g.category) })),
)
</script>

<template>
  <div class="grid gap-14">
    <TabButtons :buttons="modeButtons" v-model="mode" class="w-fit" />

    <section
      v-for="section in sections"
      :key="section.category"
      :id="section.category"
      class="grid gap-4"
    >
      <div class="grid gap-1">
        <h2 class="text-lg font-semibold text-ink-gray-8 m-0 capitalize">
          {{ section.category }}
        </h2>
        <p class="text-p-sm text-ink-gray-5 m-0">
          {{ section.description }}
        </p>
      </div>

      <div class="grid divide-y divide-outline-gray-1">
        <div
          v-for="entry in section.entries"
          :key="entry.name"
          class="flex w-full items-center gap-4 py-3 text-left"
        >
          <div
            class="size-10 rounded-md shrink-0"
            :style="{ background: entry.value }"
          ></div>
          <div class="grid gap-1 min-w-0 flex-1">
            <span class="text-sm font-mono text-ink-gray-8 truncate">
              {{ section.prefix }}{{ entry.name }}
            </span>
            <span class="text-xs font-mono text-ink-gray-5 truncate">
              → {{ entry.refLabel }}
            </span>
          </div>
          <span class="text-xs font-mono text-ink-gray-5 shrink-0 tabular-nums">
            {{ entry.value }}
          </span>
        </div>
      </div>
    </section>
  </div>
</template>
