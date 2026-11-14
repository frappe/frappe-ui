<script setup lang="ts">
import { computed, reactive, ref, shallowRef, watchEffect } from 'vue'
import { Button, Select, Switch, TabButtons, TextInput } from 'frappe-ui'

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
    previewMinHeight: '260px',
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

// The control column is only about 136px wide. Tab pills don't shrink below
// their label, so a group wider than that overflows the card instead of
// fitting. Estimate the rendered width (≈7px per character plus pill padding
// and gaps) and fall back to a Select past it, matching the design's compact
// dropdowns for anything longer than a short two- or three-way choice.
const fitsAsTabs = (options: KnobOption[]) => {
  if (options.length > 3) return false
  const pills = options.reduce((w, o) => w + o.label.length * 7 + 16, 0)
  const gaps = 4 + (options.length - 1) * 4
  return pills + gaps <= 132
}

function setNumber(name: string, raw: string) {
  const n = raw === '' ? null : Number(raw)
  values[name] = n === null || Number.isFinite(n) ? n : values[name]
}

const generatedCode = computed(() => props.code(values))

// The playground opens with its code visible; the toggle still hides it.
const showCode = ref(true)

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
  if (!showCode.value) return
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
    <div class="flex flex-col gap-1.5 rounded-[20px] bg-surface-gray-1 p-1.5">
      <!-- Preview and controls share one card, split by a subtle divider. -->
      <div
        class="play-card flex flex-col overflow-hidden rounded-[14px] bg-surface-base lg:flex-row lg:items-stretch"
      >
        <!-- Preview -->
        <div
          class="flex min-w-0 flex-1 items-center justify-center overflow-auto p-8 scrollbar"
          :style="{ minHeight: previewMinHeight }"
        >
          <slot name="preview" :values="values" />
        </div>

        <!-- Controls: prop name on top, input below. -->
        <div
          class="flex flex-col gap-4 border-t border-outline-gray-1 p-3 lg:w-64 lg:border-l lg:border-t-0"
        >
          <div
            v-for="knob in rowKnobs"
            :key="knob.name"
            class="flex flex-col gap-1.5"
          >
            <span class="knob-label">{{ knob.name }}</span>
            <div class="w-full">
              <TextInput
                v-if="knob.type === 'text'"
                v-model="values[knob.name]"
                :aria-label="knob.name"
                :placeholder="knob.name"
                size="sm"
              />
              <TextInput
                v-else-if="knob.type === 'number'"
                type="number"
                :model-value="values[knob.name] ?? ''"
                :aria-label="knob.name"
                :min="knob.min"
                :max="knob.max"
                :step="knob.step"
                size="sm"
                @update:model-value="setNumber(knob.name, $event)"
              />
              <TabButtons
                v-else-if="knob.type === 'tabs' && fitsAsTabs(knob.options)"
                v-model="values[knob.name]"
                :options="knob.options"
                class="w-full [&_button]:flex-1"
              />
              <Select
                v-else-if="knob.type === 'tabs'"
                v-model="values[knob.name]"
                :aria-label="knob.name"
                :options="knob.options"
                class="w-full"
                size="sm"
              />
            </div>
          </div>

          <div
            v-if="switchKnobs.length"
            class="flex flex-col gap-2 border-t border-outline-gray-1 pt-2"
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

      <!-- Show code toggle (with an inline copy button once open) + panel -->
      <div class="flex flex-col">
        <div class="flex items-center justify-between">
          <Button
            variant="ghost"
            :aria-expanded="showCode"
            @click="showCode = !showCode"
          >
            <template #prefix>
              <span
                class="lucide-chevron-right size-4 transition-transform"
                :class="{ 'rotate-90': showCode }"
                aria-hidden="true"
              />
            </template>
            {{ showCode ? 'Hide code' : 'Show code' }}
          </Button>

          <Button
            v-if="showCode"
            variant="ghost"
            :aria-label="copied ? 'Copied' : 'Copy code'"
            @click="onCopy"
          >
            <template #icon>
              <span
                class="size-4"
                :class="copied ? 'lucide-check' : 'lucide-clipboard'"
                aria-hidden="true"
              />
            </template>
          </Button>
        </div>

        <div v-if="showCode" class="component-preview-code relative">
          <div v-if="highlightedCode" v-html="highlightedCode" />
          <pre v-else class="shiki"><code>{{ generatedCode }}</code></pre>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.knob-label {
  /* These are the component's props, so render them as prop names: monospace
     and lowercase, not title-cased form labels. */
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 13px;
  color: var(--p-color-ink-gray-6, #525252);
}
</style>
