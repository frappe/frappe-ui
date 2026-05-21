<script setup lang="ts">
import { computed, ref } from 'vue'
import { TabButtons } from 'frappe-ui'
import colors from '../../../tailwind/colors.json'

type Mode = 'light' | 'dark'
const mode = ref<Mode>('light')

const modeButtons = [
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' },
]

function resolveRef(ref: string): string {
  const [bucket, family, shade] = ref.split('/')
  if (bucket === 'neutral') return colors.neutral[family as 'white' | 'black']
  if (bucket === 'overlay') return colors.overlay[family as 'white' | 'black'][shade]
  const modeData = colors[bucket as 'lightMode' | 'darkMode'] as Record<
    string,
    Record<string, string>
  >
  return modeData?.[family]?.[shade] ?? ref
}

type Group = {
  category: 'surface' | 'ink' | 'outline'
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
]

function pickEntries(category: Group['category']) {
  const data = colors.themedVariables[mode.value][category] as Record<
    string,
    string
  >
  return Object.entries(data).map(([name, ref]) => ({
    name,
    ref,
    value: resolveRef(ref),
  }))
}

const sections = computed(() =>
  GROUPS.map((g) => ({ ...g, entries: pickEntries(g.category) })),
)

function copy(text: string) {
  navigator.clipboard?.writeText(text)
}

// Group entries by color subfamily (gray, red, green, …) for visual clustering.
function groupEntries(entries: { name: string; ref: string; value: string }[]) {
  const groups = new Map<string, typeof entries>()
  for (const e of entries) {
    // Token names look like "gray-1", "red-3", "blue-link", "menu-bar", "alert-button-default".
    // Group by the head segment before the first hyphen for ramps, or treat as singleton.
    const head = e.name.includes('-') ? e.name.split('-')[0] : e.name
    if (!groups.has(head)) groups.set(head, [])
    groups.get(head)!.push(e)
  }
  return Array.from(groups.entries()).map(([head, items]) => ({ head, items }))
}
</script>

<template>
  <div class="grid gap-14">
    <header class="grid gap-3">
      <p class="text-p-base text-ink-gray-6 max-w-2xl">
        Semantic tokens map a use-case (surface, ink, outline) to a primitive.
        Always prefer these over raw palette colors in app code — they swap with
        theme.
      </p>
      <TabButtons :buttons="modeButtons" v-model="mode" class="w-fit" />
    </header>

    <section
      v-for="section in sections"
      :key="section.category"
      :id="section.category"
      class="grid gap-6"
    >
      <div class="grid gap-1">
        <h2 class="text-xl font-semibold text-ink-gray-8 m-0 capitalize">
          {{ section.category }}
        </h2>
        <p class="text-p-sm text-ink-gray-5 m-0">
          {{ section.description }}
        </p>
      </div>

      <div
        v-for="group in groupEntries(section.entries)"
        :key="group.head"
        class="grid gap-3"
      >
        <span class="text-xs text-ink-gray-5 capitalize">{{ group.head }}</span>
        <div class="grid gap-x-6 gap-y-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <button
            v-for="entry in group.items"
            :key="entry.name"
            class="flex items-center gap-3 text-left"
            @click="copy(`${section.prefix}${entry.name}`)"
          >
            <div
              class="size-10 rounded shrink-0 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.08)] dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)]"
              :style="{ background: entry.value }"
            ></div>
            <div class="grid gap-1 min-w-0">
              <span class="text-sm font-medium text-ink-gray-8 truncate">
                {{ section.prefix }}{{ entry.name }}
              </span>
              <span class="text-2xs font-mono text-ink-gray-5 uppercase">
                {{ entry.value }}
              </span>
            </div>
          </button>
        </div>
      </div>
    </section>
  </div>
</template>
