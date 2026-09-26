<script setup lang="ts">
import { computed, reactive, ref, shallowRef, watchEffect } from 'vue'
import { Select, Switch, TabButtons, TextInput } from 'frappe-ui'

export type KnobOption = { label: string; value: string }
type VisibleWhen = (values: Record<string, any>) => boolean
export type Knob =
  | {
      name: string
      type: 'text'
      default: string
      visibleWhen?: VisibleWhen
    }
  | {
      name: string
      // Renders `<input type="number">`, so ArrowUp/ArrowDown step the
      // value. The value is a number, or `null` while the input is empty.
      type: 'number'
      default: number | null
      min?: number
      max?: number
      step?: number
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
    (k) => k.type !== 'switch' && (k.visibleWhen?.(values) ?? true),
  ),
)
const switchKnobs = props.knobs.filter((k) => k.type === 'switch') as Extract<
  Knob,
  { type: 'switch' }
>[]

// The knob column is narrow. Tab buttons whose labels run past about 24
// characters would overflow it, so those knobs render as a Select.
const fitsAsTabs = (options: KnobOption[]) =>
  options.reduce((n, o) => n + o.label.length, 0) <= 24

function setNumber(name: string, raw: string) {
  const n = raw === '' ? null : Number(raw)
  values[name] = n === null || Number.isFinite(n) ? n : values[name]
}

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
      class="overflow-hidden rounded-7 border border-outline-gray-1 divide-y divide-outline-gray-1"
    >
      <div
        class="grid divide-y divide-outline-gray-1 lg:grid-cols-[minmax(0,1fr)_17rem] lg:divide-x lg:divide-y-0"
      >
        <div
          class="flex min-w-0 items-center justify-center overflow-auto bg-surface-base p-8 dot-grid"
          :style="{ minHeight: previewMinHeight }"
        >
          <slot name="preview" :values="values" />
        </div>

        <!-- Knobs stacked in a column beside the preview, label above control. -->
        <div class="flex flex-col gap-4 bg-surface-base p-4">
          <div
            v-for="knob in rowKnobs"
            :key="knob.name"
            class="flex flex-col gap-1.5"
          >
            <span class="knob-label">{{ knob.name }}</span>
            <TextInput
              v-if="knob.type === 'text'"
              v-model="values[knob.name]"
              :aria-label="knob.name"
              variant="outline"
            />
            <TextInput
              v-else-if="knob.type === 'number'"
              type="number"
              :model-value="values[knob.name] ?? ''"
              :aria-label="knob.name"
              :min="knob.min"
              :max="knob.max"
              :step="knob.step"
              variant="outline"
              @update:model-value="setNumber(knob.name, $event)"
            />
            <TabButtons
              v-else-if="knob.type === 'tabs' && fitsAsTabs(knob.options)"
              v-model="values[knob.name]"
              :options="knob.options"
            />
            <Select
              v-else-if="knob.type === 'tabs'"
              v-model="values[knob.name]"
              :aria-label="knob.name"
              :options="knob.options"
              variant="outline"
            />
          </div>
          <div
            v-if="switchKnobs.length"
            class="flex flex-col gap-2.5 border-t border-outline-gray-1 pt-4"
          >
            <!-- A <label> forwards clicks on the name to the switch inside it. -->
            <label
              v-for="knob in switchKnobs"
              :key="knob.name"
              class="flex items-center justify-between gap-4"
              :class="
                knob.disabledWhen?.(values) ? 'opacity-60' : 'cursor-pointer'
              "
            >
              <span class="knob-label">{{ knob.name }}</span>
              <Switch
                v-model="values[knob.name]"
                :disabled="knob.disabledWhen?.(values) ?? false"
              />
            </label>
          </div>
        </div>
      </div>

      <div class="component-preview-code relative">
        <div v-if="highlightedCode" v-html="highlightedCode" />
        <pre v-else class="shiki"><code>{{ generatedCode }}</code></pre>
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
.knob-label {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 13px;
  color: var(--p-color-ink-gray-6, #7c7c7c);
}
.dot-grid {
  /* Black dots vanish on the dark surface, so flip to light ones — the docs
     stamp `data-theme` on <html> (see useColorScheme). */
  --dot-color: rgba(0, 0, 0, 0.08);
  background-image: radial-gradient(
    circle,
    var(--dot-color) 1px,
    transparent 1px
  );
  background-size: 14px 14px;
}
[data-theme='dark'] .dot-grid {
  --dot-color: rgba(255, 255, 255, 0.09);
}
</style>
