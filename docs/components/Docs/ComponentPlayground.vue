<script setup lang="ts">
import { computed, reactive, ref, shallowRef, watchEffect } from 'vue'
import { Switch, TabButtons } from 'frappe-ui'

export type KnobOption = { label: string; value: string }
type VisibleWhen = (values: Record<string, any>) => boolean
export type Knob =
  | {
      name: string
      type: 'text'
      default: string
      width?: string
      visibleWhen?: VisibleWhen
    }
  | {
      name: string
      type: 'tabs'
      options: KnobOption[]
      default: string
      visibleWhen?: VisibleWhen
    }
  | {
      name: string
      type: 'switch'
      default: boolean
      disabledWhen?: (values: Record<string, any>) => boolean
    }

const props = withDefaults(
  defineProps<{
    knobs: Knob[]
    code: (values: Record<string, any>) => string
    previewMinHeight?: string
  }>(),
  {
    previewMinHeight: '200px',
  },
)

const values = reactive<Record<string, any>>(
  Object.fromEntries(props.knobs.map((k) => [k.name, k.default])),
)

const rowKnobs = computed(() =>
  props.knobs.filter(
    (k) =>
      (k.type === 'text' || k.type === 'tabs') &&
      (k.visibleWhen?.(values) ?? true),
  ),
)
const switchKnobs = props.knobs.filter((k) => k.type === 'switch') as Extract<
  Knob,
  { type: 'switch' }
>[]

const generatedCode = computed(() => props.code(values))

const highlighter = shallowRef<any>(null)
let highlighterPromise: Promise<any> | null = null
function ensureHighlighter() {
  if (highlighter.value) return
  if (!highlighterPromise) {
    highlighterPromise = import('shiki').then((shiki) =>
      shiki.createHighlighter({
        themes: ['tokyo-night', 'github-light'],
        langs: ['vue'],
      }),
    )
  }
  highlighterPromise.then((h) => {
    highlighter.value = h
  })
}

const highlightedCode = ref<string | null>(null)
watchEffect(() => {
  if (typeof window === 'undefined') return
  ensureHighlighter()
  const h = highlighter.value
  if (!h) {
    highlightedCode.value = null
    return
  }
  // `defaultColor: false` makes Shiki emit both themes as CSS variables
  // (`--shiki-light` / `--shiki-dark`) with no inline color, so the
  // `[data-theme="dark"] .shiki span` rule in docs/css/style.css can flip
  // tokens at runtime. Without it, the light theme bakes into `style=`
  // attributes and wins over the dark override.
  highlightedCode.value = h.codeToHtml(generatedCode.value, {
    lang: 'vue',
    themes: { light: 'github-light', dark: 'tokyo-night' },
    defaultColor: false,
  })
})

const copied = ref(false)
function onCopy() {
  navigator.clipboard?.writeText(generatedCode.value)
  copied.value = true
  setTimeout(() => (copied.value = false), 1200)
}
</script>

<template>
  <div class="not-prose">
    <div
      class="overflow-hidden rounded-xl border border-outline-gray-1 divide-y divide-outline-gray-1"
    >
      <div
        class="flex items-center justify-center bg-surface-base p-8 dot-grid"
        :style="{ minHeight: previewMinHeight }"
      >
        <slot name="preview" :values="values" />
      </div>

      <div class="flex flex-col gap-3 bg-surface-gray-1 p-4">
        <div v-for="knob in rowKnobs" :key="knob.name" class="knob-row">
          <span class="knob-label">{{ knob.name }}</span>
          <input
            v-if="knob.type === 'text'"
            v-model="values[knob.name]"
            type="text"
            class="h-7 rounded-md border border-outline-gray-2 bg-surface-base px-2 text-sm text-ink-gray-8 focus:border-outline-gray-3 focus:outline-none"
            :style="{ width: knob.width ?? '10rem' }"
          />
          <TabButtons
            v-else-if="knob.type === 'tabs'"
            v-model="values[knob.name]"
            :options="knob.options"
          />
        </div>
        <div v-if="switchKnobs.length" class="flex flex-wrap items-center gap-6">
          <div
            v-for="knob in switchKnobs"
            :key="knob.name"
            class="flex items-center gap-2"
          >
            <span class="knob-label">{{ knob.name }}</span>
            <Switch
              v-model="values[knob.name]"
              :disabled="knob.disabledWhen?.(values) ?? false"
            />
          </div>
        </div>
      </div>

      <div class="component-preview-code relative">
        <div v-if="highlightedCode" v-html="highlightedCode" />
        <pre
          v-else
          class="shiki"
        ><code>{{ generatedCode }}</code></pre>
        <button
          type="button"
          class="copy"
          :class="{ copied }"
          :title="copied ? 'Copied' : 'Copy Code'"
          @click="onCopy"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.knob-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.knob-label {
  display: inline-block;
  width: 96px;
  flex-shrink: 0;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 13px;
  color: var(--p-color-ink-gray-6, #7c7c7c);
}
.dot-grid {
  background-image: radial-gradient(
    circle,
    rgba(0, 0, 0, 0.08) 1px,
    transparent 1px
  );
  background-size: 14px 14px;
}
</style>
