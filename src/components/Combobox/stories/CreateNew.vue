<script setup lang="ts">
import { computed, ref } from 'vue'
import { Combobox } from 'frappe-ui'

const value = ref<string>('')
const tags = ref<string[]>(['bug', 'enhancement', 'docs', 'discussion'])

const selectableOptions = computed(() =>
  tags.value.map((t) => ({ label: t, value: t })),
)

// "Create new" is just a `type: 'custom'` row. `condition` is authoritative
// — it runs even before the user types, so the row can decide for itself
// when to appear based on the typed query and current selection.
const options = computed(() => [
  ...selectableOptions.value,
  {
    type: 'custom' as const,
    key: 'create',
    label: 'Create tag',
    slot: 'create',
    keepOpen: false,
    condition: ({ query }: { query: string }) => {
      const q = query.trim().toLowerCase()
      if (!q) return false
      if (q === value.value?.toLowerCase()) return false
      return !tags.value.some((t) => t.toLowerCase() === q)
    },
    onClick: ({ query }: { query: string }) => {
      const next = query.trim()
      if (!next) return
      tags.value = [...tags.value, next]
      value.value = next
    },
  },
])

function getBgClass(item: { label: string }) {
  const palette = [
    'bg-surface-amber-3',
    'bg-surface-blue-3',
    'bg-surface-green-3',
    'bg-surface-gray-3',
  ]
  const hash = item.label
    .toLowerCase()
    .split('')
    .reduce((a, b) => a + b.charCodeAt(0), 0)
  return palette[hash % palette.length]
}
</script>

<template>
  <div class="grid gap-3 shrink-0">
    <Combobox
      v-model="value"
      :options="options"
      placeholder="Search or create a tag"
      open-on-focus
      class="w-64"
    >
      <template #item-prefix="{ item }">
        <span
          v-if="item.key !== 'create'"
          :class="getBgClass(item)"
          class="size-3 rounded-sm"
        />
        <span
          v-if="item.key === 'create'"
          class="rounded-sm bg-surface-gray-8 lucide-tag"
        />
      </template>
      <template #item-create="{ query }">
        <div class="flex">
          <span class="truncate">
            Create
            <span v-if="query" class="font-medium text-ink-gray-8">
              {{ query }}
            </span>
          </span>
        </div>
      </template>
    </Combobox>

    <div class="text-sm text-ink-gray-5">
      Selected: <code class="text-ink-gray-7">{{ value || 'None' }}</code>
    </div>
    <div class="text-sm text-ink-gray-5">
      Tags: <code class="text-ink-gray-7">{{ tags.join(', ') }}</code>
    </div>
  </div>
</template>
