<script setup lang="ts">
import { ref } from 'vue'
import { FormLabel } from 'frappe-ui'

const color = ref('#2563eb')
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <FormLabel id="brand-color" label="Brand color" required />
    <div class="flex items-center gap-2">
      <input
        id="brand-color"
        v-model="color"
        type="color"
        required
        class="h-7 w-10 cursor-pointer rounded-4 border border-outline-gray-2 bg-surface-base p-0.5"
      />
      <span class="text-base text-ink-gray-7 tabular-nums">{{ color }}</span>
    </div>
  </div>
</template>
