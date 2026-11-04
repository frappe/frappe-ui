<script setup lang="ts">
import { Spinner, Button, Skeleton } from 'frappe-ui'

// Card 1: the same list area on both sides, while it loads.
const listArea =
  'flex h-40 w-60 flex-col gap-4 rounded-6 border border-outline-gray-2 p-4'
</script>

<template>
  <div class="flex flex-col gap-8">
    <!-- 1. A skeleton shaped like the content keeps the layout in place and
         shows what's coming. A lone spinner leaves an empty box, and the
         page jumps when the content lands. -->
    <Guideline
      caption="Use a Skeleton, not a spinner, while page content loads."
    >
      <template #do>
        <div :class="listArea">
          <div v-for="i in 3" :key="i" class="flex items-center gap-3">
            <Skeleton class="size-8 shrink-0 rounded-full" />
            <div class="flex flex-1 flex-col gap-1.5">
              <Skeleton class="h-3 w-3/4" />
              <Skeleton class="h-3 w-1/2" />
            </div>
          </div>
        </div>
      </template>
      <template #dont>
        <div :class="[listArea, 'items-center justify-center']">
          <Spinner theme="gray" size="lg" />
        </div>
      </template>
    </Guideline>

    <!-- 2. Keep the label while loading -->
    <Guideline
      caption="Keep the label while a button loads. Don't collapse it to an icon."
    >
      <template #do>
        <Button variant="solid" :loading="true">Saving</Button>
      </template>
      <template #dont>
        <Button variant="solid" :loading="true" />
      </template>
    </Guideline>
  </div>
</template>
