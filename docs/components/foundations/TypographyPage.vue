<script setup lang="ts">
import { computed, ref } from 'vue'
import { TabButtons } from 'frappe-ui'
import typography from '../../../tailwind/generated/typography.json'

type SizeMeta = {
  lineHeight?: string
  letterSpacing?: string
  fontWeight?: string
}
type SizeEntry = [string, SizeMeta]
type Weight = 'regular' | 'medium' | 'semibold' | 'bold' | 'black'
type TrackGroup = 'text' | 'paragraph'

// Group sizes for the page. Order matters: it drives display order.
const TEXT_KEYS = ['2xs', 'xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl']
const DISPLAY_KEYS = [
  '4xl',
  '5xl',
  '6xl',
  '7xl',
  '8xl',
  '9xl',
  '10xl',
  '11xl',
  '12xl',
]
const PARAGRAPH_KEYS = ['xs', 'sm', 'base', 'lg', 'xl']

// One weight drives the whole page. Regular is the bare `text-<size>` token;
// the rest map to the `text-<size>-<weight>` named styles.
const weight = ref<Weight>('regular')
const weightButtons = [
  { label: 'Regular (420)', value: 'regular' },
  { label: 'Medium (500)', value: 'medium' },
  { label: 'Semibold (600)', value: 'semibold' },
  { label: 'Bold (700)', value: 'bold' },
  { label: 'Black (800)', value: 'black' },
]

const fontWeight = computed(
  () => (typography.fontWeight as Record<Weight, number>)[weight.value],
)

// Resolve the real token class for the current weight, so the sample carries
// the exact `text-<size>-<weight>` utility (inspectable, not inline styles).
// A few weight pairings aren't exported (e.g. base+black), so fall back to the
// bare regular token, which is the only style that ships for them.
function tokenClass(prefix: string, group: TrackGroup, size: string): string {
  if (weight.value === 'regular') return `${prefix}${size}`
  const byWeight = (
    typography.tracking as Record<
      TrackGroup,
      Record<string, Record<string, string>>
    >
  )[group]?.[size]
  return byWeight && weight.value in byWeight
    ? `${prefix}${size}-${weight.value}`
    : `${prefix}${size}`
}

// Figma stores line-height as a px value or a unitless ratio; designers think
// in ratios (lh / size). Normalize both forms to a ratio for the spec column.
function lineHeightRatio(
  size: string,
  lineHeight?: string,
): string | undefined {
  if (!lineHeight) return undefined
  // Already a unitless ratio (e.g. "1.5").
  if (!lineHeight.endsWith('px')) {
    return lineHeight.replace(/\.?0+$/, '')
  }
  const sizePx = parseFloat(size)
  const lhPx = parseFloat(lineHeight)
  if (!sizePx || !lhPx) return undefined
  return (lhPx / sizePx).toFixed(2).replace(/\.?0+$/, '')
}

function entry(key: string) {
  const v = (typography.fontSize as Record<string, SizeEntry>)[key]
  if (!v) return null
  const [size, meta] = v
  return {
    name: key,
    size,
    lhRatio: lineHeightRatio(size, meta?.lineHeight),
  }
}

const text = computed(
  () =>
    TEXT_KEYS.map(entry).filter(Boolean) as NonNullable<
      ReturnType<typeof entry>
    >[],
)
const display = computed(
  () =>
    DISPLAY_KEYS.map(entry).filter(Boolean) as NonNullable<
      ReturnType<typeof entry>
    >[],
)

type Para = Record<string, { lineHeight?: string; letterSpacing?: string }>
const paragraph = computed(
  () =>
    PARAGRAPH_KEYS.map((key) => {
      const base = (typography.fontSize as Record<string, SizeEntry>)[key]
      const p = (typography.paragraph as Para)[key]
      if (!base || !p) return null
      return {
        name: key,
        size: base[0],
        lhRatio: lineHeightRatio(base[0], p.lineHeight),
      }
    }).filter(Boolean) as { name: string; size: string; lhRatio?: string }[],
)

const family = (typography.fontFamily as Record<string, string>).text || 'Inter'

const sample = 'The quick brown fox jumps over the lazy dog'
const displaySample = 'Build something great'
const paragraphSample =
  'Frappe UI uses one type scale across every screen, so the same sizes work in dense tables and on a marketing page without extra CSS.'
</script>

<template>
  <div class="grid gap-14">
    <header class="grid gap-6">
      <div
        class="rounded-xl border border-outline-gray-2 bg-surface-gray-1 px-6 py-5 grid gap-3"
      >
        <div class="flex items-baseline justify-between gap-4">
          <span class="text-xl font-semibold text-ink-gray-8">{{
            family
          }}</span>
        </div>
        <div class="text-3xl text-ink-gray-8 leading-tight">
          AaBbCcDdEe 0123456789
        </div>
      </div>

      <div class="flex items-center gap-3 flex-wrap">
        <TabButtons :buttons="weightButtons" v-model="weight" class="w-fit" />
      </div>
    </header>

    <section class="grid gap-5">
      <div class="grid gap-1">
        <h2 class="text-lg font-semibold text-ink-gray-8 m-0">Text sizes</h2>
        <p class="text-p-sm text-ink-gray-5 m-0">
          Sizes for UI text like labels, controls, table cells, and body copy.
        </p>
      </div>
      <div
        class="grid divide-y divide-outline-gray-1 border-y border-outline-gray-1"
      >
        <div
          v-for="item in text"
          :key="item.name"
          class="flex items-center gap-6 py-4"
        >
          <div class="w-44 shrink-0 grid gap-0.5">
            <span class="text-sm font-mono text-ink-gray-8">
              {{ tokenClass('text-', 'text', item.name) }}
            </span>
            <span class="text-2xs font-mono text-ink-gray-5">
              {{ item.size
              }}<template v-if="item.lhRatio"> · {{ item.lhRatio }}</template>
            </span>
          </div>
          <div
            class="min-w-0 flex-1 truncate text-ink-gray-8"
            :class="tokenClass('text-', 'text', item.name)"
          >
            {{ sample }}
          </div>
        </div>
      </div>
    </section>

    <section class="grid gap-5">
      <div class="grid gap-1">
        <h2 class="text-lg font-semibold text-ink-gray-8 m-0">Display sizes</h2>
        <p class="text-p-sm text-ink-gray-5 m-0">
          Larger sizes for marketing, landing pages, and headings.
        </p>
      </div>
      <div
        class="grid divide-y divide-outline-gray-1 border-y border-outline-gray-1"
      >
        <div
          v-for="item in display"
          :key="item.name"
          class="flex items-center gap-6 py-6 overflow-hidden"
        >
          <div class="w-44 shrink-0 grid gap-0.5">
            <span class="text-sm font-mono text-ink-gray-8">
              {{ tokenClass('text-', 'text', item.name) }}
            </span>
            <span class="text-2xs font-mono text-ink-gray-5">
              {{ item.size
              }}<template v-if="item.lhRatio"> · {{ item.lhRatio }}</template>
            </span>
          </div>
          <div
            class="min-w-0 flex-1 truncate whitespace-nowrap leading-tight text-ink-gray-8"
            :class="tokenClass('text-', 'text', item.name)"
          >
            {{ displaySample }}
          </div>
        </div>
      </div>
    </section>

    <section class="grid gap-5">
      <div class="grid gap-1">
        <h2 class="text-lg font-semibold text-ink-gray-8 m-0">Paragraph</h2>
        <p class="text-p-sm text-ink-gray-5 m-0">
          The <code class="text-ink-gray-8">text-p-*</code> variants use looser
          line-height and tracking for multi-line text.
        </p>
      </div>
      <div
        class="grid divide-y divide-outline-gray-1 border-y border-outline-gray-1"
      >
        <div
          v-for="item in paragraph"
          :key="item.name"
          class="flex items-start gap-6 py-5"
        >
          <div class="w-44 shrink-0 grid gap-0.5 pt-0.5">
            <span class="text-sm font-mono text-ink-gray-8">
              {{ tokenClass('text-p-', 'paragraph', item.name) }}
            </span>
            <span class="text-2xs font-mono text-ink-gray-5">
              {{ item.size
              }}<template v-if="item.lhRatio"> · {{ item.lhRatio }}</template>
            </span>
          </div>
          <div
            class="min-w-0 flex-1 max-w-xl text-ink-gray-7"
            :class="tokenClass('text-p-', 'paragraph', item.name)"
          >
            {{ paragraphSample }}
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
