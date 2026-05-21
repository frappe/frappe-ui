<script setup lang="ts">
import { ref } from 'vue'
import { Badge, MultiSelect } from 'frappe-ui'

type Tag = {
  label: string
  value: string
  theme: 'gray' | 'blue' | 'green' | 'orange' | 'red'
}

const tags = ref<string[]>(['bug', 'p0'])

const tagOptions: Tag[] = [
  { label: 'Bug', value: 'bug', theme: 'red' },
  { label: 'Feature', value: 'feature', theme: 'blue' },
  { label: 'Enhancement', value: 'enhancement', theme: 'green' },
  { label: 'P0', value: 'p0', theme: 'red' },
  { label: 'P1', value: 'p1', theme: 'orange' },
  { label: 'P2', value: 'p2', theme: 'gray' },
  { label: 'Frontend', value: 'frontend', theme: 'blue' },
  { label: 'Backend', value: 'backend', theme: 'gray' },
  { label: 'Docs', value: 'docs', theme: 'green' },
]

function removeTag(value: string) {
  tags.value = tags.value.filter((v) => v !== value)
}
</script>

<template>
  <MultiSelect v-model="tags" :options="tagOptions">
    <template #trigger="{ open, selectedOptions, toggleOpen }">
      <button
        type="button"
        :data-state="open ? 'open' : 'closed'"
        class="flex w-96 min-h-8 cursor-pointer items-center gap-1.5 rounded border border-[--surface-gray-2] px-1.5 py-1 text-left outline-none transition-colors hover:border-outline-gray-modals focus-visible:ring-2 data-[state=open]:ring-2 ring-outline-gray-3"
        @click="toggleOpen"
      >
        <div class="flex min-w-0 flex-1 flex-wrap items-center gap-1">
          <Badge
            v-for="option in selectedOptions"
            :key="option.value"
            :theme="(option as Tag).theme"
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
            Add tags…
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
