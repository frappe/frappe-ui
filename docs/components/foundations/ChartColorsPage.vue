<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { TabButtons, Tooltip, useColorScheme } from 'frappe-ui'

type Mode = 'light' | 'dark'

// The switcher drives the global theme so the whole page matches the ramps.
// No "system" option here: the toggle is explicit light/dark, so an initial
// `system` scheme just reads as light.
const { colorScheme, setColorScheme } = useColorScheme()
const mode = computed<Mode>({
  get: () => (colorScheme.value === 'dark' ? 'dark' : 'light'),
  set: (next) => setColorScheme(next),
})

const modeButtons = [
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' },
]

// Ramp lengths are fixed by charts/style.css; the library keeps them internal.
type Ramp = {
  label: string
  prefix: string
  length: number
  description: string
  /** Discrete slots read as separate hues; a continuous ramp reads as one bar. */
  discrete: boolean
}

const RAMPS: Ramp[] = [
  {
    label: 'Categorical',
    prefix: '--chart-categorical-',
    length: 10,
    discrete: true,
    description:
      'Unrelated series. Ten slots of five hue families, each a dark member followed by its light partner, so five series never repeat a hue. Series pick in order and cycle past the tenth.',
  },
  {
    label: 'Sequential',
    prefix: '--chart-sequential-',
    length: 9,
    discrete: false,
    description:
      'One magnitude, dark to light. The default for axis charts and heatmaps: a single series takes the mid-blue, more take evenly spaced stops.',
  },
  {
    label: 'Diverging',
    prefix: '--chart-diverging-',
    length: 9,
    discrete: false,
    description:
      'Signed data, cool to warm around a neutral middle. Use it when the reading has a rest point — variance against plan, deviation from a typical week.',
  },
]

function tokens(ramp: Ramp) {
  return Array.from({ length: ramp.length }, (_, i) => `${ramp.prefix}${i + 1}`)
}

// Swatches paint themselves from the tokens; this is only for the hover value,
// so a rebranded token still shows whatever it resolves to.
const values = ref<Record<string, string>>({})

function readValues() {
  const styles = getComputedStyle(document.documentElement)
  const resolved: Record<string, string> = {}
  for (const ramp of RAMPS) {
    for (const token of tokens(ramp)) {
      resolved[token] = styles.getPropertyValue(token).trim()
    }
  }
  values.value = resolved
}

onMounted(readValues)
watch(mode, () => nextTick(readValues))
</script>

<template>
  <div class="grid gap-14">
    <TabButtons :buttons="modeButtons" v-model="mode" class="w-fit" />

    <section
      v-for="ramp in RAMPS"
      :key="ramp.label"
      :id="ramp.label.toLowerCase()"
      class="grid gap-4"
    >
      <div class="grid gap-1">
        <h2 class="m-0 text-lg font-semibold text-ink-gray-8">
          {{ ramp.label }}
        </h2>
        <p class="m-0 text-p-sm text-ink-gray-5">{{ ramp.description }}</p>
      </div>

      <div class="flex" :class="ramp.discrete ? 'gap-1.5' : 'gap-0'">
        <Tooltip
          v-for="(token, index) in tokens(ramp)"
          :key="token"
          :hover-delay="0"
          class="flex-1"
        >
          <div
            class="flex h-14 w-full items-end justify-center border border-outline-gray-1 pb-1"
            :class="
              ramp.discrete
                ? 'rounded-md'
                : 'border-x-0 first:border-l last:border-r'
            "
            :style="{ background: `var(${token})` }"
          >
            <span
              v-if="ramp.discrete"
              class="text-xs font-medium text-ink-gray-7"
            >
              {{ index + 1 }}
            </span>
          </div>
          <template #content>
            <span class="font-mono"
              >{{ token }}: {{ values[token] || '—' }}</span
            >
          </template>
        </Tooltip>
      </div>
    </section>
  </div>
</template>
