<script setup lang="ts">
import { computed } from 'vue'
import typography from '../../../tailwind/generated/typography.json'

type SizeMeta = { lineHeight?: string; letterSpacing?: string; fontWeight?: string }
type SizeEntry = [string, SizeMeta]

// Group sizes for the page. Order matters — drives display order.
const TEXT_KEYS = ['2xs', 'xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl']
const DISPLAY_KEYS = ['4xl', '5xl', '6xl', '7xl', '8xl', '9xl', '10xl', '11xl', '12xl', '13xl', '14xl', '15xl']

function entry(key: string) {
  const v = (typography.fontSize as Record<string, SizeEntry>)[key]
  if (!v) return null
  const [size, meta] = v
  return { name: key, size, meta: meta || {} }
}

const text = computed(() => TEXT_KEYS.map(entry).filter(Boolean) as NonNullable<ReturnType<typeof entry>>[])
const display = computed(() => DISPLAY_KEYS.map(entry).filter(Boolean) as NonNullable<ReturnType<typeof entry>>[])
const weights = Object.entries(typography.fontWeight) as [string, number][]
const family = (typography.fontFamily as Record<string, string>).text || 'Inter'

const sample = 'The quick brown fox jumps over the lazy dog'

function copy(text: string) {
  navigator.clipboard?.writeText(text)
}
</script>

<template>
  <div class="grid gap-10">
    <header class="grid gap-3">
      <p class="text-p-base text-ink-gray-6 max-w-2xl">
        {{ family }}, all the way down. A single ramp from
        <code class="text-ink-gray-8">2xs</code> to
        <code class="text-ink-gray-8">15xl</code>, with paragraph variants for
        body copy.
      </p>
    </header>

    <section class="grid gap-4">
      <h2 class="text-xl font-semibold text-ink-gray-8 m-0">Text sizes</h2>
      <div class="grid gap-4">
        <button
          v-for="item in text"
          :key="item.name"
          class="grid gap-3 text-left"
          @click="copy(`text-${item.name}`)"
        >
          <div
            :style="{
              fontSize: item.size,
              lineHeight: item.meta.lineHeight,
              letterSpacing: item.meta.letterSpacing,
              fontWeight: item.meta.fontWeight,
            }"
            class="text-ink-gray-8"
          >
            {{ sample }}
          </div>
          <div class="flex gap-6 text-2xs font-mono text-ink-gray-5 uppercase flex-wrap">
            <span>text-{{ item.name }}</span>
            <span>size {{ item.size }}</span>
            <span v-if="item.meta.lineHeight">lh {{ item.meta.lineHeight }}</span>
            <span v-if="item.meta.letterSpacing">ls {{ item.meta.letterSpacing }}</span>
            <span v-if="item.meta.fontWeight">fw {{ item.meta.fontWeight }}</span>
          </div>
        </button>
      </div>
    </section>

    <section class="grid gap-4">
      <div class="grid gap-1">
        <h2 class="text-xl font-semibold text-ink-gray-8 m-0">Display sizes</h2>
        <p class="text-p-sm text-ink-gray-5 m-0">Marketing, landing, hero copy.</p>
      </div>
      <div class="grid gap-4">
        <button
          v-for="item in display"
          :key="item.name"
          class="grid gap-2 text-left overflow-hidden"
          @click="copy(`text-${item.name}`)"
        >
          <div
            :style="{
              fontSize: item.size,
              lineHeight: item.meta.lineHeight,
              letterSpacing: item.meta.letterSpacing,
              fontWeight: 600,
            }"
            class="text-ink-gray-8 whitespace-nowrap"
          >
            Aa Bb Cc
          </div>
          <div class="flex gap-6 text-2xs font-mono text-ink-gray-5 uppercase flex-wrap">
            <span>text-{{ item.name }}</span>
            <span>size {{ item.size }}</span>
            <span v-if="item.meta.lineHeight">lh {{ item.meta.lineHeight }}</span>
          </div>
        </button>
      </div>
    </section>

    <section class="grid gap-4">
      <h2 class="text-xl font-semibold text-ink-gray-8 m-0">Weights</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <button
          v-for="[name, value] in weights"
          :key="name"
          class="grid gap-1 text-left"
          @click="copy(`font-${name}`)"
        >
          <div
            :style="{ fontWeight: value }"
            class="text-lg text-ink-gray-8"
          >
            {{ sample }}
          </div>
          <span class="text-2xs font-mono text-ink-gray-5 uppercase">
            font-{{ name }} · {{ value }}
          </span>
        </button>
      </div>
    </section>
  </div>
</template>
