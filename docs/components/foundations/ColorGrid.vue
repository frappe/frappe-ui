<script setup lang="ts">
import { toast } from 'frappe-ui'

// One row per hue, one column per step, like Tailwind's palette. Clicking a
// swatch copies its class.
export type Swatch = {
  /** The class to copy, such as `bg-surface-red-3`. */
  copy: string
  style: Record<string, string>
  /** Shown under the swatch, for rows whose cells don't follow `steps`. */
  label?: string
  /** Text drawn inside the swatch, for ink colors. */
  text?: string
}

export type Row = {
  name: string
  swatches: (Swatch | null)[]
  /** Draw a checkerboard behind the row, for transparent colors. */
  checker?: boolean
}

// `steps` labels the columns; leave it out for rows of named swatches.
defineProps<{ columns: number; steps?: string[]; rows: Row[] }>()

async function copy(value: string) {
  try {
    await navigator.clipboard.writeText(value)
    toast.success(`Copied ${value}`)
  } catch {
    toast.error('Could not copy to the clipboard')
  }
}
</script>

<template>
  <div
    class="not-prose grid gap-y-3 sm:grid-cols-[5.5rem_1fr] sm:gap-x-3 sm:gap-y-2"
  >
    <template v-if="steps">
      <div class="max-sm:hidden" />
      <div
        class="grid gap-1.5 max-sm:hidden"
        :style="{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }"
      >
        <span
          v-for="step in steps"
          :key="step"
          class="text-center text-xs font-medium text-ink-gray-5"
        >
          {{ step }}
        </span>
      </div>
    </template>

    <template v-for="row in rows" :key="row.name">
      <span
        class="self-center text-sm font-medium text-ink-gray-8 sm:truncate"
        :class="{ 'self-start sm:pt-2': row.swatches.some((s) => s?.label) }"
      >
        {{ row.name }}
      </span>
      <div
        class="grid gap-1.5"
        :style="{
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        }"
      >
        <template v-for="(swatch, i) in row.swatches" :key="i">
          <div v-if="!swatch" />
          <div v-else class="grid min-w-0 content-start gap-1">
            <button
              type="button"
              class="aspect-square w-full rounded-md"
              :class="row.checker && 'checker'"
              :title="swatch.copy"
              :aria-label="`Copy ${swatch.copy}`"
              @click="copy(swatch.copy)"
            >
              <span
                class="flex size-full items-center justify-center rounded-md text-lg font-medium shadow-[inset_0_0_0_1px_var(--outline-gray-1)]"
                :style="swatch.style"
              >
                {{ swatch.text }}
              </span>
            </button>
            <span
              v-if="swatch.label"
              class="truncate text-center text-2xs text-ink-gray-5"
              :title="swatch.label"
            >
              {{ swatch.label }}
            </span>
          </div>
        </template>
      </div>
    </template>
  </div>
</template>

<style scoped>
.checker {
  background: repeating-conic-gradient(
      var(--surface-gray-2) 0% 25%,
      var(--surface-base) 0% 50%
    )
    50% / 12px 12px;
}
</style>
