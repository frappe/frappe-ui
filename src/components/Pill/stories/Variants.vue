<script setup>
import { Pill } from 'frappe-ui'

const variants = [
  { label: 'Default', variant: 'default' },
  { label: 'Outline', variant: 'outline' },
  { label: 'Underline', variant: 'underline' },
  { label: 'Browser tab', variant: 'browser-tab', browserTabBase: 'default' },
]
</script>

<template>
  <div class="flex flex-col gap-5 p-2">
    <div
      v-for="item in variants"
      :key="item.variant"
      class="flex items-center gap-6"
    >
      <div class="w-24 text-sm text-ink-gray-6">{{ item.label }}</div>
      <Pill
        label="Tab"
        :variant="item.variant"
        :browser-tab-base="item.browserTabBase"
      >
        <template #prefix>
          <span class="lucide-star size-4 shrink-0" aria-hidden="true" />
        </template>
        <template #suffix>
          <span
            class="rounded-full bg-surface-gray-2 px-1.5 text-xs text-ink-gray-7"
            >14</span
          >
        </template>
      </Pill>
      <Pill
        label="Tab"
        active
        :variant="item.variant"
        :browser-tab-base="item.browserTabBase"
      >
        <template #prefix>
          <span class="lucide-star size-4 shrink-0" aria-hidden="true" />
        </template>
        <template #suffix>
          <span
            class="rounded-full bg-surface-gray-2 px-1.5 text-xs text-ink-gray-7"
            >14</span
          >
        </template>
      </Pill>
    </div>
  </div>
</template>
