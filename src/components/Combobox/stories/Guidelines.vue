<script setup lang="ts">
import { ref } from 'vue'
import { Combobox } from 'frappe-ui'

// From Frappe Builder's style panel: a color property like Background picks
// a color token, and an empty value is "unset", so the block falls back to
// its default. "Unset" isn't an option in the list, so without a clear button
// there's no way back to it. Both sides are live.
const tokens = [
  { label: 'accent', value: 'accent', color: '#5b5bd6' },
  { label: 'accent-2', value: 'accent-2', color: '#d6409f' },
  { label: 'accent-3', value: 'accent-3', color: '#f0a33c' },
  { label: 'accent-soft', value: 'accent-soft', color: '#eef0ff' },
  { label: 'surface', value: 'surface', color: '#f3f3f3' },
  { label: 'ink', value: 'ink', color: '#171717' },
]
const withClear = ref<string | null>('accent-2')
const withoutClear = ref<string | null>('accent-2')

// A property row: the name on the left, the picker on the right.
const row = 'flex w-72 items-center justify-between gap-3'
const property = 'text-sm text-ink-gray-6'
const swatch = 'size-4 shrink-0 rounded-full ring-1 ring-inset ring-black/10'
</script>

<template>
  <div class="flex flex-col gap-8">
    <!-- 1. When empty means something ("unset", so the style falls back to
         its default), give the field a clear button. `#suffix` and
         `clear()` are the pattern from the Clear button section. -->
    <Guideline
      layout="stack"
      caption="Add a clear button when empty means something, like a style that falls back to unset."
    >
      <template #do>
        <div :class="row">
          <span :class="property">Background</span>
          <Combobox
            v-model="withClear"
            class="w-40"
            aria-label="Background"
            placeholder="unset"
            :options="tokens"
          >
            <template #prefix>
              <span :class="[swatch, 'bg-surface-gray-3']" />
            </template>
            <template #item-prefix="{ item }">
              <span :class="swatch" :style="{ background: item.color }" />
            </template>
            <template #suffix="{ clear }">
              <button
                v-if="withClear"
                type="button"
                aria-label="Clear"
                class="text-ink-gray-5"
                @click.stop="clear"
                @pointerdown.stop
              >
                <span class="lucide-x size-4" aria-hidden="true" />
              </button>
            </template>
          </Combobox>
        </div>
      </template>
      <template #dont>
        <div :class="row">
          <span :class="property">Background</span>
          <Combobox
            v-model="withoutClear"
            class="w-40"
            aria-label="Background"
            placeholder="unset"
            :options="tokens"
          >
            <template #prefix>
              <span :class="[swatch, 'bg-surface-gray-3']" />
            </template>
            <template #item-prefix="{ item }">
              <span :class="swatch" :style="{ background: item.color }" />
            </template>
          </Combobox>
        </div>
      </template>
    </Guideline>
  </div>
</template>
