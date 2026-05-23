<script setup lang="ts">
import { computed, ref } from 'vue'
import { Badge, Switch, TabButtons } from 'frappe-ui'

const label = ref('Gamma')
const theme = ref<'gray' | 'blue' | 'green' | 'amber' | 'red' | 'violet'>(
  'green',
)
const variant = ref<'solid' | 'subtle' | 'outline' | 'ghost'>('solid')
const size = ref<'sm' | 'md' | 'lg'>('lg')
const prefix = ref(true)
const suffix = ref(false)

const variantButtons = [
  { label: 'solid', value: 'solid' },
  { label: 'subtle', value: 'subtle' },
  { label: 'outline', value: 'outline' },
  { label: 'ghost', value: 'ghost' },
]
const themeButtons = [
  { label: 'gray', value: 'gray' },
  { label: 'blue', value: 'blue' },
  { label: 'green', value: 'green' },
  { label: 'amber', value: 'amber' },
  { label: 'red', value: 'red' },
  { label: 'violet', value: 'violet' },
]
const sizeButtons = [
  { label: 'sm', value: 'sm' },
  { label: 'md', value: 'md' },
  { label: 'lg', value: 'lg' },
]

const code = computed(() => {
  const attrs: string[] = [
    `variant="${variant.value}"`,
    `theme="${theme.value}"`,
    `size="${size.value}"`,
  ]
  const slots: string[] = []
  if (prefix.value) {
    slots.push('  <template #prefix><span class="lucide-check" /></template>')
  }
  slots.push(`  ${label.value}`)
  if (suffix.value) {
    slots.push(
      '  <template #suffix><span class="lucide-chevron-down" /></template>',
    )
  }

  return [
    '<Badge',
    ...attrs.map((a) => '  ' + a),
    '>',
    ...slots,
    '</Badge>',
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
        <Badge :theme="theme" :variant="variant" :size="size">
          <template v-if="prefix" #prefix>
            <span class="lucide-check" />
          </template>
          {{ label }}
          <template v-if="suffix" #suffix>
            <span class="lucide-chevron-down" />
          </template>
        </Badge>
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
          <TabButtons v-model="variant" :buttons="variantButtons" />
        </div>
        <div class="knob-row">
          <span class="knob-label">theme</span>
          <TabButtons v-model="theme" :buttons="themeButtons" />
        </div>
        <div class="knob-row">
          <span class="knob-label">size</span>
          <TabButtons v-model="size" :buttons="sizeButtons" />
        </div>
        <div class="flex flex-wrap items-center gap-6">
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
