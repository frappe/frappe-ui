<script setup lang="ts">
import { ref } from 'vue'
import { DatePicker, DateRangePicker } from 'frappe-ui'

const date = ref('')
const range = ref<string[]>([])
</script>

<template>
  <div class="grid w-full max-w-sm gap-6 py-10">
    <DatePicker
      v-model="date"
      label="Date"
      placeholder="Try “tomorrow” or “may 4”"
    />
    <DateRangePicker
      v-model="range"
      label="Range"
      placeholder="Try “last 7 days” or “may 4 to may 26”"
    />
    <p class="text-sm text-ink-gray-7">
      Type a phrase and press Enter: tomorrow, next friday, in 3 days, +2w,
      last 7 days, this quarter, since may 4.
    </p>
  </div>
</template>
