<script setup>
import { Button } from 'frappe-ui'
</script>

<template>
  <div
    class="flex w-96 flex-col gap-6 rounded-6 bg-surface-base p-4 shadow-[0px_0px_0.75px_rgba(0,0,0,0.16),0px_2px_2.5px_rgba(0,0,0,0.14)]"
  >
    <div class="flex flex-col gap-5">
      <div class="flex flex-col gap-3">
        <p class="text-lg-semibold text-ink-gray-7">Frappe january - 2023</p>
        <div class="flex flex-col gap-3">
          <div class="flex items-center gap-2 text-base text-ink-gray-7">
            <span class="lucide-calendar size-4" aria-hidden="true" />
            <span>Wed, Dec 27, 2023</span>
          </div>
          <div class="flex items-center gap-2 text-base text-ink-gray-7">
            <span class="lucide-clock size-4" aria-hidden="true" />
            <span>03:45 PM - 04:15 PM (30 min)</span>
          </div>
        </div>
      </div>
      <p class="text-base leading-normal text-ink-gray-7">
        Digital products are more abstract and complex than any product we’v…
      </p>
    </div>
    <div class="flex items-center gap-2">
      <Button class="flex-1">Start</Button>
      <Button variant="solid" class="flex-1" icon-left="lucide-video">
        Join
      </Button>
    </div>
  </div>
</template>
