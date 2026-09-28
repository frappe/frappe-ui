<script setup lang="ts">
import { Spinner, Button } from 'frappe-ui'
</script>

<template>
  <div class="flex flex-col gap-8">
    <!-- 1. Match the spinner color to its context -->
    <Guideline caption="Match the spinner color to the context it sits in.">
      <template #do>
        <div class="flex flex-col items-start gap-2">
          <span
            class="inline-flex items-center gap-1.5 rounded-full bg-surface-gray-2 px-2.5 py-1 text-base text-ink-gray-7"
          >
            <Spinner theme="gray" class="size-3.5" />
            Deleting
          </span>
          <span
            class="inline-flex items-center gap-1.5 rounded-full bg-surface-red-2 px-2.5 py-1 text-base text-ink-red-6"
          >
            <Spinner theme="red" class="size-3.5" />
            Deleting
          </span>
        </div>
      </template>
      <template #dont>
        <span
          class="inline-flex items-center gap-1.5 rounded-full bg-surface-gray-2 px-2.5 py-1 text-base text-ink-gray-7"
        >
          <Spinner theme="red" class="size-3.5" />
          Deleting
        </span>
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
