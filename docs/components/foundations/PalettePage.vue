<script setup lang="ts">
import { computed } from 'vue'
import { TabButtons } from 'frappe-ui'
import { useTheme, setTheme } from '../../composables/useTheme'
import colors from '../../../tailwind/colors.json'

type Mode = 'lightMode' | 'darkMode'

// The switcher drives the global theme so the whole page matches the example.
const globalTheme = useTheme()
const mode = computed<Mode>({
  get: () => (globalTheme.value === 'dark' ? 'darkMode' : 'lightMode'),
  set: (next) => setTheme(next === 'darkMode' ? 'dark' : 'light'),
})

const modeButtons = [
  { label: 'Light', value: 'lightMode' },
  { label: 'Dark', value: 'darkMode' },
]

const FAMILIES: { key: string; label: string }[] = [
  { key: 'gray', label: 'Gray' },
  { key: 'blue', label: 'Blue' },
  { key: 'green', label: 'Green' },
  { key: 'red', label: 'Red' },
  { key: 'orange', label: 'Orange' },
  { key: 'amber', label: 'Amber' },
  { key: 'yellow', label: 'Yellow' },
  { key: 'teal', label: 'Teal' },
  { key: 'cyan', label: 'Cyan' },
  { key: 'purple', label: 'Purple' },
  { key: 'pink', label: 'Pink' },
  { key: 'violet', label: 'Violet' },
]

const ALPHA_FAMILIES: { key: string; label: string }[] = [
  { key: 'gray-alpha', label: 'Gray Alpha' },
]

const NEUTRALS: { key: string; label: string; value: string }[] = [
  { key: 'white', label: 'white', value: colors.neutral.white },
  { key: 'black', label: 'black', value: colors.neutral.black },
]

const families = computed(() => {
  const modeData = colors[mode.value]
  return FAMILIES.map((f) => ({
    ...f,
    shades: modeData[f.key] ? Object.entries(modeData[f.key]) : [],
  })).filter((f) => f.shades.length > 0)
})

const alphaFamilies = computed(() => {
  const modeData = colors[mode.value]
  return ALPHA_FAMILIES.map((f) => ({
    ...f,
    shades: modeData[f.key] ? Object.entries(modeData[f.key]) : [],
  })).filter((f) => f.shades.length > 0)
})

const overlayWhite = computed(
  () => Object.entries(colors.overlay.white) as [string, string][],
)
const overlayBlack = computed(
  () => Object.entries(colors.overlay.black) as [string, string][],
)
</script>

<template>
  <TabButtons :buttons="modeButtons" v-model="mode" class="w-fit" />
  <div class="grid gap-6 mt-6">
    <section
      v-for="family in families"
      :key="family.key"
      :id="family.key"
      class="grid gap-3"
    >
      <h2 class="text-xl font-semibold text-ink-gray-8 m-0">
        {{ family.label }}
      </h2>
      <div
        class="grid gap-1.5"
        :style="{
          gridTemplateColumns: `repeat(${family.shades.length}, minmax(0, 1fr))`,
        }"
      >
        <div
          v-for="[shade, value] in family.shades"
          :key="shade"
          class="grid gap-1 text-left"
        >
          <div
            class="aspect-square rounded"
            :style="{ background: value as string }"
          ></div>
          <div class="grid gap-1">
            <span class="text-xs font-medium text-ink-gray-7">
              {{ shade }}
            </span>
            <span class="text-2xs text-ink-gray-5 font-mono uppercase">
              {{ value }}
            </span>
          </div>
        </div>
      </div>
    </section>

    <section
      v-for="family in alphaFamilies"
      :key="family.key"
      :id="family.key"
      class="grid gap-3"
    >
      <h2 class="text-xl font-semibold text-ink-gray-8 m-0">
        {{ family.label }}
      </h2>
      <div
        class="grid gap-1.5 p-2 -mx-2 rounded"
        :style="{
          gridTemplateColumns: `repeat(${family.shades.length}, minmax(0, 1fr))`,
          background:
            mode === 'lightMode'
              ? 'repeating-conic-gradient(#f3f3f3 0% 25%, #ffffff 0% 50%) 50% / 16px 16px'
              : 'repeating-conic-gradient(#242424 0% 25%, #2b2b2b 0% 50%) 50% / 16px 16px',
        }"
      >
        <div
          v-for="[shade, value] in family.shades"
          :key="shade"
          class="grid gap-1 text-left"
        >
          <div
            class="aspect-square rounded"
            :style="{ background: value as string }"
          ></div>
          <div
            class="grid gap-1 bg-surface-base/80 dark:bg-surface-gray-1/80 rounded px-1"
          >
            <span class="text-xs font-medium text-ink-gray-7">
              {{ shade }}
            </span>
            <span class="text-2xs text-ink-gray-5 font-mono uppercase truncate">
              {{ value }}
            </span>
          </div>
        </div>
      </div>
    </section>

    <section id="overlays" class="grid gap-3">
      <h2 class="text-xl font-semibold text-ink-gray-8 m-0">Overlays</h2>

      <div class="grid gap-4">
        <div class="grid gap-1.5">
          <span class="text-sm text-ink-gray-6">white-overlay</span>
          <div
            class="grid gap-1.5"
            :style="{
              gridTemplateColumns: `repeat(${overlayWhite.length}, minmax(0, 1fr))`,
            }"
          >
            <div
              v-for="[shade, value] in overlayWhite"
              :key="shade"
              class="grid gap-1 text-left"
            >
              <div
                class="aspect-square rounded"
                :style="{
                  background: `linear-gradient(${value}, ${value}), #0f0f0f`,
                }"
              ></div>
              <span class="text-2xs text-ink-gray-7 font-mono">{{ shade }}</span>
            </div>
          </div>
        </div>
        <div class="grid gap-1.5">
          <span class="text-sm text-ink-gray-6">black-overlay</span>
          <div
            class="grid gap-1.5"
            :style="{
              gridTemplateColumns: `repeat(${overlayBlack.length}, minmax(0, 1fr))`,
            }"
          >
            <div
              v-for="[shade, value] in overlayBlack"
              :key="shade"
              class="grid gap-1 text-left"
            >
              <div
                class="aspect-square rounded"
                :style="{
                  background: `linear-gradient(${value}, ${value}), #ffffff`,
                }"
              ></div>
              <span class="text-2xs text-ink-gray-7 font-mono">{{
                shade
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="neutrals" class="grid gap-3">
      <h2 class="text-xl font-semibold text-ink-gray-8 m-0">Neutrals</h2>
      <div
        class="grid gap-1.5"
        :style="{ gridTemplateColumns: `repeat(11, minmax(0, 1fr))` }"
      >
        <div v-for="n in NEUTRALS" :key="n.key" class="grid gap-1 text-left">
          <div
            class="aspect-square rounded border border-outline-gray-2"
            :style="{ background: n.value }"
          ></div>
          <div class="grid gap-1">
            <span class="text-xs font-medium text-ink-gray-7">{{ n.label }}</span>
            <span class="text-2xs text-ink-gray-5 font-mono uppercase">{{
              n.value
            }}</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
