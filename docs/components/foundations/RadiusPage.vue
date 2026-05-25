<script setup lang="ts">
import { computed } from 'vue'
import radius from '../../../tailwind/generated/radius.json'

const NUMERIC_KEYS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
// Display order for the unified scale — numerics in order, then `full`.
const SCALE_KEYS = [...NUMERIC_KEYS, 'full']

// Map each alias (`rounded-sm`, `rounded-md`, `rounded`, …) to the numeric
// scale entry that shares its value. The page renders one row per scale
// step; aliases land alongside their numeric twin.
const ALIASES_BY_NUMERIC = computed(() => {
  const table = radius as Record<string, string>
  const aliases: Record<string, string[]> = {}
  const aliasKeys = Object.keys(table).filter(
    (k) => !NUMERIC_KEYS.includes(k) && k !== 'full',
  )
  for (const aliasKey of aliasKeys) {
    const value = table[aliasKey]
    const numeric = NUMERIC_KEYS.find((n) => table[n] === value)
    if (!numeric) continue
    const cls = aliasKey === 'DEFAULT' ? 'rounded' : `rounded-${aliasKey}`
    ;(aliases[numeric] ||= []).push(cls)
  }
  return aliases
})

const rows = computed(() =>
  SCALE_KEYS.filter((k) => k in radius).map((k) => ({
    name: k,
    value: (radius as Record<string, string>)[k],
    aliases: ALIASES_BY_NUMERIC.value[k] || [],
  })),
)

function copy(text: string) {
  navigator.clipboard?.writeText(text)
}
</script>

<template>
  <div class="grid gap-8">
    <header class="grid gap-3">
      <p class="text-p-base text-ink-gray-6 max-w-2xl">
        Ten radii from sharp to pill. The numeric scale (<code
          class="text-ink-gray-8"
          >rounded-0</code
        >
        …<code class="text-ink-gray-8">rounded-9</code>) mirrors Figma. Named
        aliases (<code class="text-ink-gray-8">rounded-sm</code>,
        <code class="text-ink-gray-8">rounded-md</code>, …) resolve to the same
        values for ergonomics.
      </p>
    </header>

    <section class="grid gap-4">
      <div class="grid divide-y divide-outline-gray-1">
        <button
          v-for="r in rows"
          :key="r.name"
          class="flex w-full items-center gap-4 py-3 text-left"
          @click="copy(`rounded-${r.name}`)"
        >
          <div
            class="size-16 shrink-0 bg-surface-gray-3 border border-outline-gray-3"
            :style="{ borderRadius: r.value }"
          ></div>
          <div class="grid gap-1 min-w-0 flex-1">
            <span class="text-sm font-mono text-ink-gray-8 truncate">
              rounded-{{ r.name }}
            </span>
            <span class="text-xs font-mono text-ink-gray-5 truncate">
              --radius-{{ r.name }}
            </span>
          </div>
          <div
            v-if="r.aliases.length"
            class="flex flex-wrap gap-1.5 shrink-0 justify-end"
          >
            <span
              v-for="alias in r.aliases"
              :key="alias"
              class="text-2xs font-mono text-ink-gray-6 bg-surface-gray-2 rounded px-1.5 py-0.5"
            >
              {{ alias }}
            </span>
          </div>
          <span
            class="text-xs font-mono text-ink-gray-5 shrink-0 tabular-nums w-12 text-right"
          >
            {{ r.value }}
          </span>
        </button>
      </div>
    </section>
  </div>
</template>
