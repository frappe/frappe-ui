<script setup>
import { Pill } from 'frappe-ui'
</script>

<template>
  <div class="flex flex-col gap-5 p-2">
    <div class="flex items-center gap-4">
      <div class="w-12 text-sm text-ink-gray-6">Small</div>
      <Pill size="sm" label="Tab">
        <template #prefix>
          <span class="lucide-star size-4 shrink-0" aria-hidden="true" />
        </template>
      </Pill>
      <Pill size="sm" label="Tab" active>
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
      <Pill size="sm" label="Icon" icon="lucide-star" active />
    </div>

    <div class="flex items-center gap-4">
      <div class="w-12 text-sm text-ink-gray-6">Medium</div>
      <Pill size="md" label="Tab">
        <template #prefix>
          <span class="lucide-star size-[18px] shrink-0" aria-hidden="true" />
        </template>
      </Pill>
      <Pill size="md" label="Tab" active>
        <template #prefix>
          <span class="lucide-star size-[18px] shrink-0" aria-hidden="true" />
        </template>
        <template #suffix>
          <span
            class="rounded-full bg-surface-gray-2 px-1.5 text-xs text-ink-gray-7"
            >14</span
          >
        </template>
      </Pill>
      <Pill size="md" label="Icon" icon="lucide-star" active />
    </div>
  </div>
</template>
