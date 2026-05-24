<script setup lang="ts">
import { computed, ref } from 'vue'
import { Switch, TabButtons } from 'frappe-ui'

const type = ref<'subtle' | 'ghost' | 'underline' | 'browser-tab'>('subtle')
const size = ref<'sm' | 'md'>('sm')
const modelValue = ref('activity')
const vertical = ref(false)
const prefix = ref(false)
const suffix = ref(false)

const typeButtons = [
  { label: 'subtle', value: 'subtle' },
  { label: 'ghost', value: 'ghost' },
  { label: 'underline', value: 'underline' },
  { label: 'browser-tab', value: 'browser-tab' },
]
const sizeButtons = [
  { label: 'sm', value: 'sm' },
  { label: 'md', value: 'md' },
]

const options = [
  { label: 'Overview', value: 'overview' },
  { label: 'Activity', value: 'activity' },
  { label: 'Settings', value: 'settings' },
]

const iconByValue = {
  overview: 'lucide-home',
  activity: 'lucide-activity',
  settings: 'lucide-settings',
}

const countByValue = {
  overview: 8,
  activity: 14,
  settings: 2,
}

const code = computed(() => {
  const attrs = [`v-model="tab"`, `:options="options"`]
  if (type.value !== 'subtle') attrs.push(`type="${type.value}"`)
  if (size.value !== 'sm') attrs.push(`size="${size.value}"`)
  if (vertical.value) attrs.push('vertical')

  const hasSlots = prefix.value || suffix.value

  return [
    '<' + 'script setup>',
    "import { ref } from 'vue'",
    "import { TabButtons } from 'frappe-ui'",
    '',
    "const tab = ref('activity')",
    'const options = [',
    ...options.map(
      (option) => `  { label: '${option.label}', value: '${option.value}' },`,
    ),
    ']',
    '</' + 'script>',
    '',
    '<' + 'template>',
    '  <' + 'TabButtons',
    ...attrs.map((attr) => `    ${attr}`),
    hasSlots ? '  >' : '  />',
    ...(prefix.value
      ? ['    <template #prefix><span class="lucide-star" /></template>']
      : []),
    ...(suffix.value
      ? ['    <template #suffix><span>14</span></template>']
      : []),
    ...(hasSlots ? ['  </TabButtons>'] : []),
    '</' + 'template>',
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
        class="flex min-h-[220px] items-center justify-center bg-surface-white p-8 dot-grid"
      >
        <TabButtons
          v-model="modelValue"
          :options="options"
          :type="type"
          :size="size"
          :vertical="vertical"
        >
          <template v-if="prefix" #prefix="{ button }">
            <span
              :class="iconByValue[button.modelValue]"
              class="size-4 shrink-0"
            />
          </template>
          <template v-if="suffix" #suffix="{ button }">
            <span
              class="rounded-full bg-surface-gray-2 px-1.5 text-xs text-ink-gray-7"
            >
              {{ countByValue[button.modelValue] }}
            </span>
          </template>
        </TabButtons>
      </div>

      <div class="flex flex-col gap-3 bg-surface-gray-1 p-4">
        <div class="knob-row">
          <span class="knob-label">type</span>
          <TabButtons v-model="type" :options="typeButtons" />
        </div>
        <div class="knob-row">
          <span class="knob-label">size</span>
          <TabButtons v-model="size" :options="sizeButtons" />
        </div>
        <div class="flex flex-wrap items-center gap-6">
          <div class="flex items-center gap-2">
            <span class="knob-label">vertical</span>
            <Switch v-model="vertical" />
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
