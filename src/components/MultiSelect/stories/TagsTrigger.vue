<script setup lang="ts">
import { ref } from 'vue'
import { Badge, MultiSelect, type BadgeProps } from 'frappe-ui'

type Tag = {
  label: string
  value: string
  // Derived from Badge, never hand-written. A copied union is how the
  // deprecated `orange` theme outlived the ADR-0008 sweep: nothing failed when
  // the real union changed. Note `tsconfig.app.json` excludes `stories/**`, so
  // this does not fail CI today — it fails in the editor, and it fails the
  // moment stories join the type-check program.
  theme: BadgeProps['theme']
}

const tags = ref<string[]>(['bug', 'p0'])

const tagOptions: Tag[] = [
  { label: 'Bug', value: 'bug', theme: 'red' },
  { label: 'Feature', value: 'feature', theme: 'blue' },
  { label: 'Enhancement', value: 'enhancement', theme: 'green' },
  { label: 'P0', value: 'p0', theme: 'red' },
  { label: 'P1', value: 'p1', theme: 'amber' },
  { label: 'P2', value: 'p2', theme: 'gray' },
  { label: 'Frontend', value: 'frontend', theme: 'blue' },
  { label: 'Backend', value: 'backend', theme: 'gray' },
  { label: 'Docs', value: 'docs', theme: 'green' },
]

function removeTag(value: string | number) {
  tags.value = tags.value.filter((v) => v !== value)
}
</script>

<template>
  <MultiSelect v-model="tags" :options="tagOptions">
    <template #trigger="{ open, selectedOptions, setOpen }">
      <button
        type="button"
        :data-state="open ? 'open' : 'closed'"
        class="flex w-96 min-h-8 cursor-pointer items-center gap-1.5 rounded-4 border border-[--surface-gray-2] px-1.5 py-1 text-left transition-colors hover:border-outline-elevation-2 data-[state=open]:focus-ring"
        @click="setOpen(!open)"
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
                class="-mr-0.5 inline-flex cursor-pointer items-center justify-center rounded-1 p-0.5 opacity-70 hover:opacity-100"
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
