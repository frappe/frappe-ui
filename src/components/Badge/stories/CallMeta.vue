<script setup>
import { Badge } from 'frappe-ui'
</script>

<template>
  <div class="w-[28rem]">
    <p class="mb-2 text-base-medium text-ink-gray-8">Outbound Call</p>
    <div class="flex flex-wrap items-center gap-1.5">
      <Badge>
        <template #prefix>
          <span class="lucide-calendar" aria-hidden="true" />
        </template>
        May 16, Friday
      </Badge>
      <Badge>
        <template #prefix>
          <span class="lucide-timer" aria-hidden="true" />
        </template>
        32:48
      </Badge>
      <Badge>
        <template #prefix>
          <span class="lucide-play" aria-hidden="true" />
        </template>
        Listen
      </Badge>
      <Badge>
        <template #prefix>
          <span class="lucide-sticky-note" aria-hidden="true" />
        </template>
        Note
      </Badge>
    </div>
  </div>
</template>
