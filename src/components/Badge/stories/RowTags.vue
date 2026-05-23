<script setup>
import { Badge } from 'frappe-ui'
</script>

<template>
  <div class="flex w-full max-w-[640px] flex-col divide-y divide-outline-gray-1">
    <div class="flex items-center gap-3 py-2.5">
      <span class="lucide-circle size-4 text-ink-gray-4" aria-hidden="true" />
      <span class="flex-1 text-base text-ink-gray-8">
        Hyper-verge landing page
      </span>
      <div class="flex items-center gap-1.5">
        <Badge theme="green">App</Badge>
        <Badge theme="amber">Frappe</Badge>
        <Badge>+2</Badge>
      </div>
      <Badge theme="red">
        <template #prefix>
          <span class="lucide-calendar" aria-hidden="true" />
        </template>
        23 Feb
      </Badge>
    </div>
    <div class="flex items-center gap-3 py-2.5">
      <span class="lucide-circle size-4 text-ink-gray-4" aria-hidden="true" />
      <span class="flex-1 text-base text-ink-gray-8">Client feedback</span>
      <div class="flex items-center gap-1.5">
        <Badge theme="red">Opensource</Badge>
        <Badge>+3</Badge>
      </div>
      <Badge theme="red">
        <template #prefix>
          <span class="lucide-calendar" aria-hidden="true" />
        </template>
        28 Feb
      </Badge>
    </div>
  </div>
</template>
