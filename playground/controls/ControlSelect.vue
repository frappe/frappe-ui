<template>
  <!-- A labelled picker: the current value and a chevron, opening a menu of
       the choices. -->
  <Dropdown :options="menu" align="end">
    <template #default="{ open }">
      <button
        type="button"
        class="flex h-12 w-full shrink-0 items-center justify-between gap-4 rounded-6 border border-outline-gray-1 px-4 text-left outline-none transition-colors hover:bg-surface-gray-1 focus-visible:focus-ring"
        :class="open && 'bg-surface-gray-1'"
      >
        <span class="text-base text-ink-gray-6">{{ label }}</span>
        <span class="flex items-center gap-2 text-base-medium text-ink-gray-8">
          {{ current }}
          <EIcon name="small-down" class="size-4 text-ink-gray-6" />
        </span>
      </button>
    </template>
  </Dropdown>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Dropdown } from '../../src'
import EIcon from '../espresso-sidebar/EIcon.vue'

const props = defineProps<{
  label: string
  options: { label: string; value: string }[]
}>()

const model = defineModel<string>({ required: true })

const current = computed(
  () => props.options.find((o) => o.value === model.value)?.label,
)

const menu = computed(() =>
  props.options.map((o) => ({
    label: o.label,
    onClick: () => (model.value = o.value),
  })),
)
</script>
