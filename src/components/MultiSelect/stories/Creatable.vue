<script setup lang="ts">
import { ref } from 'vue'
import { Badge, MultiSelect } from 'frappe-ui'

type Tag = {
  label: string
  value: string
}

const tags = ref<string[]>(['bug'])

const tagOptions = ref<Tag[]>([
  { label: 'Bug', value: 'bug' },
  { label: 'Feature', value: 'feature' },
  { label: 'Enhancement', value: 'enhancement' },
  { label: 'Docs', value: 'docs' },
])

// Host-driven create: validate the query, then commit it into BOTH the
// options list (so the new chip resolves to a label) and the model. The
// MultiSelect never mutates its own value — it only emits `@create`.
function onCreate(query: string) {
  const label = query.trim()
  if (!label) return

  const value = label.toLowerCase()
  const exists = tagOptions.value.some((option) => option.value === value)
  if (!exists) tagOptions.value.push({ label, value })

  if (!tags.value.includes(value)) tags.value = [...tags.value, value]
}

function removeTag(value: string) {
  tags.value = tags.value.filter((v) => v !== value)
}
</script>

<template>
  <MultiSelect
    v-model="tags"
    :options="tagOptions"
    creatable
    @create="onCreate"
  >
    <template #trigger="{ open, selectedOptions, toggleOpen }">
      <button
        type="button"
        :data-state="open ? 'open' : 'closed'"
        class="flex w-96 min-h-8 cursor-pointer items-center gap-1.5 rounded border border-outline-gray-2 px-1.5 py-1 text-left outline-none transition-colors hover:border-outline-gray-modals focus-visible:ring-2 data-[state=open]:ring-2 ring-outline-gray-3"
        @click="toggleOpen"
      >
        <div class="flex min-w-0 flex-1 flex-wrap items-center gap-1">
          <Badge
            v-for="option in selectedOptions"
            :key="option.value"
            theme="gray"
            size="md"
          >
            {{ option.label }}
            <template #suffix>
              <span
                role="button"
                tabindex="-1"
                class="-mr-0.5 inline-flex cursor-pointer items-center justify-center rounded-sm p-0.5 opacity-70 hover:opacity-100"
                @click.stop="removeTag(option.value)"
                @pointerdown.stop
              >
                <span class="lucide-x size-3" />
              </span>
            </template>
          </Badge>

          <span
            v-if="!selectedOptions.length"
            class="px-1 text-base text-ink-gray-4"
          >
            Add or create tags…
          </span>
        </div>

        <span
          :class="[
            'lucide-chevron-down size-4 shrink-0 text-ink-gray-4 transition-transform',
            open && 'rotate-180',
          ]"
        />
      </button>
    </template>
  </MultiSelect>
</template>
