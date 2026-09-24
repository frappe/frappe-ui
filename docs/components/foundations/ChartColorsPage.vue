<script setup lang="ts">
import { Tooltip } from 'frappe-ui'

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
      'For series that are not related. Five hues, each dark then light, so the first five series all get different hues. After the tenth, colors repeat.',
  },
  {
    label: 'Sequential',
    prefix: '--chart-sequential-',
    length: 9,
    discrete: false,
    description:
      'One measure from high to low. The default for axis charts and heatmaps. One series gets the middle blue; more series get evenly spaced steps.',
  },
  {
    label: 'Diverging',
    prefix: '--chart-diverging-',
    length: 9,
    discrete: false,
    description:
      'Values above and below a middle point, such as actual against plan. Blue at one end, red at the other, and a neutral middle.',
  },
]

function tokens(ramp: Ramp) {
  return Array.from({ length: ramp.length }, (_, i) => `${ramp.prefix}${i + 1}`)
}

// Swatches paint from the variables. The tooltip reads the value when it
// opens, so it matches the current theme.
function valueOf(token: string) {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(token)
    .trim()
}
</script>

<template>
  <div class="not-prose my-8 grid gap-10">
    <section v-for="ramp in RAMPS" :key="ramp.label" class="grid gap-4">
      <div class="grid gap-1">
        <span class="text-base font-medium text-ink-gray-8">
          {{ ramp.label }}
        </span>
        <p class="text-p-sm text-ink-gray-5">{{ ramp.description }}</p>
      </div>

      <!-- A continuous ramp is one bar, so it gets one outline. -->
      <div
        class="flex"
        :class="
          ramp.discrete
            ? 'gap-1.5'
            : 'overflow-hidden rounded-3 outline outline-1 -outline-offset-1 outline-black/10 dark:outline-white/10'
        "
      >
        <Tooltip
          v-for="(token, index) in tokens(ramp)"
          :key="token"
          :hover-delay="0"
        >
          <!-- The slot number sits under the swatch: no one text color reads
               on both the dark and the light swatches. -->
          <div class="grid min-w-0 flex-1 gap-1">
            <div
              class="h-14 w-full"
              :class="
                ramp.discrete &&
                'rounded-3 outline outline-1 -outline-offset-1 outline-black/10 dark:outline-white/10'
              "
              :style="{ background: `var(${token})` }"
            />
            <span
              v-if="ramp.discrete"
              class="text-center text-xs font-medium text-ink-gray-5"
            >
              {{ index + 1 }}
            </span>
          </div>
          <template #content>
            <span class="font-mono"
              >{{ token }}: {{ valueOf(token) || '—' }}</span
            >
          </template>
        </Tooltip>
      </div>
    </section>
  </div>
</template>
