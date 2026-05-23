<script setup>
import { Button } from 'frappe-ui'
</script>

<template>
  <div class="flex w-full max-w-[1100px] items-center gap-8">
    <div class="flex flex-1 items-center gap-1.5">
      <Button>Lead owner</Button>
      <Button icon-right="lucide-chevron-down">Status</Button>
      <Button icon-right="lucide-chevron-down">Organisation</Button>
    </div>
    <div class="flex items-center gap-2">
      <Button icon-left="lucide-eye-off">Columns</Button>
      <Button icon-left="lucide-list-filter">
        Filter
        <template #suffix>
          <span
            class="inline-flex h-4.5 items-center justify-center rounded-1 bg-surface-white px-1.5 text-xs text-ink-gray-7 shadow-sm ring-1 ring-black/5"
          >
            1
          </span>
        </template>
      </Button>
      <Button icon-left="lucide-arrow-up-down">Sort</Button>
      <Button icon="lucide-ellipsis" />
    </div>
  </div>
</template>
