<script setup lang="ts">
// Figma: espresso-2.0 › popover (31845:36005). The colour picker's card:
// 8px in, two sections 16 apart, each a 13px gray-500 label, 8, then the
// swatches — 24px, 6 apart, on an 8px radius, ruled in the colour's tint.
// A text swatch is white with the A in the colour; a background swatch is
// the colour's wash. The colours are the editor's own named palette, so a
// pick writes the same mark the library's picker would; Default unsets it.
import { toRaw } from 'vue'
import { PALETTE_COLORS } from '../../../src/molecules/editor/extensions/shared/color-palette'
import { useNamedColorState } from '../../../src/molecules/editor/composables/useNamedColorState'
import type { TiptapEditor } from '../../../src/molecules/editor'

const props = defineProps<{ editor: TiptapEditor }>()
const emit = defineEmits<{ pick: [] }>()

// the raw editor for commands: the proxied one throws on a transaction
const { activeTextColor, activeHighlightColor, setText, setHighlight } =
  useNamedColorState(toRaw(props.editor))

// the palette's names are the token hues, but for indigo, which has no
// token of its own and is drawn in violet, as the editor draws it
const hue = (name: string) => (name === 'indigo' ? 'violet' : name)
const label = (name: string) => name.charAt(0).toUpperCase() + name.slice(1)

type Swatch = {
  value: string | null
  label: string
  style?: Record<string, string>
}
const swatches: Swatch[] = [
  { value: null, label: 'Default' },
  ...PALETTE_COLORS.map((c) => ({
    value: c.name,
    label: label(c.name),
    // light and dark handed over as a pair; the stylesheet picks by theme
    style: {
      '--sw-ink': `var(--${hue(c.name)}-600)`,
      '--sw-line': `var(--${hue(c.name)}-200)`,
      '--sw-fill': `var(--${hue(c.name)}-50)`,
      '--sw-ink-dark': `var(--dark-${hue(c.name)}-400)`,
      '--sw-line-dark': `var(--dark-${hue(c.name)}-700)`,
      '--sw-fill-dark': `var(--dark-${hue(c.name)}-900)`,
    },
  })),
]

function pickText(value: string | null) {
  setText(value)
  emit('pick')
}
function pickHighlight(value: string | null) {
  setHighlight(value)
  emit('pick')
}
</script>

<template>
  <div
    class="rte-colors flex w-[190px] flex-col gap-4 rounded-6 border border-outline-gray-1 bg-surface-elevation-2 p-2 shadow-lg"
    role="group"
    aria-label="Text and background colour"
  >
    <section class="flex flex-col gap-2">
      <div class="text-sm leading-[15px] text-ink-gray-5">Text color</div>
      <div class="grid grid-cols-6 gap-1.5">
        <button
          v-for="s in swatches"
          :key="s.label"
          type="button"
          class="rte-swatch rte-swatch-text"
          :style="s.style"
          :aria-label="s.label"
          :title="s.label"
          :aria-pressed="s.value === activeTextColor"
          @click="pickText(s.value)"
        >
          A
        </button>
      </div>
    </section>
    <section class="flex flex-col gap-2">
      <div class="text-sm leading-[15px] text-ink-gray-5">Background color</div>
      <div class="grid grid-cols-6 gap-1.5">
        <button
          v-for="s in swatches"
          :key="s.label"
          type="button"
          class="rte-swatch rte-swatch-fill"
          :style="s.style"
          :aria-label="s.label"
          :title="s.label"
          :aria-pressed="s.value === activeHighlightColor"
          @click="pickHighlight(s.value)"
        />
      </div>
    </section>
  </div>
</template>

<style>
/* a swatch: the file's 24px outline button — white, ruled in the colour's
   tint, an 8px radius — and, for a background, filled with its wash.
   Default has no colour: the ink is the text's own, the rule the hairline. */
.rte-swatch {
  --sw-ink: var(--ink-gray-9);
  --sw-line: var(--outline-gray-2);
  --sw-fill: var(--surface-elevation-2);
  @apply flex size-6 items-center justify-center rounded-4 border bg-surface-elevation-2 text-base leading-none transition-shadow;
  color: var(--sw-ink);
  border-color: var(--sw-line);
}
.rte-swatch-fill {
  background-color: var(--sw-fill);
}
.rte-swatch:hover,
.rte-swatch:focus-visible {
  box-shadow: 0 0 0 1px var(--sw-line);
  outline: none;
}
.rte-swatch[aria-pressed='true'] {
  box-shadow: 0 0 0 2px var(--outline-gray-3);
}
[data-theme='dark'] .rte-swatch {
  color: var(--sw-ink-dark, var(--sw-ink));
  border-color: var(--sw-line-dark, var(--sw-line));
}
[data-theme='dark'] .rte-swatch-fill {
  background-color: var(--sw-fill-dark, var(--sw-fill));
}
</style>
