<script setup lang="ts">
import { computed, ref } from 'vue'
import { Pill, Switch, TabButtons } from 'frappe-ui'

const label = ref('Tab')
const variant = ref<'default' | 'outline' | 'underline' | 'browser-tab'>(
  'default',
)
const size = ref<'sm' | 'md'>('sm')
const active = ref(true)
const prefix = ref(false)
const suffix = ref(false)

const variantButtons = [
  { label: 'default', value: 'default' },
  { label: 'outline', value: 'outline' },
  { label: 'underline', value: 'underline' },
  { label: 'browser-tab', value: 'browser-tab' },
]
const sizeButtons = [
  { label: 'sm', value: 'sm' },
  { label: 'md', value: 'md' },
]

const browserTabBase = computed(() =>
  variant.value === 'browser-tab' ? 'default' : 'none',
)

const code = computed(() => {
  const attrs = [`label="${label.value}"`, `variant="${variant.value}"`]
  if (size.value !== 'md') attrs.push(`size="${size.value}"`)
  if (active.value) attrs.push('active')
  if (variant.value === 'browser-tab') attrs.push('browser-tab-base="default"')

  const slots: string[] = []
  if (prefix.value) {
    slots.push('  <template #prefix><span class="lucide-star" /></template>')
  }
  if (suffix.value) {
    slots.push('  <template #suffix><span>14</span></template>')
  }

  if (!slots.length) {
    return ['<Pill', ...attrs.map((attr) => `  ${attr}`), '/>'].join('\n')
  }

  return [
    '<Pill',
    ...attrs.map((attr) => `  ${attr}`),
    '>',
    ...slots,
    '</Pill>',
  ].join('\n')
})

const copied = ref(false)
function onCopy() {
  navigator.clipboard?.writeText(code.value)
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
        class="flex min-h-[200px] items-center justify-center bg-surface-white p-8 dot-grid"
      >
        <div
          class="p-0"
          :class="
            variant === 'underline' || variant === 'browser-tab'
              ? 'border-b border-outline-gray-2'
              : ''
          "
        >
          <Pill
            :label="label"
            :variant="variant"
            :size="size"
            :active="active"
            :browser-tab-base="browserTabBase"
          >
            <template v-if="prefix" #prefix>
              <span class="lucide-star size-4 shrink-0" aria-hidden="true" />
            </template>
            <template v-if="suffix" #suffix>
              <span
                class="rounded-full bg-surface-gray-2 px-1.5 text-xs text-ink-gray-7"
                >14</span
              >
            </template>
          </Pill>
        </div>
      </div>

      <div class="flex flex-col gap-3 bg-surface-gray-1 p-4">
        <div class="knob-row">
          <span class="knob-label">label</span>
          <input
            v-model="label"
            type="text"
            class="h-7 w-40 rounded-md border border-outline-gray-2 bg-surface-white px-2 text-sm text-ink-gray-8 focus:border-outline-gray-3 focus:outline-none"
          />
        </div>
        <div class="knob-row">
          <span class="knob-label">variant</span>
          <TabButtons v-model="variant" :options="variantButtons" />
        </div>
        <div class="knob-row">
          <span class="knob-label">size</span>
          <TabButtons v-model="size" :options="sizeButtons" />
        </div>
        <div class="flex flex-wrap items-center gap-6">
          <div class="flex items-center gap-2">
            <span class="knob-label">active</span>
            <Switch v-model="active" />
          </div>
          <div class="flex items-center gap-2">
            <span class="knob-label">prefix</span>
            <Switch v-model="prefix" />
          </div>
          <div class="flex items-center gap-2">
            <span class="knob-label">suffix</span>
            <Switch v-model="suffix" />
          </div>
        </div>
      </div>

      <div class="bg-surface-gray-1">
        <div
          class="flex items-center justify-between border-b border-outline-gray-1 px-4"
        >
          <div
            class="-mb-px border-b border-ink-gray-8 py-2 text-sm font-medium text-ink-gray-8"
          >
            vue
          </div>
          <button
            type="button"
            class="inline-flex h-7 items-center gap-1.5 rounded-1 px-2 text-xs text-ink-gray-6 transition-colors hover:bg-surface-gray-2 hover:text-ink-gray-8"
            :aria-label="copied ? 'Copied' : 'Copy code'"
            @click="onCopy"
          >
            <span
              :class="copied ? 'lucide-check' : 'lucide-copy'"
              class="size-3.5"
              aria-hidden="true"
            />
          </button>
        </div>
        <pre
          class="overflow-x-auto p-4 text-sm leading-relaxed"
        ><code class="font-mono text-ink-gray-8">{{ code }}</code></pre>
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
  min-width: 64px;
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
