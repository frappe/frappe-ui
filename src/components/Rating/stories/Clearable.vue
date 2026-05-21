<script setup lang="ts">
import { ref } from 'vue'
import { Rating } from 'frappe-ui'

// Default behavior: re-clicking the selected star clears the rating to 0.
const clearable = ref(3)

// Opt-out: bind manually and drop the 0 emitted when the user re-clicks
// the selected star. Any non-zero update is accepted as normal.
const sticky = ref(3)
function onSticky(next: number) {
  if (next === 0) return
  sticky.value = next
}
</script>

<template>
  <div class="w-full flex flex-col gap-4 items-start">
    <Rating
      v-model="clearable"
      label="Default — click the selected star to clear"
    />
    <Rating
      :model-value="sticky"
      label="Disabled — re-clicking keeps the value"
      @update:model-value="onSticky"
    />
  </div>
</template>
