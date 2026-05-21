<script setup lang="ts">
import { computed } from 'vue'
import radius from '../../../tailwind/generated/radius.json'

// Split into two groups for clarity: Figma's numeric scale and the named aliases.
const NUMERIC_KEYS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
const NAMED_KEYS = ['none', 'sm', 'DEFAULT', 'md', 'lg', 'xl', '2xl', 'full']

const numeric = computed(() =>
  NUMERIC_KEYS.filter((k) => k in radius).map((k) => ({
    name: k,
    value: (radius as Record<string, string>)[k],
  })),
)
const named = computed(() =>
  NAMED_KEYS.filter((k) => k in radius).map((k) => ({
    name: k,
    value: (radius as Record<string, string>)[k],
    cls: k === 'DEFAULT' ? 'rounded' : `rounded-${k}`,
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
        Ten radii from sharp to pill. The numeric scale (<code class="text-ink-gray-8">rounded-0</code>
        …<code class="text-ink-gray-8">rounded-9</code>) mirrors Figma; named
        aliases (<code class="text-ink-gray-8">rounded-sm</code>,
        <code class="text-ink-gray-8">rounded-md</code>, …) are layered on top
        for ergonomics.
      </p>
    </header>

    <section class="grid gap-4">
      <div class="grid gap-1">
        <h2 class="text-xl font-semibold text-ink-gray-8 m-0">Numeric scale</h2>
        <p class="text-p-sm text-ink-gray-5 m-0">From Figma. Use these in new code.</p>
      </div>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        <button
          v-for="r in numeric"
          :key="r.name"
          class="grid gap-2 text-left"
          @click="copy(`rounded-${r.name}`)"
        >
          <div
            class="aspect-square bg-surface-blue-2 border border-outline-blue-3"
            :style="{ borderRadius: r.value }"
          ></div>
          <div class="grid">
            <span class="text-2xs font-mono text-ink-gray-5">
              rounded-{{ r.name }}
            </span>
            <span class="text-sm font-medium text-ink-gray-8">{{ r.value }}</span>
          </div>
        </button>
      </div>
    </section>

    <section class="grid gap-4">
      <div class="grid gap-1">
        <h2 class="text-xl font-semibold text-ink-gray-8 m-0">Named aliases</h2>
        <p class="text-p-sm text-ink-gray-5 m-0">
          Tailwind-style ergonomic names; resolve to the same values as the
          numeric scale.
        </p>
      </div>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        <button
          v-for="r in named"
          :key="r.name"
          class="grid gap-2 text-left"
          @click="copy(r.cls)"
        >
          <div
            class="aspect-square bg-surface-gray-3 border border-outline-gray-3"
            :style="{ borderRadius: r.value }"
          ></div>
          <div class="grid">
            <span class="text-2xs font-mono text-ink-gray-5">{{ r.cls }}</span>
            <span class="text-sm font-medium text-ink-gray-8">{{ r.value }}</span>
          </div>
        </button>
      </div>
    </section>
  </div>
</template>
