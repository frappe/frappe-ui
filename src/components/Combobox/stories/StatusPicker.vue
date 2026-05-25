<script setup lang="ts">
import { computed, ref } from 'vue'
import { Combobox } from 'frappe-ui'

type StatusOption = {
  label: string
  value: string
  color: string
  description: string
}

const value = ref<string>('in-progress')

const statuses: StatusOption[] = [
  {
    label: 'Backlog',
    value: 'backlog',
    color: 'bg-gray-400',
    description: 'Ideas and future work',
  },
  {
    label: 'Todo',
    value: 'todo',
    color: 'bg-gray-500',
    description: 'Ready to be picked up',
  },
  {
    label: 'In Progress',
    value: 'in-progress',
    color: 'bg-blue-500',
    description: 'Actively being worked on',
  },
  {
    label: 'In Review',
    value: 'in-review',
    color: 'bg-yellow-500',
    description: 'Awaiting feedback',
  },
  {
    label: 'Done',
    value: 'done',
    color: 'bg-green-500',
    description: 'Shipped and verified',
  },
  {
    label: 'Cancelled',
    value: 'cancelled',
    color: 'bg-gray-300',
    description: 'Will not be worked on',
  },
]

const selected = computed(
  () => statuses.find((s) => s.value === value.value) ?? null,
)
</script>

<template>
  <div class="grid gap-3">
    <Combobox
      v-model="value"
      :options="statuses"
      placeholder="Set status"
      open-on-focus
      class="w-72"
    >
      <template #prefix>
        <span
          v-if="selected"
          :class="['size-2 rounded-full', selected.color]"
          aria-hidden="true"
        />
      </template>

      <!--
        The dot is rendered inside the label region so it aligns with the
        first line of text (not the vertical center of a two-line row).
      -->
      <template #item-label="{ item }">
        <div class="flex items-start gap-2">
          <span
            :class="[
              'mt-[4px] size-2 shrink-0 rounded-full',
              (item as StatusOption).color,
            ]"
            aria-hidden="true"
          />
          <div class="min-w-0">
            <div class="truncate">{{ item.label }}</div>
            <div class="truncate text-p-sm text-ink-gray-5">
              {{ (item as StatusOption).description }}
            </div>
          </div>
        </div>
      </template>
    </Combobox>
  </div>
</template>
