<script setup lang="ts">
import { Button } from 'frappe-ui'
</script>

<template>
  <div
    class="flex flex-col items-center justify-center gap-3 py-24 text-center"
  >
    <div class="rounded-full bg-surface-gray-2 p-3 text-ink-gray-5">
      <span class="lucide-map-pin-off size-6" aria-hidden="true" />
    </div>
    <p class="text-base text-ink-gray-7">Page not found</p>
    <p class="text-sm text-ink-gray-5">There's nothing at this address.</p>
    <Button class="mt-2" icon-left="lucide-house" label="Go home" route="/" />
  </div>
</template>
